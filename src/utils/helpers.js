/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: PKR)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'PKR') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency} 0`;
  }
  return `${currency} ${amount.toLocaleString('en-PK')}`;
};

/**
 * Formats a date string
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a date for display in a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (e.g., "Monday, January 15, 2024")
 */
export const formatDisplayDate = (dateString) => {
  return formatDate(dateString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gets the minimum date for appointment booking (today)
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getMinAppointmentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Gets the maximum date for appointment booking (3 months from now)
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getMaxAppointmentDate = () => {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  return maxDate.toISOString().split('T')[0];
};

/**
 * Gets the day name from a date string
 * @param {string} dateString - ISO date string
 * @returns {string} - Day name (e.g., "Monday")
 */
export const getDayName = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  } catch (error) {
    console.error('Error getting day name:', error);
    return '';
  }
};

/**
 * Checks if a date is a Monday
 * @param {string} dateString - ISO date string
 * @returns {boolean} - True if Monday, false otherwise
 */
export const isMonday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return date.getDay() === 1;
  } catch (error) {
    return false;
  }
};

/**
 * Generates a random ID (for temporary use)
 * @returns {string} - Random ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Scrolls to an element smoothly
 * @param {string} elementId - Element ID to scroll to
 * @param {number} offset - Offset in pixels (default: 80 for navbar)
 */
export const scrollToElement = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Scrolls to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Determines a gender-based fallback avatar for a doctor using initials and soft color styling.
 * @param {Object} doctor - Doctor object
 * @returns {{ initials: string, gender: string }}
 */
export const getDoctorAvatarData = (doctor = {}) => {
  const name = (doctor.name || 'Doctor').trim();
  const normalizedName = name.toLowerCase();
  const genderValue = (doctor.gender || '').toLowerCase();

  const femaleNameHints = [
    'nasreen', 'sadia', 'fatima', 'maryam', 'aisha', 'maria', 'sana',
    'hira', 'sara', 'zara', 'nida', 'farah', 'samra', 'anila', 'azra',
    'kiran', 'fiza', 'hina', 'alina', 'laiba', 'saba', 'amna'
  ];

  const maleNameHints = [
    'ali', 'ahmed', 'hamza', 'hassan', 'usman', 'saad', 'muhammad',
    'omar', 'imran', 'danish', 'bilal', 'haris', 'zain', 'asad', 'waqas',
    'shah', 'talha', 'kamran', 'nabeel', 'faizan', 'john', 'smith'
  ];

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'DR';

  let gender = 'neutral';

  if (genderValue.includes('female') || femaleNameHints.some((hint) => normalizedName.includes(hint))) {
    gender = 'female';
  } else if (genderValue.includes('male') || maleNameHints.some((hint) => normalizedName.includes(hint))) {
    gender = 'male';
  }

  return { initials, gender };
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Checks if the user is on a mobile device
 * @returns {boolean} - True if mobile, false otherwise
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Formats phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as: 0300 1234567
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  
  // Format as: +92 300 1234567
  if (cleaned.length === 12 && cleaned.startsWith('92')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

/**
 * Gets a status badge class based on status type
 * @param {string} status - Status string
 * @returns {string} - CSS class name
 */
export const getStatusBadgeClass = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower === 'paid' || statusLower === 'completed') {
    return 'status-paid';
  }
  
  if (statusLower === 'pending' || statusLower === 'booked') {
    return 'status-pending';
  }
  
  if (statusLower === 'cancelled' || statusLower === 'failed') {
    return 'status-cancelled';
  }
  
  return 'status-default';
};

/**
 * Delays execution for a specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
