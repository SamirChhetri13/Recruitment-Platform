import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Building2, MapPin, DollarSign, Tag, AlertCircle, PlusCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { jobSchema } from '../../schemas/jobSchemas';
import { createJob, updateJob } from '../../api/jobs.api';

export const JobFormModal = ({ isOpen, onClose, jobToEdit = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const isEditing = Boolean(jobToEdit?._id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      jobType: 'full-time',
      experienceLevel: 'entry',
      description: '',
      skills: '',
      salaryMin: '',
      salaryMax: '',
      status: 'open',
    },
  });

  useEffect(() => {
    if (jobToEdit) {
      setValue('title', jobToEdit.title || '');
      setValue('company', jobToEdit.company || '');
      setValue('location', jobToEdit.location || '');
      setValue('jobType', jobToEdit.jobType || 'full-time');
      setValue('experienceLevel', jobToEdit.experienceLevel || 'entry');
      setValue('description', jobToEdit.description || '');
      setValue('skills', Array.isArray(jobToEdit.skills) ? jobToEdit.skills.join(', ') : jobToEdit.skills || '');
      setValue('salaryMin', jobToEdit.salaryMin || '');
      setValue('salaryMax', jobToEdit.salaryMax || '');
      setValue('status', jobToEdit.status || 'open');
    } else {
      reset();
    }
  }, [jobToEdit, setValue, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setLoading(true);
      if (isEditing) {
        await updateJob(jobToEdit._id, data);
      } else {
        await createJob(data);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Failed to save job vacancy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Job Vacancy' : 'Post New Job Vacancy'}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {apiError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Job Title *</label>
              <input
                {...register('title')}
                placeholder="Senior Full Stack Engineer"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
              {errors.title && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Company Name *</label>
              <input
                {...register('company')}
                placeholder="Acme Corp"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
              {errors.company && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.company.message}</p>}
            </div>
          </div>

          {/* Location & Job Type & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Location *</label>
              <input
                {...register('location')}
                placeholder="Remote / San Francisco, CA"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
              {errors.location && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.location.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Job Type *</label>
              <select {...register('jobType')} className="w-full p-2.5 rounded-xl glass-input text-xs bg-[var(--surface)] text-[var(--text)]">
                <option value="full-time" className="bg-[var(--bg-elevated)] text-[var(--text)]">Full Time</option>
                <option value="part-time" className="bg-[var(--bg-elevated)] text-[var(--text)]">Part Time</option>
                <option value="contract" className="bg-[var(--bg-elevated)] text-[var(--text)]">Contract</option>
                <option value="internship" className="bg-[var(--bg-elevated)] text-[var(--text)]">Internship</option>
                <option value="remote" className="bg-[var(--bg-elevated)] text-[var(--text)]">Remote</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Experience Level *</label>
              <select {...register('experienceLevel')} className="w-full p-2.5 rounded-xl glass-input text-xs bg-[var(--surface)] text-[var(--text)]">
                <option value="entry" className="bg-[var(--bg-elevated)] text-[var(--text)]">Entry Level</option>
                <option value="mid" className="bg-[var(--bg-elevated)] text-[var(--text)]">Mid Level</option>
                <option value="senior" className="bg-[var(--bg-elevated)] text-[var(--text)]">Senior Level</option>
                <option value="lead" className="bg-[var(--bg-elevated)] text-[var(--text)]">Lead / Executive</option>
              </select>
            </div>
          </div>

          {/* Salary Min & Max */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Minimum Salary ($/yr)</label>
              <input
                {...register('salaryMin')}
                type="number"
                placeholder="80000"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Maximum Salary ($/yr)</label>
              <input
                {...register('salaryMax')}
                type="number"
                placeholder="120000"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Skills (comma separated) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Required Skills <span className="text-[var(--text-subtle)] font-normal">(Comma separated)</span>
            </label>
            <input
              {...register('skills')}
              placeholder="React, Node.js, MongoDB, TypeScript, Tailwind"
              className="w-full p-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Job Status (if editing) */}
          {isEditing && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Vacancy Status</label>
              <select {...register('status')} className="w-full p-2.5 rounded-xl glass-input text-xs bg-[var(--surface)] text-[var(--text)]">
                <option value="open" className="bg-[var(--bg-elevated)] text-[var(--text)]">Open (Accepting Applicants)</option>
                <option value="closed" className="bg-[var(--bg-elevated)] text-[var(--text)]">Closed (Archived)</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Detailed Description & Requirements *</label>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="Outline role responsibilities, team structure, qualifications..."
              className="w-full p-3 rounded-xl glass-input text-xs text-[var(--text)]"
            />
            {errors.description && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.description.message}</p>}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text)] glass-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEditing ? (
                'Save Vacancy Changes'
              ) : (
                'Publish Job Vacancy'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
