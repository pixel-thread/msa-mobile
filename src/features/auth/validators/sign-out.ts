import { z } from 'zod';

export const SignOutSchema = z.object({
  token: z.string().min(6, 'Password must be at least 6 characters'),
});
