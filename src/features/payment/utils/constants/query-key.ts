export const PaymentQueryKeys = {
  all: () => ['payment', 'providers', 'all'] as const,
  detail: (id: string) => ['payment', 'providers', 'detail', id] as const,
} as const;
