import { passwordValidation } from '@src/shared/validators';
import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  password: passwordValidation,
  token: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
