export const memberEndpoints = {
  list: '/members',
  detail: (id: string) => `/members/${id}`,
  updateStatus: (id: string) => `/admin/users/${id}/approve`,
  manageRole: (id: string) => `/members/${id}/role`,
} as const;
