'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: 'text-green-400',
    title: 'text-green-800',
    message: 'text-green-700',
    progress: 'bg-green-500'
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    message: 'text-red-700',
    progress: 'bg-red-500'
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    progress: 'bg-yellow-500'
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    message: 'text-blue-700',
    progress: 'bg-blue-500'
  }
};

const toastIcons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon
};

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const styles = toastStyles[type];
  const IconComponent = toastIcons[type];

  // Debug logging
  console.log('Toast rendered:', { id, type, title, message, duration });

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);

    if (duration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto dismiss
      const dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(dismissTimer);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full sm:max-w-md md:max-w-lg mx-4
        transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : '-translate-y-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        rounded-lg border shadow-xl p-4 relative overflow-hidden backdrop-blur-sm
        ${styles.bg}
      `}>
        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${styles.progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent className={`h-6 w-6 ${styles.icon}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className={`text-base font-semibold leading-tight ${styles.title}`}>
              {title}
            </h4>
            {message && (
              <p className={`mt-2 text-sm leading-relaxed ${styles.message}`}>
                {message}
              </p>
            )}
          </div>

          {/* Close button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className={`
                inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${styles.icon} hover:bg-white/20 focus:ring-gray-500 transition-colors
              `}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts, onClose }: { 
  toasts: ToastProps[], 
  onClose: (id: string) => void 
}) {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 p-4 space-y-3 pointer-events-none w-full max-w-lg">
      <div className="space-y-3">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            className="pointer-events-auto"
            style={{ 
              transform: `translateY(${index * 8}px)`,
              zIndex: 1000 - index 
            }}
          >
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  );
}