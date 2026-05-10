import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormData = z.infer<typeof SignInSchema>;
