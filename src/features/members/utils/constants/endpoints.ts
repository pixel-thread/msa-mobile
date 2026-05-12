export const memberEndpoints = {
  list: '/members',
  detail: (id: string) => `/members/${id}`,
} as const;
