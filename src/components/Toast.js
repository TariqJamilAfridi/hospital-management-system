import { useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays temporary notification messages to users
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast ('success', 'error', 'warning', 'info')
 * @param {number} props.duration - Duration in milliseconds before auto-dismiss (default: 5000)
 * @param {Function} props.onClose - Callback when toast is closed
 * @param {boolean} props.isVisible - Whether toast is visible
 */
const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  isVisible = false 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const icon = toastIcons[type] || toastIcons.info;

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{icon}</span>
        <p className="toast-message">{message}</p>
      </div>
      {onClose && (
        <button 
          className="toast-close" 
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      )}

      <style>{`
        .toast {
          position: fixed;
          top: 90px;
          right: 20px;
          min-width: 300px;
          max-width: 500px;
          padding: 16px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transform: translateX(120%);
          transition: transform 0.3s ease-in-out;
          z-index: 10000;
        }

        .toast-visible {
          transform: translateX(0);
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .toast-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: bold;
          flex-shrink: 0;
        }

        .toast-message {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          color: #1e293b;
        }

        .toast-close {
          background: none;
          border: none;
          font-size: 18px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s;
        }

        .toast-close:hover {
          color: #1e293b;
        }

        /* Success Toast */
        .toast-success {
          border-left: 4px solid #22c55e;
        }

        .toast-success .toast-icon {
          background-color: #dcfce7;
          color: #166534;
        }

        /* Error Toast */
        .toast-error {
          border-left: 4px solid #ef4444;
        }

        .toast-error .toast-icon {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        /* Warning Toast */
        .toast-warning {
          border-left: 4px solid #f59e0b;
        }

        .toast-warning .toast-icon {
          background-color: #fef3c7;
          color: #92400e;
        }

        /* Info Toast */
        .toast-info {
          border-left: 4px solid #3b82f6;
        }

        .toast-info .toast-icon {
          background-color: #dbeafe;
          color: #1e40af;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .toast {
            left: 20px;
            right: 20px;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
