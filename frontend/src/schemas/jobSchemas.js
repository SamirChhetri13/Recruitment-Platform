import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  skills: z.string().transform((val) => 
    val.split(',').map((s) => s.trim()).filter(Boolean)
  ),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  status: z.enum(['open', 'closed']).default('open'),
});
