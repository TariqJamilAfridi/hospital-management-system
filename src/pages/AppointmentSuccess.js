import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

function AppointmentSuccess() {
  const location = useLocation();

  const [appointment, setAppointment] = useState(
    location.state || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First check React Router state
    if (location.state) {
      setAppointment(location.state);
      setLoading(false);
      return;
    }

    // If redirected back from Safepay,
    // recover appointment from sessionStorage
    const savedAppointment =
      sessionStorage.getItem("careplusAppointment");

    if (savedAppointment) {
      try {
        const parsedAppointment =
          JSON.parse(savedAppointment);

        setAppointment(parsedAppointment);
      } catch (error) {
        console.error(
          "Failed to read saved appointment:",
          error
        );
      }
    }

    setLoading(false);
  }, [location.state]);

  if (loading) {
    return (
      <main className="success-page">
        <div className="success-container">
          <div className="success-card">
            <h1>Loading Appointment...</h1>
            <p>
              Please wait while we load your appointment
              information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!appointment) {
    return (
      <main className="success-page">
        <div className="success-container">
          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <h1>Appointment Information</h1>

            <p>
              We could not find your appointment
              information.
            </p>

            <Link
              to="/appointment"
              className="success-btn"
            >
              Book Appointment
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="success-page">
      <div className="success-container">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Appointment Booked Successfully!
          </h1>

          <p className="success-message">
            Your appointment with{" "}
            <strong>
              {appointment.doctor ||
                "Dr. Nasreen Kasor"}
            </strong>{" "}
            has been successfully booked.
          </p>

          <div className="success-details">

            <h2>Appointment Details</h2>

            <div className="success-detail-row">
              <span>Patient</span>
              <strong>
                {appointment.fullName ||
                  "Not provided"}
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Doctor</span>
              <strong>
                {appointment.doctor ||
                  "Dr. Nasreen Kasor"}
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Specialty</span>
              <strong>
                {appointment.specialty ||
                  "Gynecology Specialist"}
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Date</span>
              <strong>
                {appointment.date ||
                  "Not selected"}
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Time</span>
              <strong>
                {appointment.time ||
                  "Not selected"}
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Hospital</span>
              <strong>
                CarePlus Hospital
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Payment Status</span>

              <strong
                className={
                  appointment.paymentStatus === "Paid"
                    ? "payment-status-paid"
                    : "payment-status-pending"
                }
              >
                {appointment.paymentStatus ||
                  "Pending"}
              </strong>
            </div>

            <div className="success-detail-row">
              <span>Appointment Fee</span>

              <strong>
                PKR{" "}
                {(
                  appointment.fee || 2000
                ).toLocaleString()}
              </strong>
            </div>

          </div>

          {appointment.paymentStatus === "Paid" ? (
            <p className="success-confirmation">
              Your payment has been successfully
              confirmed.
            </p>
          ) : (
            <p className="success-pending-message">
              Your appointment has been booked.
              Payment is currently pending confirmation.
            </p>
          )}

          <p className="success-contact-message">
            A confirmation message will be sent to
            your email and phone number.
          </p>

          <div className="success-actions">

            <Link
              to="/"
              className="success-btn"
            >
              Back to Home
            </Link>

            <Link
              to="/doctors/nasreen-kasor"
              className="success-secondary-btn"
            >
              View Doctor Profile
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

export default AppointmentSuccess;