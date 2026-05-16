export const announcementEndpoints = {
  list: '/announcements',
  detail: (id: string) => `/announcements/${id}`,
} as const;