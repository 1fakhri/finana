export interface Subscription {
  id: number;
  userId: string;
  name: string;
  icon: string | null;
  monthlyCost: number;
  billingDate: number;
  status: "active" | "cancelled" | "paused";
  category: string;
  notes: string | null;
  targetUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
