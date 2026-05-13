export const memberEndpoints = {
  list: '/members',
  detail: (id: string) => `/members/${id}`,
  updateStatus: (id: string) => `/members/${id}/status`,
} as const;
