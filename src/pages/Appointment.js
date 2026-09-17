import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Appointment() {
    const navigate = useNavigate();

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
                const response = await fetch(
                    `https://careplus-hospital-backend.onrender.com/api/appointments?date=${formData.date}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch booked times"
                    );
                }

                const booked = data
                    .filter(
                        (appointment) =>
                            appointment.appointmentStatus !== "Cancelled"
                    )
                    .map((appointment) => appointment.time);

                setBookedTimes(booked);

                if (booked.includes(formData.time)) {
                    setFormData((previous) => ({
                        ...previous,
                        time: "",
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchBookedTimes();
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
            const response = await fetch(
                "https://careplus-hospital-backend.onrender.com/api/appointments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to book appointment"
                );
            }

            console.log("Appointment saved:", data);

            navigate("/payment", {
                state: {
                    ...formData,
                    doctor: data.appointment.doctor,
                    specialty: data.appointment.specialty,
                    fee: data.appointment.fee,
                    appointmentId: data.appointment._id,
                },
            });
        } catch (error) {
            console.error(error);

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
                    Schedule an appointment with Dr. Nasreen Kasor.
                </p>
            </section>


            {/* Appointment Content */}
            <section className="appointment-section">

                {/* Doctor Information */}
                <div className="appointment-doctor-card">

                    <div className="appointment-doctor-image">
                        <img
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80"
                            alt="Dr. Nasreen Kasor"
                        />
                    </div>

                    <div className="appointment-doctor-info">

                        <h2>Dr. Nasreen Kasor</h2>

                        <p className="appointment-specialty">
                            Gynecology Specialist
                        </p>

                        <p>
                            <strong>Available:</strong> Every Monday
                        </p>

                        <p>
                            <strong>Appointment Fee:</strong> PKR 2,000
                        </p>

                    </div>
                    <div className="appointment-availability-note">
                        <strong>Doctor Availability:</strong>
                        Dr. Nasreen Kasor is available every Monday from 9:00 AM to 2:00 PM.
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
                                    min={new Date().toISOString().split("T")[0]}
                                    value={formData.date}
                                    onChange={(event) => {
                                        const selectedDate = new Date(event.target.value);

                                        if (selectedDate.getDay() !== 1) {
                                            setError(
                                                "Dr. Nasreen Kasor is available only on Mondays."
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
                                >
                                    <option value="">
                                        Select Available Time
                                    </option>



                                    <option
                                        value="09:00 AM"
                                        disabled={bookedTimes.includes("09:00 AM")}
                                    >
                                        09:00 AM {bookedTimes.includes("09:00 AM") ? "(Booked)" : ""}
                                    </option>

                                    <option
                                        value="10:00 AM"
                                        disabled={bookedTimes.includes("10:00 AM")}
                                    >
                                        10:00 AM {bookedTimes.includes("10:00 AM") ? "(Booked)" : ""}
                                    </option>

                                    <option
                                        value="11:00 AM"
                                        disabled={bookedTimes.includes("11:00 AM")}
                                    >
                                        11:00 AM {bookedTimes.includes("11:00 AM") ? "(Booked)" : ""}
                                    </option>

                                    <option
                                        value="12:00 PM"
                                        disabled={bookedTimes.includes("12:00 PM")}
                                    >
                                        12:00 PM {bookedTimes.includes("12:00 PM") ? "(Booked)" : ""}
                                    </option>

                                    <option
                                        value="01:00 PM"
                                        disabled={bookedTimes.includes("01:00 PM")}
                                    >
                                        01:00 PM {bookedTimes.includes("01:00 PM") ? "(Booked)" : ""}
                                    </option>
                                </select>

                            </div>
                        </div>


                        {/* Appointment Fee */}
                        <div className="appointment-fee">

                            <span>
                                Appointment Fee
                            </span>

                            <strong>
                                PKR 2,000
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