import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, MapPin, DollarSign, Tag, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Copy } from 'lucide-react';
import { Modal } from '../common/Modal';
import { jobSchema } from '../../schemas/jobSchemas';
import { createJob, updateJob } from '../../api/jobs.api';

export const JobWizardModal = ({ isOpen, onClose, jobToEdit = null, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(jobToEdit?._id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
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
    setCurrentStep(1);
  }, [jobToEdit, setValue, reset, isOpen]);

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['title', 'company', 'location', 'jobType', 'experienceLevel']);
    } else if (currentStep === 2) {
      isValid = await trigger(['skills', 'description']);
    }
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEditing) {
        await updateJob(jobToEdit._id, data);
      } else {
        await createJob(data);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      // Axios interceptor shows toast automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Job Vacancy Wizard' : 'Create Job Vacancy Wizard'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Wizard Steps Progress Indicator */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl glass-panel bg-slate-800/40 border border-slate-700/60">
          {[
            { step: 1, label: 'Job Basics' },
            { step: 2, label: 'Skills & Info' },
            { step: 3, label: 'Salary & Publish' },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep >= s.step
                    ? 'gradient-bg-primary text-white shadow'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>
              <span className={`text-xs font-semibold ${currentStep === s.step ? 'text-indigo-400' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Job Title *</label>
                  <input
                    {...register('title')}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  />
                  {errors.title && <p className="text-[11px] text-rose-400">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Company Name *</label>
                    <input
                      {...register('company')}
                      placeholder="e.g. Vercel Inc."
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                    {errors.company && <p className="text-[11px] text-rose-400">{errors.company.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Location *</label>
                    <input
                      {...register('location')}
                      placeholder="e.g. Remote / New York"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                    {errors.location && <p className="text-[11px] text-rose-400">{errors.location.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Job Type *</label>
                    <select {...register('jobType')} className="w-full p-2.5 rounded-xl glass-input text-xs bg-slate-900">
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Experience Level *</label>
                    <select {...register('experienceLevel')} className="w-full p-2.5 rounded-xl glass-input text-xs bg-slate-900">
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="lead">Lead / Executive</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Required Skills (Comma separated) *</label>
                  <input
                    {...register('skills')}
                    placeholder="React, TypeScript, Tailwind, Node.js, GraphQL"
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  />
                  {errors.skills && <p className="text-[11px] text-rose-400">{errors.skills.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Detailed Description & Responsibilities *</label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Provide clear responsibilities, qualifications, requirements..."
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                  {errors.description && <p className="text-[11px] text-rose-400">{errors.description.message}</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Minimum Annual Salary ($)</label>
                    <input
                      {...register('salaryMin')}
                      type="number"
                      placeholder="90000"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Maximum Annual Salary ($)</label>
                    <input
                      {...register('salaryMax')}
                      type="number"
                      placeholder="140000"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Vacancy Status</label>
                    <select {...register('status')} className="w-full p-2.5 rounded-xl glass-input text-xs bg-slate-900">
                      <option value="open">Open (Accepting Applications)</option>
                      <option value="closed">Closed (Archived)</option>
                    </select>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 glass-panel hover:bg-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 glass-panel"
              >
                Cancel
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg-primary shadow-lg flex items-center gap-1"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isEditing ? (
                  'Save Vacancy Changes'
                ) : (
                  'Publish Vacancy'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};
