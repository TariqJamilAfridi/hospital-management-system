// Application-wide constants
export const APP_NAME = 'CarePlus Hospital';
export const APP_TAGLINE = 'Quality Healthcare You Can Trust';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : '/api'
);
export const API_TIMEOUT = 30000; // 30 seconds

// Appointment Configuration
export const APPOINTMENT_CONFIG = {
  availableDays: [1], // Monday = 1
  availableTimeSlots: [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
  ],
  defaultFee: 2000,
  currency: 'PKR',
};

// Doctor Configuration
export const DOCTORS = [
  {
    id: 'nasreen-kasor',
    name: 'Dr. Nasreen Kasor',
    fullName: 'Dr. Nasreen Kasor',
    specialty: 'Gynecology Specialist',
    availability: 'Every Monday, 9:00 AM - 2:00 PM',
    availableDays: 'Monday',
    availableTime: '9:00 AM - 2:00 PM',
    fee: 2000,
    experience: '15+ years',
    qualifications: 'MBBS, FCPS (Gynecology)',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    about: 'Dr. Nasreen Kasor is a highly experienced gynecology specialist with over 15 years of dedicated service in women\'s healthcare. She is known for her compassionate approach and expertise in managing complex gynecological conditions.',
    expertise: [
      'Prenatal and Postnatal Care',
      'High-Risk Pregnancy Management',
      'Gynecological Surgery',
      'Family Planning',
      'Menopause Management'
    ],
  },
];

// Appointment Status
export const APPOINTMENT_STATUS = {
  BOOKED: 'Booked',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

// Contact Information
export const CONTACT_INFO = {
  address: '123 Healthcare Avenue, Karachi, Pakistan',
  phone: '+92 300 1234567',
  email: 'info@careplushospital.com',
  emergencyPhone: '+92 300 9876543',
};

// Services
export const SERVICES = [
  {
    id: 'general-medicine',
    title: 'General Medicine',
    description: 'Complete medical care for common illnesses and health conditions.',
    icon: '🩺',
  },
  {
    id: 'gynecology',
    title: 'Gynecology',
    description: 'Professional healthcare services for women\'s health and wellness.',
    icon: '👩‍⚕️',
  },
  {
    id: 'laboratory',
    title: 'Laboratory Services',
    description: 'Reliable laboratory testing to support accurate diagnosis.',
    icon: '🔬',
  },
  {
    id: 'emergency',
    title: 'Emergency Care',
    description: 'Quick and professional medical care for emergency situations.',
    icon: '🚑',
  },
];

// Form Validation Rules
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s.'-]+$/,
    message: 'Please enter a valid name (letters, spaces, dots, hyphens, and apostrophes only)',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^(\+92|0)?[0-9]{10}$/,
    message: 'Please enter a valid phone number (e.g., 03001234567 or +923001234567)',
  },
};

// Date Utilities
export const DATE_FORMATS = {
  display: 'MMMM DD, YYYY',
  input: 'YYYY-MM-DD',
  time12: 'hh:mm A',
  time24: 'HH:mm',
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your internet connection and try again.',
  serverError: 'Something went wrong on our end. Please try again later.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'You are not authorized to perform this action.',
  validation: 'Please check your input and try again.',
  appointmentUnavailable: 'This time slot is no longer available. Please select another time.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  appointmentBooked: 'Your appointment has been successfully booked!',
  paymentComplete: 'Payment completed successfully!',
  formSubmitted: 'Your form has been submitted successfully!',
};
