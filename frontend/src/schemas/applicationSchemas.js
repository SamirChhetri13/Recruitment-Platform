import { z } from 'zod';

export const applicationSchema = z.object({
  resumeUrl: z.string().min(1, 'Resume URL or file link is required'),
  coverLetter: z.string().optional(),
});
