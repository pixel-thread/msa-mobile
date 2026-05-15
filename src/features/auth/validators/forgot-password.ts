import { z } from 'zod';
import { MESSAGES } from '@src/shared/constants';

export const ForgotPasswordSchema = z.object({
  email: z.email(MESSAGES.EMAIL),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
