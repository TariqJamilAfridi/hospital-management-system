import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment, getAppointments } from "../services/api";
import { APPOINTMENT_CONFIG, DOCTORS } from "../config/constants";
import { getMinAppointmentDate } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

function Appointment() {
    const navigate = useNavigate();
    const doctor = DOCTORS[0]; // Main doctor

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

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    useEffect(() => {
        const fetchBookedTimes = async () => {
            if (!formData.date) {
                setBookedTimes([]);
                return;
            }

            try {
                const data = await getAppointments({ date: formData.date });

                const booked = (data.appointments || data)
                    .filter(
                        (appointment) =>
                            appointment.appointmentStatus !== "Cancelled"
                    )
                    .map((appointment) => appointment.time);

                setBookedTimes(booked);

                // Clear time if it's now booked
                if (booked.includes(formData.time)) {
                    setFormData((previous) => ({
                        ...previous,
                        time: "",
                    }));
                }
            } catch (error) {
                console.error("Error fetching booked times:", error);
            }
        };

        fetchBookedTimes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.date]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!formData.date || !formData.time) {
            setError("Please select an appointment date and time.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await createAppointment(formData);

            console.log("Appointment saved:", result);

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
            console.error("Error booking appointment:", error);
            setError(
                error.message ||
                "Unable to book appointment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="appointment-page">

            {/* Page Header */}
            <section className="appointment-header">
                <h1>Book an Appointment</h1>

                <p>
                    Schedule an appointment with {doctor.name}.
                </p>
            </section>

            {/* Loading Spinner */}
            {loading && <LoadingSpinner message="Booking your appointment..." />}

            {/* Appointment Content */}
            <section className="appointment-section">

                {/* Doctor Information */}
                <div className="appointment-doctor-card">

                    <div className="appointment-doctor-image">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                        />
                    </div>

                    <div className="appointment-doctor-info">

                        <h2>{doctor.name}</h2>

                        <p className="appointment-specialty">
                            {doctor.specialty}
                        </p>

                        <p>
                            <strong>Available:</strong> {doctor.availableDays}
                        </p>

                        <p>
                            <strong>Time:</strong> {doctor.availableTime}
                        </p>

                        <p>
                            <strong>Appointment Fee:</strong> PKR {doctor.fee.toLocaleString()}
                        </p>

                    </div>
                    <div className="appointment-availability-note">
                        <strong>⏰ Booking Information:</strong>
                        <p>{doctor.name} is available {doctor.availability}.</p>
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



                {/* Appointment Form */}
                <div className="appointment-form-container">

                    <h2>Patient Information</h2>

                    <form
                        className="appointment-form"
                        onSubmit={handleSubmit}
                    >

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
                                    onChange={(event) => {
                                        const selectedDate = new Date(event.target.value);

                                        // Check if selected day is Monday (1)
                                        if (selectedDate.getDay() !== 1) {
                                            setError(
                                                `${doctor.name} is available only on Mondays.`
                                            );
                                            setFormData({
                                                ...formData,
                                                date: "",
                                            });
                                            return;
                                        }

                                        setError("");
                                        handleChange(event);
                                    }}
                                    required
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

                                    {APPOINTMENT_CONFIG.availableTimeSlots.map((timeSlot) => {
                                        const isBooked = bookedTimes.includes(timeSlot);
                                        return (
                                            <option
                                                key={timeSlot}
                                                value={timeSlot}
                                                disabled={isBooked}
                                            >
                                                {timeSlot} {isBooked ? "❌ Booked" : "✅ Available"}
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
                        <div className="appointment-fee">

                            <span>
                                Appointment Fee
                            </span>

                            <strong>
                                PKR {doctor.fee.toLocaleString()}
                            </strong>

                        </div>


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

        </main>
    );
}

export default Appointment;