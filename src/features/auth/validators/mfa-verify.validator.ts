import { z } from 'zod';

export const mfaVerifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export type MfaVerifyFormData = z.infer<typeof mfaVerifySchema>;
