import { supabaseAdmin } from "../lib/supabaseAdmin.js";

// --- User Profile ---

export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(`getUserProfile: ${error.message}`);
  return data;
}

// --- Subscriptions ---

export async function getSubscriptions(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("billing_date", { ascending: true });

  if (error) throw new Error(`getSubscriptions: ${error.message}`);
  return data;
}

export async function updateSubscriptionStatus(
  id: number,
  status: "active" | "cancelled" | "paused"
) {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updateSubscriptionStatus: ${error.message}`);
  return data;
}

// --- Transactions ---

export async function getTransactions(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });

  if (error) throw new Error(`getTransactions: ${error.message}`);
  return data;
}

// --- Spending Summary (view) ---

export async function getSpendingSummary(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("spending_summaries")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(`getSpendingSummary: ${error.message}`);
  return data;
}

// --- Roast Ammo ---

export interface RoastAmmo {
  uberEatsCount: number;
  shoppingSpreeCount: number;
  wastedSubMonthly: number;
  unusedSubscriptions: string[];
  savingsGap: number;
  subscriptionIncomeRatio: number;
}

/**
 * Computes roast vectors from subscriptions + transactions + profile data.
 * Returns pre-computed ammunition for the voice agent to reference.
 */
export async function getRoastAmmo(userId: string): Promise<RoastAmmo> {
  const [profile, subscriptions, transactions] = await Promise.all([
    getUserProfile(userId),
    getSubscriptions(userId),
    getTransactions(userId),
  ]);

  // 1. Unused subscriptions — subs with notes hinting at non-use
  const unusedKeywords = [
    "hasn't logged",
    "forgot to cancel",
    "never reads",
    "ordered once",
  ];
  const unusedSubs = subscriptions.filter(
    (s: { status: string; notes: string | null }) =>
      s.status === "active" &&
      s.notes &&
      unusedKeywords.some((kw) => s.notes!.toLowerCase().includes(kw))
  );
  const unusedSubscriptions = unusedSubs.map(
    (s: { name: string }) => s.name
  );
  const wastedSubMonthly = unusedSubs.reduce(
    (sum: number, s: { monthly_cost: number }) => sum + Number(s.monthly_cost),
    0
  );

  // 2. Uber Eats addiction — count food delivery transactions
  const uberEatsCount = transactions.filter(
    (t: { merchant: string | null }) =>
      t.merchant?.toLowerCase().includes("uber eats")
  ).length;

  // 3. Shopping spree — count shopping transactions
  const shoppingSpreeCount = transactions.filter(
    (t: { category: string }) => t.category === "Shopping"
  ).length;

  // 4. Savings gap
  const savingsGap =
    Number(profile.savings_goal) - Number(profile.savings_progress);

  // 5. Subscription-to-income ratio
  const totalSubCost = subscriptions
    .filter((s: { status: string }) => s.status === "active")
    .reduce(
      (sum: number, s: { monthly_cost: number }) =>
        sum + Number(s.monthly_cost),
      0
    );
  const subscriptionIncomeRatio =
    Number(profile.monthly_income) > 0
      ? totalSubCost / Number(profile.monthly_income)
      : 0;

  return {
    uberEatsCount,
    shoppingSpreeCount,
    wastedSubMonthly: Math.round(wastedSubMonthly * 100) / 100,
    unusedSubscriptions,
    savingsGap: Math.round(savingsGap * 100) / 100,
    subscriptionIncomeRatio:
      Math.round(subscriptionIncomeRatio * 1000) / 1000,
  };
}
