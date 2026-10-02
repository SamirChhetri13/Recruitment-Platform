export const JOB_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Full Time', value: 'full-time' },
  { label: 'Part Time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Remote', value: 'remote' },
];

export const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: '' },
  { label: 'Entry Level', value: 'entry' },
  { label: 'Mid Level', value: 'mid' },
  { label: 'Senior Level', value: 'senior' },
  { label: 'Lead / Executive', value: 'lead' },
];

export const APPLICATION_STATUSES = [
  { label: 'Applied', value: 'applied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { label: 'Shortlisted', value: 'shortlisted', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { label: 'Hired', value: 'hired', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { label: 'Rejected', value: 'rejected', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
];

export const USER_ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};
