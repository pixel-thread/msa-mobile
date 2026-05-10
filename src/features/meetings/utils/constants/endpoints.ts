export const meetingEndpoints = {
  list: '/meetings',
  detail: (id: string) => `/meetings/${id}`,
  agenda: (id: string) => `/meetings/${id}/agenda`,
  attendees: (id: string) => `/meetings/${id}/attendees`,
} as const;
