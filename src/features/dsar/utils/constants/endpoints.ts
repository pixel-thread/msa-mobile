export const dsarEndpoints = {
  submit: '/dsar/submit',
  my: '/dsar/my',
  list: '/dsar',
  detail: (id: string) => `/dsar/${id}`,
  respond: (id: string) => `/dsar/${id}/respond`,
  assign: (id: string) => `/dsar/${id}/assign`,
  slaReport: '/dsar/sla-report',
} as const;
