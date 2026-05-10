export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  MFA_TEMP_TOKEN: 'mfa_temp_token',
} as const;

export type SecureStoreKey = (typeof SECURE_STORE_KEYS)[keyof typeof SECURE_STORE_KEYS];
