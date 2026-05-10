import { z } from 'zod';
import { REGEX, MESSAGES } from '@src/shared/constants';
import { passwordValidation } from '@src/shared/validators/common';

export const SignUpSchema = z.object({
  name: z.string().min(3, 'Name must be at least 2 characters').regex(REGEX.NAME, MESSAGES.NAME),
  email: z.email(MESSAGES.EMAIL),
  password: passwordValidation,
  association_slug: z.string().min(1, 'Association is required').optional(),
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;
