import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { updatePaymentStatus } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function AppointmentSuccess() {
  const location = useLocation();
  // const [searchParams] = useSearchParams(); // Removed - not used

  const [appointment, setAppointment] = useState(location.state || null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const initializeAppointment = async () => {
      // First check React Router state
      if (location.state) {
        setAppointment(location.state);
        
        // If coming from payment, update status automatically
        if (location.state.appointmentId) {
          await updatePaymentStatusInDB(location.state.appointmentId);
        }
        
        setLoading(false);
        return;
      }

      // If redirected back from Safepay, recover from sessionStorage
      const savedAppointment = sessionStorage.getItem("careplusAppointment");

      if (savedAppointment) {
        try {
          const parsedAppointment = JSON.parse(savedAppointment);
          setAppointment(parsedAppointment);
          
          // Update payment status automatically
          if (parsedAppointment.appointmentId) {
            await updatePaymentStatusInDB(parsedAppointment.appointmentId);
          }
        } catch (error) {
          console.error("Failed to read saved appointment:", error);
        }
      }

      setLoading(false);
    };

    initializeAppointment();
  }, [location.state]);

  const updatePaymentStatusInDB = async (appointmentId) => {
    try {
      console.log("💳 Updating payment status for:", appointmentId);
      
      const result = await updatePaymentStatus(appointmentId, "Paid");
      
      console.log("✅ Payment status updated:", result);
      
      // Update local state to show "Paid"
      setAppointment(prev => ({
        ...prev,
        paymentStatus: "Paid"
      }));
      
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      // Don't show error to user, just log it
    }
  };

  const handleManualUpdate = async () => {
    if (!appointment?.appointmentId) {
      setUpdateError("Appointment ID not found");
      return;
    }

    setUpdating(true);
    setUpdateError("");

    try {
      await updatePaymentStatusInDB(appointment.appointmentId);
      alert("Payment status updated successfully!");
    } catch (error) {
      setUpdateError(error.message || "Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="success-page">
        <div className="success-container">
          <LoadingSpinner message="Loading appointment information..." />
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
            <div className="success-confirmation">
              <span className="check-icon">✓</span>
              <p>Your payment has been successfully confirmed.</p>
            </div>
          ) : (
            <div className="pending-payment-section">
              <p className="success-pending-message">
                ⏳ Your appointment has been booked. Payment is currently pending confirmation.
              </p>
              
              {appointment.appointmentId && (
                <div className="manual-update-section">
                  <p className="manual-update-text">
                    If you've completed the payment but status is still pending:
                  </p>
                  <button
                    onClick={handleManualUpdate}
                    disabled={updating}
                    className="manual-update-btn"
                  >
                    {updating ? "Updating..." : "✓ Mark as Paid"}
                  </button>
                  {updateError && (
                    <p className="update-error">{updateError}</p>
                  )}
                </div>
              )}
            </div>
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