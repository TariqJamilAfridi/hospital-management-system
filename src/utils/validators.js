import { VALIDATION_RULES } from '../config/constants';

/**
 * Validates a full name
 * @param {string} name - The name to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < VALIDATION_RULES.name.minLength) {
    return { isValid: false, error: `Name must be at least ${VALIDATION_RULES.name.minLength} characters` };
  }

  if (trimmedName.length > VALIDATION_RULES.name.maxLength) {
    return { isValid: false, error: `Name must not exceed ${VALIDATION_RULES.name.maxLength} characters` };
  }

  if (!VALIDATION_RULES.name.pattern.test(trimmedName)) {
    return { isValid: false, error: VALIDATION_RULES.name.message };
  }

  return { isValid: true, error: null };
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!VALIDATION_RULES.email.pattern.test(trimmedEmail)) {
    return { isValid: false, error: VALIDATION_RULES.email.message };
  }

  return { isValid: true, error: null };
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim().replace(/[\s-]/g, '');

  if (!VALIDATION_RULES.phone.pattern.test(trimmedPhone)) {
    return { isValid: false, error: VALIDATION_RULES.phone.message };
  }

  return { isValid: true, error: null };
};

/**
 * Validates an appointment date
 * @param {string} date - The date to validate
 * @param {Array<number>} allowedDays - Array of allowed day numbers (0-6, where 0 is Sunday)
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateAppointmentDate = (date, allowedDays = [1]) => {
  if (!date) {
    return { isValid: false, error: 'Appointment date is required' };
  }

  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, error: 'Please provide a valid date' };
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { isValid: false, error: 'Appointment date cannot be in the past' };
  }

  // Check if date is within allowed days
  const dayOfWeek = selectedDate.getDay();
  if (!allowedDays.includes(dayOfWeek)) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allowedDayNames = allowedDays.map(day => dayNames[day]).join(', ');
    return { isValid: false, error: `Appointments are only available on ${allowedDayNames}` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates an appointment time slot
 * @param {string} time - The time slot to validate
 * @param {Array<string>} allowedTimes - Array of allowed time slots
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateAppointmentTime = (time, allowedTimes = []) => {
  if (!time) {
    return { isValid: false, error: 'Appointment time is required' };
  }

  if (!allowedTimes.includes(time)) {
    return { isValid: false, error: 'Please select a valid appointment time' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates all appointment form fields
 * @param {Object} formData - The form data to validate
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateAppointmentForm = (formData, allowedDays = [1], allowedTimes = []) => {
  const errors = {};

  const nameValidation = validateName(formData.fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }

  const dateValidation = validateAppointmentDate(formData.date, allowedDays);
  if (!dateValidation.isValid) {
    errors.date = dateValidation.error;
  }

  const timeValidation = validateAppointmentTime(formData.time, allowedTimes);
  if (!timeValidation.isValid) {
    errors.time = timeValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
};
