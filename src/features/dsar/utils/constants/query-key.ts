export const DSARQueryKeys = {
  all: (params?: Record<string, any>) => ['dsar', 'all', params] as const,
  my: () => ['dsar', 'my'] as const,
  detail: (id: string) => ['dsar', 'detail', id] as const,
  slaReport: () => ['dsar', 'sla-report'] as const,
};
