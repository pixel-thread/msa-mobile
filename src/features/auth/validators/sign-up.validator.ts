import { z } from 'zod';
import { REGEX, MESSAGES } from '@src/shared/constants';
import { passwordValidation } from '@src/shared/validators/common';

export const SignUpSchema = z.object({
  name: z.string().min(3, 'Name must be at least 2 characters').regex(REGEX.NAME, MESSAGES.NAME),
  email: z.email(MESSAGES.EMAIL),
  password: passwordValidation,
  association_slug: z
    .string('Association slug is required')
    .default(process.env.EXPO_PUBLIC_ASSOCIATION_SLUG || '')
    .optional(),
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;
