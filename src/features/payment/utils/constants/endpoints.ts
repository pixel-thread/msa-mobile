export const paymentEndpoints = {
  providers: '/payments/providers',
  getProvider: (id: string) => `/payments/providers/${id}`,
  activateProvider: (id: string) => `/payments/providers/${id}/activate`,
} as const;
