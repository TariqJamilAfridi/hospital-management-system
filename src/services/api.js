import { API_BASE_URL, ERROR_MESSAGES } from '../config/constants';

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Makes an HTTP request with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Parse response body
    const data = await response.json().catch(() => null);

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = data?.message || getErrorMessage(response.status);
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    // Network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new ApiError(ERROR_MESSAGES.network, 0, null);
    }

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Unknown errors
    console.error('API request error:', error);
    throw new ApiError(ERROR_MESSAGES.serverError, 500, null);
  }
};

/**
 * Gets appropriate error message based on status code
 * @param {number} status - HTTP status code
 * @returns {string} - Error message
 */
const getErrorMessage = (status) => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.validation;
    case 401:
      return ERROR_MESSAGES.unauthorized;
    case 404:
      return ERROR_MESSAGES.notFound;
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.serverError;
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// ==================== Appointment API ====================

/**
 * Creates a new appointment
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<Object>} - Created appointment
 */
export const createAppointment = async (appointmentData) => {
  return apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};

/**
 * Gets all appointments with optional filters
 * @param {Object} filters - Query filters (date, status, etc.)
 * @returns {Promise<Array>} - List of appointments
 */
export const getAppointments = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/appointments?${queryString}` : '/appointments';
  
  return apiRequest(endpoint);
};

/**
 * Gets a single appointment by ID
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Appointment details
 */
export const getAppointmentById = async (appointmentId) => {
  return apiRequest(`/appointments/${appointmentId}`);
};

/**
 * Updates appointment status
 * @param {string} appointmentId - Appointment ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated appointment
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  return apiRequest(`/appointments/${appointmentId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ appointmentStatus: status }),
  });
};

/**
 * Cancels an appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Updated appointment
 */
export const cancelAppointment = async (appointmentId) => {
  return updateAppointmentStatus(appointmentId, 'Cancelled');
};

/**
 * Marks an appointment as completed
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Updated appointment
 */
export const completeAppointment = async (appointmentId) => {
  return updateAppointmentStatus(appointmentId, 'Completed');
};

// ==================== Payment API ====================

/**
 * Initiates a payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Payment response with tracker URL
 */
export const initiatePayment = async (paymentData) => {
  return apiRequest('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
};

/**
 * Updates payment status for an appointment
 * @param {string} appointmentId - Appointment ID
 * @param {string} paymentStatus - Payment status
 * @returns {Promise<Object>} - Updated appointment
 */
export const updatePaymentStatus = async (appointmentId, paymentStatus) => {
  return apiRequest(`/payments/${appointmentId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ paymentStatus }),
  });
};

// ==================== Safepay API ====================

/**
 * Creates a Safepay checkout session
 * @param {Object} checkoutData - Checkout data with appointmentId and amount
 * @returns {Promise<Object>} - Checkout session with tracker URL
 */
export const createSafepayCheckout = async (checkoutData) => {
  return apiRequest('/safepay/create-session', {
    method: 'POST',
    body: JSON.stringify(checkoutData),
  });
};

// ==================== Health Check ====================

/**
 * Checks if the API is healthy
 * @returns {Promise<Object>} - Health status
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(API_BASE_URL.replace('/api', ''));
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Unable to connect to the server');
  }
};

// Export ApiError for use in components
export { ApiError };


// ==================== Doctor API ====================

/**
 * Gets all active doctors
 * @param {Object} filters - Query filters (specialty, search, etc.)
 * @returns {Promise<Array>} - List of doctors
 */
export const getDoctors = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/doctors?${queryString}` : '/doctors';
  
  return apiRequest(endpoint);
};

/**
 * Gets a single doctor by ID
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} - Doctor details
 */
export const getDoctorById = async (doctorId) => {
  return apiRequest(`/doctors/${doctorId}`);
};

/**
 * Adds a new doctor (Admin only)
 * @param {Object} doctorData - Doctor data
 * @returns {Promise<Object>} - Created doctor
 */
export const addDoctor = async (doctorData) => {
  return apiRequest('/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData),
  });
};

/**
 * Updates a doctor (Admin only)
 * @param {string} doctorId - Doctor ID
 * @param {Object} doctorData - Updated doctor data
 * @returns {Promise<Object>} - Updated doctor
 */
export const updateDoctor = async (doctorId, doctorData) => {
  return apiRequest(`/doctors/${doctorId}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData),
  });
};

/**
 * Deletes a doctor (Admin only)
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteDoctor = async (doctorId) => {
  return apiRequest(`/doctors/${doctorId}`, {
    method: 'DELETE',
  });
};

/**
 * Gets list of all specialties
 * @returns {Promise<Array>} - List of specialties
 */
export const getSpecialties = async () => {
  return apiRequest('/doctors/specialties/list');
};

// ==================== User Appointments API ====================

/**
 * Gets current user's appointments
 * @returns {Promise<Array>} - List of user's appointments
 */
export const getMyAppointments = async () => {
  return apiRequest('/appointments/my-appointments');
};

/**
 * Gets booked time slots for a specific date and doctor
 * @param {string} date - Appointment date
 * @param {string} doctor - Doctor name
 * @returns {Promise<Array>} - List of booked time slots
 */
export const getBookedSlots = async (date, doctor) => {
  const queryParams = new URLSearchParams({ date, doctor });
  return apiRequest(`/appointments/booked-slots?${queryParams}`);
};
