export type MeetingAttendee = {
  id: string;
  meetingId: string;
  userId: string;

  attendeeRole: 'REQUIRED' | 'OPTIONAL';
  rsvpStatus: 'ACCEPTED' | 'DECLINED' | 'PENDING' | 'TENTATIVE';

  rsvpNote: string | null;
  rsvpAt: string | null;

  notifiedAt: string | null;

  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    membershipNumber: string;
  };
};
