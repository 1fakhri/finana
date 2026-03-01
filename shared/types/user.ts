export interface UserProfile {
  id: number;
  userId: string;
  name: string;
  email: string;
  age: number | null;
  occupation: string | null;
  monthlyIncome: number;
  accountBalance: number;
  savingsGoal: number;
  savingsProgress: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpendingSummary {
  userId: string;
  totalSpend30d: number;
  subscriptionSpend30d: number;
  subscriptionCount: number;
  foodDeliverySpend30d: number;
  shoppingSpend30d: number;
}
