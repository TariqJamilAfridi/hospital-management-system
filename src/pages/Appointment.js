import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment, getBookedSlots, getDoctors } from "../services/api";
import { APPOINTMENT_CONFIG } from "../config/constants";
import { getDoctorAvatarData, getMinAppointmentDate } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

function Appointment() {
    const navigate = useNavigate();
    
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loadingDoctors, setLoadingDoctors] = useState(true);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [bookedTimes, setBookedTimes] = useState([]);

    // Fetch doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoadingDoctors(true);
                const data = await getDoctors();
                console.log("📋 Fetched doctors for appointment:", data);
                setDoctors(data.doctors || []);
                
                // Auto-select first doctor
                if (data.doctors && data.doctors.length > 0) {
                    setSelectedDoctor(data.doctors[0]);
                }
            } catch (error) {
                console.error("❌ Error fetching doctors:", error);
                setError("Unable to load doctors. Please try again later.");
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    const handleDoctorChange = (event) => {
        const doctor = doctors.find(d => d._id === event.target.value);
        setSelectedDoctor(doctor);
        // Reset date and time when doctor changes
        setFormData({
            ...formData,
            date: "",
            time: "",
        });
        setBookedTimes([]);
    };

    useEffect(() => {
        let cancelled = false;

        const fetchBookedTimes = async () => {
            if (!formData.date || !selectedDoctor) {
                setBookedTimes([]);
                return;
            }

            try {
                // Use the public booked-slots endpoint
                console.log("📅 Fetching booked times for:", formData.date, "Doctor:", selectedDoctor.name);
                const data = await getBookedSlots(formData.date, selectedDoctor._id);

                console.log("📊 Booked slots response:", data);

                // Extract booked slots
                const booked = data.bookedSlots || [];

                console.log("🔴 Booked time slots:", booked);
                if (!cancelled) {
                    setBookedTimes(booked);
                }
                
            } catch (error) {
                console.error("❌ Error fetching booked times:", error);
                if (!cancelled) {
                    setBookedTimes([]); // Reset on error
                }
            }
        };

        fetchBookedTimes();

        return () => {
            cancelled = true;
        };
    }, [formData.date, selectedDoctor]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!formData.date || !formData.time) {
            setError("Please select an appointment date and time.");
            return;
        }

        if (!selectedDoctor) {
            setError("Please select a doctor.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Refresh booked times RIGHT BEFORE booking to get latest data
            console.log("🔄 Refreshing booked times before booking...");
            const data = await getBookedSlots(formData.date, selectedDoctor._id);

            const latestBookedTimes = data.bookedSlots || [];

            console.log("🔴 Latest booked times:", latestBookedTimes);
            console.log("⏰ User selected time:", formData.time);

            // Check if selected time is NOW booked (with latest data)
            if (latestBookedTimes.includes(formData.time)) {
                setLoading(false);
                setError(`❌ Sorry! The time slot ${formData.time} is already booked for ${formData.date}. Please select a different time.`);
                setBookedTimes(latestBookedTimes); // Update state with latest
                return;
            }

            // Proceed with booking
            const result = await createAppointment({
                ...formData,
                doctorId: selectedDoctor._id,
                doctor: selectedDoctor.name,
                specialty: selectedDoctor.specialty,
                fee: selectedDoctor.fee,
            });

            console.log("✅ Appointment saved:", result);

            navigate("/payment", {
                state: {
                    ...formData,
                    doctor: result.appointment.doctor,
                    specialty: result.appointment.specialty,
                    fee: result.appointment.fee,
                    appointmentId: result.appointment._id,
                },
            });
        } catch (error) {
            console.error("❌ Error booking appointment:", error);
            
            // Check if error is about duplicate booking
            if (error.message && error.message.includes("already booked")) {
                setError(`❌ This time slot has just been booked by someone else. Please select a different time.`);
                
                // Refresh the booked times list
                try {
                    const data = await getBookedSlots(formData.date, selectedDoctor._id);
                    const refreshedBooked = data.bookedSlots || [];
                    setBookedTimes(refreshedBooked);
                } catch (refreshError) {
                    console.error("Error refreshing booked times:", refreshError);
                }
            } else {
                setError(
                    error.message ||
                    "Unable to book appointment. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const selectedDoctorAvatar = selectedDoctor ? getDoctorAvatarData(selectedDoctor) : null;

    return (
        <main className="appointment-page">

            {/* Page Header */}
            <section className="appointment-header">
                <h1>Book an Appointment</h1>

                <p>
                    Schedule an appointment with our qualified doctors.
                </p>
            </section>

            {/* Loading Spinner */}
            {loading && <LoadingSpinner message="Booking your appointment..." />}

            {/* Appointment Content */}
            {loadingDoctors ? (
                <div className="loading-message" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading doctors...</p>
                </div>
            ) : doctors.length === 0 ? (
                <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>No doctors available at the moment. Please check back later.</p>
                </div>
            ) : (
                <section className="appointment-section">

                    {/* Doctor Information */}
                    {selectedDoctor && selectedDoctorAvatar && (
                        <div className="appointment-doctor-card">

                            <div className="appointment-doctor-image">
                                <div className={`doctor-avatar doctor-avatar-${selectedDoctorAvatar.gender}`} aria-label={`${selectedDoctor.name} avatar`}>
                                    <span>{selectedDoctorAvatar.initials}</span>
                                </div>
                            </div>

                            <div className="appointment-doctor-info">

                                <h2>{selectedDoctor.name}</h2>

                                <p className="appointment-specialty">
                                    {selectedDoctor.specialty}
                                </p>

                                <p>
                                    <strong>Available:</strong> {selectedDoctor.availableDays || 'Not specified'}
                                </p>

                                <p>
                                    <strong>Time:</strong> {selectedDoctor.availableTime || 'Not specified'}
                                </p>

                                <p>
                                    <strong>Appointment Fee:</strong> PKR {(selectedDoctor.fee || 0).toLocaleString()}
                                </p>

                                {selectedDoctor.experience && (
                                    <p>
                                        <strong>Experience:</strong> {selectedDoctor.experience} years
                                    </p>
                                )}

                            </div>
                            <div className="appointment-availability-note">
                                <strong>⏰ Booking Information:</strong>
                                <p>{selectedDoctor.name} is available {selectedDoctor.availableDays || 'as scheduled'}.</p>
                                {formData.date && (
                                    <p className="booking-status">
                                        {bookedTimes.length > 0 
                                            ? `⚠️ ${bookedTimes.length} slot(s) already booked for this date`
                                            : `✅ All time slots available for this date`
                                        }
                                    </p>
                                )}
                            </div>

                        </div>
                    )}



                {/* Appointment Form */}
                <div className="appointment-form-container">

                    <h2>Patient Information</h2>

                    <form
                        className="appointment-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Doctor Selection */}
                        <div className="form-group">
                            <label htmlFor="doctor">
                                Select Doctor
                            </label>

                            <select
                                id="doctor"
                                value={selectedDoctor?._id || ""}
                                onChange={handleDoctorChange}
                                required
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                        {doc.name} - {doc.specialty} (PKR {(doc.fee || 0).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                id="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="appointment-form-row">

                            <div className="form-group">

                                <label htmlFor="date">
                                    Select Date
                                </label>

                                <input
                                    type="date"
                                    id="date"
                                    min={getMinAppointmentDate()}
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    disabled={!selectedDoctor}
                                />


                            </div>


                            <div className="form-group">

                                <label htmlFor="time">
                                    Select Time
                                </label>

                                <select
                                    id="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.date}
                                >
                                    <option value="">
                                        {!formData.date 
                                            ? "Select a date first" 
                                            : "Select Available Time"
                                        }
                                    </option>

                                    {/* Show ALL time slots WITH visual status indicators */}
                                    {(selectedDoctor?.availableTimeSlots || APPOINTMENT_CONFIG.availableTimeSlots).map((timeSlot) => {
                                        const isBooked = bookedTimes.includes(timeSlot);
                                        return (
                                            <option
                                                key={timeSlot}
                                                value={timeSlot}
                                                style={{
                                                    color: isBooked ? '#dc2626' : '#16a34a',
                                                    fontWeight: isBooked ? 'normal' : '600'
                                                }}
                                            >
                                                {isBooked ? '🔴 ' : '🟢 '}{timeSlot} {isBooked ? '(Booked)' : '(Available)'}
                                            </option>
                                        );
                                    })}
                                </select>

                                {formData.date && (
                                    <small className="time-slot-hint">
                                        {bookedTimes.length === APPOINTMENT_CONFIG.availableTimeSlots.length 
                                            ? "⚠️ All slots are booked for this date. Please select another date."
                                            : `✅ ${APPOINTMENT_CONFIG.availableTimeSlots.length - bookedTimes.length} slot(s) available`
                                        }
                                    </small>
                                )}

                            </div>
                        </div>


                        {/* Appointment Fee */}
                        {selectedDoctor && (
                            <div className="appointment-fee">

                                <span>
                                    Appointment Fee
                                </span>

                                <strong>
                                    PKR {(selectedDoctor.fee || 0).toLocaleString()}
                                </strong>

                            </div>
                        )}


                        {/* Error Message */}
                        {error && (
                            <p className="form-error">
                                {error}
                            </p>
                        )}


                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="primary-btn appointment-submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Booking Appointment..."
                                : "Continue to Payment"}
                        </button>

                    </form>

                </div>

            </section>
            )}

        </main>
    );
}

export default Appointment;