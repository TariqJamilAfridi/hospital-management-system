const { AppError } = require('./errorHandler');

/**
 * Validates appointment data
 */
const validateAppointmentData = (req, res, next) => {
  const { fullName, email, phone, date, time } = req.body;

  // Check required fields
  if (!fullName || !email || !phone || !date || !time) {
    return next(new AppError('All fields are required', 400));
  }

  // Validate name
  if (typeof fullName !== 'string' || fullName.trim().length < 2) {
    return next(new AppError('Please provide a valid full name', 400));
  }

  if (fullName.length > 100) {
    return next(new AppError('Name is too long', 400));
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // Validate phone
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
    return next(new AppError('Please provide a valid phone number', 400));
  }

  // Validate date
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return next(new AppError('Please provide a valid date', 400));
  }

  // Check if date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return next(new AppError('Appointment date cannot be in the past', 400));
  }

  // Validate day (Monday only)
  if (selectedDate.getDay() !== 1) {
    return next(new AppError('Appointments are only available on Mondays', 400));
  }

  // Validate time
  const allowedTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
  ];

  if (!allowedTimes.includes(time)) {
    return next(new AppError('Please select a valid appointment time', 400));
  }

  next();
};

/**
 * Validates appointment status update
 */
const validateAppointmentStatus = (req, res, next) => {
  const { appointmentStatus } = req.body;

  if (!appointmentStatus) {
    return next(new AppError('Appointment status is required', 400));
  }

  const allowedStatuses = ['Booked', 'Completed', 'Cancelled'];
  
  if (!allowedStatuses.includes(appointmentStatus)) {
    return next(new AppError('Invalid appointment status', 400));
  }

  next();
};

/**
 * Validates payment data
 */
const validatePaymentData = (req, res, next) => {
  const { appointmentId, amount } = req.body;

  if (!appointmentId) {
    return next(new AppError('Appointment ID is required', 400));
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return next(new AppError('Valid payment amount is required', 400));
  }

  next();
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
const sanitizeInput = (req, res, next) => {
  const sanitize = (value) => {
    if (typeof value === 'string') {
      return value.trim().replace(/[<>]/g, '');
    }
    return value;
  };

  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      req.body[key] = sanitize(req.body[key]);
    });
  }

  // Sanitize query params
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitize(req.query[key]);
    });
  }

  next();
};

module.exports = {
  validateAppointmentData,
  validateAppointmentStatus,
  validatePaymentData,
  sanitizeInput,
};
