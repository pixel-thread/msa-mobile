export interface SubscriptionPlan {
  id: string;

  associationId: string;

  name: string;

  description: string | null;

  amount: string;

  currency: string;

  billingCycle: BillingCycle;

  features: SubscriptionFeatures;

  isActive: boolean;

  effectiveFrom: string;

  createdAt: string;

  updatedAt: string;
}

export interface SubscriptionFeatures {
  events: boolean;

  voting: boolean;

  [key: string]: boolean;
}

export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'LIFETIME';
