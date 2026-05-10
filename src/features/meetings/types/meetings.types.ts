export type MeetingType = 'AGM' | 'EGM' | 'COMMITTEE' | 'SPECIAL';

export type MeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MeetingCreator {
  id: string;
  name: string | null;
  email: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  scheduledAt: string | Date;
  venue: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: MeetingCreator;
  _count: {
    attendees: number;
  };
}
