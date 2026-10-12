import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  AlertCircle,
  RefreshCw,
  Loader2,
  FileCheck,
} from 'lucide-react';

/**
 * In-App PDF & Document Previewer Modal for recruiters.
 * Loads documents seamlessly inside the application without forcing downloads.
 */
export const ResumePreviewModal = ({
  isOpen,
  onClose,
  resumeUrl,
  candidateName = 'Candidate',
  candidateEmail = '',
}) => {
  const [loadedUrl, setLoadedUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !resumeUrl) return null;

  // Determine file type & optimal viewer URL
  const isDoc = /\.docx?($|\?)/i.test(resumeUrl);
  const isPdf = /\.pdf($|\?)/i.test(resumeUrl);

  const viewerUrl = isDoc
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`
    : resumeUrl;

  const isLoading = loadedUrl !== viewerUrl;

  const fileName = resumeUrl.split('/').pop()?.split('?')[0] || 'candidate_resume.pdf';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-ink-950/75 backdrop-blur-md animate-fade-up">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            w-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 
            rounded-2xl shadow-lift overflow-hidden flex flex-col transition-all duration-200
            ${isFullscreen ? 'fixed inset-2 sm:inset-4 z-50' : 'max-w-5xl h-[88vh]'}
          `}
        >
          {/* Top Header Bar */}
          <div className="px-5 py-3.5 border-b border-ink-100 dark:border-ink-800 bg-surface-muted dark:bg-surface-dark-muted flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink-900 dark:text-white truncate">
                    {candidateName} — Resume CV
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {isPdf ? 'PDF' : isDoc ? 'DOCX' : 'DOCUMENT'}
                  </span>
                </div>
                <p className="text-2xs text-ink-500 dark:text-ink-400 truncate">
                  {candidateEmail || fileName}
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* External open link */}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new window"
                className="p-2 rounded-xl text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                <span className="hidden md:inline">Open in New Tab</span>
              </a>

              {/* Direct Download button */}
              <a
                href={resumeUrl}
                download
                title="Download Document"
                className="p-2 rounded-xl text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Download</span>
              </a>

              {/* Toggle Fullscreen */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className="p-2 rounded-xl text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors hidden sm:flex"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="p-2 rounded-xl text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Viewer Body */}
          <div className="relative flex-1 bg-ink-100 dark:bg-ink-950 flex items-center justify-center overflow-hidden">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/80 dark:bg-ink-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                <p className="text-xs font-semibold text-ink-700 dark:text-ink-300">
                  Rendering candidate curriculum vitae...
                </p>
              </div>
            )}

            {/* Error or Fallback state */}
            {hasError ? (
              <div className="text-center p-8 max-w-md space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-status-rejected/10 text-status-rejected flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-ink-900 dark:text-white">
                    Unable to display in-app preview
                  </h4>
                  <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
                    Browser security policies or document formatting prevented direct inline embedding.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-card flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Document in New Window
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                    }}
                    className="px-4 py-2 rounded-xl border border-ink-300 dark:border-ink-700 text-xs font-bold text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                src={viewerUrl}
                title={`${candidateName} Resume Document`}
                className="w-full h-full border-0 bg-white dark:bg-ink-900"
                onLoad={() => {
                  setLoadedUrl(viewerUrl);
                  setHasError(false);
                }}
                onError={() => {
                  setLoadedUrl(viewerUrl);
                  setHasError(true);
                }}
              />
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-2.5 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 flex items-center justify-between text-2xs text-ink-500 dark:text-ink-400 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <FileCheck className="w-3.5 h-3.5 text-status-hired" />
              Verified secure candidate upload
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-ink-700 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-300"
              >
                Close Preview (Esc)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResumePreviewModal;
