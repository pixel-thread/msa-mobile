export const memberEndpoints = {
  list: '/members',
  detail: (id: string) => `/members/${id}`,
  updateStatus: (id: string) => `/members/${id}/status`,
  manageRole: (id: string) => `/members/${id}/role`,
} as const;
