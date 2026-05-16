import z from 'zod';

export const AdminRecordCompletionSchema = z.object({
  userId: z.uuid('Invalid user ID'),
  moduleId: z.uuid('Invalid module ID'),
  scorePercent: z.number().min(0).max(100).optional(),
  certificateUrl: z.url('Invalid certificate URL').optional(),
});

export type AdminRecordCompletionFormData = z.infer<typeof AdminRecordCompletionSchema>;
