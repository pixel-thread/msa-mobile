import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const SignUpSchema = z.object({
  email: z.email('Invalid email address'),
  password: passwordValidation,
  name: z.string().min(1, 'Name is required'),
  association_slug: z
    .string()
    .min(1, 'Association is required')
    .default(process.env.EXPO_PUBLIC_ASSOCIATION_SLUG!)
    .optional(),
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;
