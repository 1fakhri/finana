import { Router } from "express";
import {
  getUserProfile,
  getSubscriptions,
  getTransactions,
  getSpendingSummary,
  updateSubscriptionStatus,
  getRoastAmmo,
} from "../data/dataService.js";

export const dataRouter = Router();

// GET /api/user/profile
dataRouter.get("/profile", async (req, res) => {
  try {
    const data = await getUserProfile(req.userId!);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// GET /api/user/subscriptions
dataRouter.get("/subscriptions", async (req, res) => {
  try {
    const data = await getSubscriptions(req.userId!);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// GET /api/user/transactions
dataRouter.get("/transactions", async (req, res) => {
  try {
    const data = await getTransactions(req.userId!);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// GET /api/user/summary
dataRouter.get("/summary", async (req, res) => {
  try {
    const [summary, roastAmmo] = await Promise.all([
      getSpendingSummary(req.userId!),
      getRoastAmmo(req.userId!),
    ]);

    // Compute additional fields the PRD expects
    const profile = await getUserProfile(req.userId!);
    const subscriptions = await getSubscriptions(req.userId!);

    const totalSubCost = subscriptions
      .filter((s: { status: string }) => s.status === "active")
      .reduce(
        (sum: number, s: { monthly_cost: number }) =>
          sum + Number(s.monthly_cost),
        0,
      );

    // Determine top spending category
    const categoryTotals: Record<string, number> = {
      Shopping: Number(summary.shopping_spend_30d),
      "Food Delivery": Number(summary.food_delivery_spend_30d),
      Subscription: Number(summary.subscription_spend_30d),
    };
    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] ?? "Unknown";

    res.json({
      total_spend_30d: Number(summary.total_spend_30d),
      subscription_spend_30d: Number(summary.subscription_spend_30d),
      subscription_count: Number(summary.subscription_count),
      subscription_income_ratio: roastAmmo.subscriptionIncomeRatio,
      food_delivery_spend_30d: Number(summary.food_delivery_spend_30d),
      shopping_spend_30d: Number(summary.shopping_spend_30d),
      top_category: topCategory,
      unused_subscriptions: roastAmmo.unusedSubscriptions,
      roast_ammo: {
        uber_eats_count: roastAmmo.uberEatsCount,
        shopping_spree_count: roastAmmo.shoppingSpreeCount,
        wasted_sub_monthly: roastAmmo.wastedSubMonthly,
        savings_gap: roastAmmo.savingsGap,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// PATCH /api/user/subscriptions/:id
dataRouter.patch("/subscriptions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!["active", "cancelled", "paused"].includes(status)) {
      res
        .status(400)
        .json({ error: 'Invalid status. Must be "active", "cancelled", or "paused".' });
      return;
    }

    const data = await updateSubscriptionStatus(id, status);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
