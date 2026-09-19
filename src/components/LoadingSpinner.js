import React from 'react';

/**
 * Loading Spinner Component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner ('small', 'medium', 'large')
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.fullScreen - Whether to show as full screen overlay
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.medium;

  const spinner = (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`loading-spinner ${spinnerClass}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}

      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .loading-spinner-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.95);
          z-index: 9999;
        }

        .loading-spinner {
          display: inline-block;
          position: relative;
        }

        .spinner-circle {
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spinner-rotate 0.8s linear infinite;
        }

        .spinner-small .spinner-circle {
          width: 24px;
          height: 24px;
          border-width: 2px;
        }

        .spinner-medium .spinner-circle {
          width: 40px;
          height: 40px;
          border-width: 3px;
        }

        .spinner-large .spinner-circle {
          width: 60px;
          height: 60px;
          border-width: 4px;
        }

        .loading-message {
          margin-top: 20px;
          font-size: 15px;
          color: #64748b;
          text-align: center;
        }

        @keyframes spinner-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  return spinner;
};

export default LoadingSpinner;
