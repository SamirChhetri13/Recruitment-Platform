import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, MapPin, DollarSign, Tag, CheckCircle2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
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
      title={isEditing ? 'Edit Job Vacancy' : 'Post a New Job Vacancy'}
      subtitle="Follow the step-by-step wizard to publish your opening"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Wizard Stepper Progress Bar */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
          {[
            { step: 1, label: '1. Basics' },
            { step: 2, label: '2. Skills & Details' },
            { step: 3, label: '3. Salary & Review' },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep >= s.step
                    ? 'bg-brand-gradient text-white shadow-sm'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-400'
                }`}
              >
                {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>
              <span className={`text-xs font-semibold ${currentStep === s.step ? 'text-brand-600 dark:text-brand-300' : 'text-ink-400'}`}>
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <Input
                  label="Job Title *"
                  placeholder="e.g. Senior Frontend Engineer"
                  leftIcon={Briefcase}
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    placeholder="e.g. Acme Corp"
                    leftIcon={Building2}
                    error={errors.company?.message}
                    {...register('company')}
                  />
                  <Input
                    label="Location *"
                    placeholder="e.g. Remote / New York"
                    leftIcon={MapPin}
                    error={errors.location?.message}
                    {...register('location')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
                      Job Type *
                    </label>
                    <select
                      {...register('jobType')}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:shadow-focus"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
                      Experience Level *
                    </label>
                    <select
                      {...register('experienceLevel')}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:shadow-focus"
                    >
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <Input
                  label="Required Skills (Comma separated) *"
                  placeholder="React, TypeScript, Tailwind, Node.js, GraphQL"
                  leftIcon={Tag}
                  error={errors.skills?.message}
                  {...register('skills')}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
                    Detailed Description & Responsibilities *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Provide clear responsibilities, qualifications, and requirements..."
                    className="w-full p-3 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:shadow-focus"
                  />
                  {errors.description && <p className="text-xs text-status-rejected font-medium">{errors.description.message}</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Minimum Annual Salary ($)"
                    type="number"
                    placeholder="90000"
                    leftIcon={DollarSign}
                    {...register('salaryMin')}
                  />
                  <Input
                    label="Maximum Annual Salary ($)"
                    type="number"
                    placeholder="140000"
                    leftIcon={DollarSign}
                    {...register('salaryMax')}
                  />
                </div>

                {isEditing && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
                      Vacancy Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:shadow-focus"
                    >
                      <option value="open">Open (Accepting Applications)</option>
                      <option value="closed">Closed (Archived)</option>
                    </select>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-ink-800">
            {currentStep > 1 ? (
              <Button type="button" variant="secondary" onClick={handlePrevStep} leftIcon={ChevronLeft}>
                Back
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            )}

            {currentStep < 3 ? (
              <Button type="button" variant="primary" onClick={handleNextStep} rightIcon={ChevronRight}>
                Continue
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={loading}>
                {isEditing ? 'Save Changes' : 'Post Job Vacancy'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default JobWizardModal;
