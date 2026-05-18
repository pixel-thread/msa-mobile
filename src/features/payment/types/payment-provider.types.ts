export type PaymentProviderName = 'RAZORPAY' | 'STRIPE' | 'PAYU' | 'CASHFREE';

export interface ProviderResponse {
  id: string;
  associationId: string;
  provider: PaymentProviderName;
  keyId: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateProviderInput {
  provider: PaymentProviderName;
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
  isActive?: boolean;
}

export interface UpdateProviderInput {
  keyId?: string;
  keySecret?: string;
  webhookSecret?: string;
  isActive?: boolean;
}
