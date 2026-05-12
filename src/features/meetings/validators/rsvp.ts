import { z } from 'zod';

export const RsvpStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
};

export const UpdateAttendeeRsvpSchema = z.object({
  userId: z.uuid().optional(),
  rsvpStatus: z.enum(RsvpStatus, { message: 'Invalid RSVP status' }).optional(),
  rsvpNote: z
    .string({ message: 'RSVP note must be a string' })
    .max(500, 'RSVP note cannot exceed 500 characters')
    .optional(),
});

export type UpdateAttendeeRsvpInput = z.infer<typeof UpdateAttendeeRsvpSchema>;
