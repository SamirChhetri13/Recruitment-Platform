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
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' | 'url'
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

    // Validate type
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setApiError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    // Validate size (5MB = 5 * 1024 * 1024 bytes)
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
        <div className="p-4 rounded-xl glass-panel bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{job.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {job.company} • {job.location}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
            {job.jobType}
          </span>
        </div>

        {/* Feedback Alerts */}
        {apiError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Resume / CV Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resume / CV Document</label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    uploadMode === 'upload' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Upload File
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    uploadMode === 'url' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {uploadMode === 'upload' ? (
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors bg-slate-50 dark:bg-slate-900/40">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                    aria-label="Choose resume file"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    {fileName ? (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate max-w-[240px]">{fileName}</span>
                        </div>
                        {uploading && (
                          <p className="text-[11px] text-blue-600 dark:text-blue-300">Uploading... {uploadProgress}%</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Drop your CV file here or <span className="text-blue-600 dark:text-blue-400">browse</span>
                        </p>
                        <p className="text-[11px] text-slate-500">Supports PDF, DOC, DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {uploading && (
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Uploaded File Details & Preview / Download Link */}
                {currentResumeUrl && !uploading && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                        {fileName || 'Uploaded Resume'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={currentResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        Preview / Download
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-slate-400 hover:text-rose-500 p-1"
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
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  {...register('resumeUrl')}
                  type="url"
                  placeholder="https://example.com/my-resume.pdf"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs min-h-[44px]"
                />
              </div>
            )}

            {errors.resumeUrl && (
              <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1">{errors.resumeUrl.message}</p>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cover Letter / Statement of Interest <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
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
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 glass-panel min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || Boolean(successMsg)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all flex items-center gap-2 min-h-[44px]"
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

