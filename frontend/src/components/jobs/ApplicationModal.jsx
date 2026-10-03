import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, Link as LinkIcon, AlertCircle, CheckCircle2, Building2, ExternalLink, X, FileCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { applicationSchema } from '../../schemas/applicationSchemas';
import { applyToJob, uploadResumeFile } from '../../api/applications.api';

export const ApplicationModal = ({ isOpen, onClose, job, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadMode, setUploadMode] = useState('upload');
  const [fileName, setFileName] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      resumeUrl: '',
      coverLetter: '',
    },
  });

  const currentResumeUrl = watch('resumeUrl');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setApiError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError('File is too large. Maximum resume file size is 5MB.');
      return;
    }

    try {
      setApiError('');
      setUploading(true);
      setUploadProgress(0);
      setFileName(file.name);

      const res = await uploadResumeFile(file, (percent) => setUploadProgress(percent));
      const url = res.data?.resumeUrl || res.resumeUrl;
      setUploadedUrl(url);
      setValue('resumeUrl', url, { shouldValidate: true });
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'File upload failed');
      setFileName('');
      setUploadedUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setUploadedUrl('');
    setUploadProgress(0);
    setValue('resumeUrl', '', { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (!job?._id) return;
    try {
      setApiError('');
      setLoading(true);
      const res = await applyToJob(job._id, data);
      setSuccessMsg(res.message || 'Application submitted successfully!');
      setTimeout(() => {
        reset();
        setSuccessMsg('');
        setFileName('');
        setUploadedUrl('');
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${job.title}`}>
      <div className="space-y-6">
        
        {/* Job Banner */}
        <div className="p-4 rounded-xl glass-panel bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-bold text-[var(--text)]">{job.title}</h4>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {job.company} • {job.location}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 capitalize">
            {job.jobType}
          </span>
        </div>

        {/* Feedback Alerts */}
        {apiError && (
          <div className="p-4 rounded-xl bg-[var(--danger-bg)] border border-[var(--danger)]/30 flex items-start gap-3 text-[var(--danger)] text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/30 flex items-start gap-3 text-[var(--success)] text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Resume / CV Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text)]">Resume / CV Document</label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    uploadMode === 'upload' ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Upload File
                </button>
                <span className="text-[var(--text-subtle)]">|</span>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    uploadMode === 'url' ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {uploadMode === 'upload' ? (
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-[var(--border-strong)] hover:border-[var(--ring)] rounded-2xl p-6 text-center transition-colors bg-[var(--surface)]">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                    aria-label="Choose resume file"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    {fileName ? (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate max-w-[240px]">{fileName}</span>
                        </div>
                        {uploading && (
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-300 font-semibold">Uploading... {uploadProgress}%</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[var(--text)]">
                          Drop your CV file here or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                        </p>
                        <p className="text-[11px] text-[var(--text-subtle)]">Supports PDF, DOC, DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {uploading && (
                  <div className="w-full bg-[var(--border)] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {currentResumeUrl && !uploading && (
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-[var(--text)] font-medium truncate max-w-[200px]">
                        {fileName || 'Uploaded Resume'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={currentResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        Preview / Download
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-[var(--text-subtle)] hover:text-[var(--danger)] p-1 cursor-pointer"
                        title="Remove file"
                        aria-label="Remove resume file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-subtle)] pointer-events-none" />
                <input
                  {...register('resumeUrl')}
                  type="url"
                  placeholder="https://example.com/my-resume.pdf"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs min-h-[44px]"
                />
              </div>
            )}

            {errors.resumeUrl && (
              <p className="text-[11px] text-[var(--danger)] mt-1">{errors.resumeUrl.message}</p>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text)]">
              Cover Letter / Statement of Interest <span className="text-[var(--text-subtle)] font-normal">(Optional)</span>
            </label>
            <textarea
              {...register('coverLetter')}
              rows={4}
              placeholder="Introduce yourself, key achievements, and why you are a great match for this position..."
              className="w-full p-3.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] min-h-[44px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || Boolean(successMsg)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all flex items-center gap-2 min-h-[44px] cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
