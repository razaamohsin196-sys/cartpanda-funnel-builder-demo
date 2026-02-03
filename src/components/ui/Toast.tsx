import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div
      className={`${typeStyles[type]} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[250px] max-w-md animate-in slide-in-from-top-5`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-lg" aria-hidden="true">
        {icons[type]}
      </span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-500 rounded"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;

