import { z } from 'zod';
import { MESSAGES } from '@src/shared/constants';
import { passwordValidation } from '@src/shared/validators/common';

export const SignInSchema = z.object({
  email: z.email(MESSAGES.EMAIL),
  password: passwordValidation,
});

export type SignInFormData = z.infer<typeof SignInSchema>;
