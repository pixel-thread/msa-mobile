import { z } from 'zod';
import { REGEX } from '@src/shared/constants';

export const SignInVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(REGEX.ONLY_NUMBERS, 'Code must contain only numbers'),
  mfa_temp_token: z.string().optional(),
});

export type SignInVerifyFormData = z.infer<typeof SignInVerifySchema>;
