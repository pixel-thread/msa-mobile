import { z } from 'zod';

export const createProviderSchema = z.object({
  provider: z.enum(['RAZORPAY', 'STRIPE', 'PAYU', 'CASHFREE']),
  keyId: z.string().min(1, 'Key ID is required'),
  keySecret: z.string().min(1, 'Key Secret is required'),
  webhookSecret: z.string('webhook secret is required'),
});

export type CreateProviderFormData = z.infer<typeof createProviderSchema>;
