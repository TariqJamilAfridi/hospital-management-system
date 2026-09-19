import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * 
 * @returns {Object} Toast state and control functions
 * 
 * @example
 * const { toast, showToast, hideToast } = useToast();
 * 
 * // Show success message
 * showToast('Appointment booked successfully!', 'success');
 * 
 * // Show error message
 * showToast('Something went wrong', 'error');
 */
export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    duration: 5000,
  });

  /**
   * Shows a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast ('success', 'error', 'warning', 'info')
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    setToast({
      isVisible: true,
      message,
      type,
      duration,
    });
  }, []);

  /**
   * Hides the current toast
   */
  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  /**
   * Shows a success toast
   * @param {string} message - Success message
   */
  const showSuccess = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  /**
   * Shows an error toast
   * @param {string} message - Error message
   */
  const showError = useCallback((message) => {
    showToast(message, 'error');
  }, [showToast]);

  /**
   * Shows a warning toast
   * @param {string} message - Warning message
   */
  const showWarning = useCallback((message) => {
    showToast(message, 'warning');
  }, [showToast]);

  /**
   * Shows an info toast
   * @param {string} message - Info message
   */
  const showInfo = useCallback((message) => {
    showToast(message, 'info');
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;
