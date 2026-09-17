import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const appointment = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!appointment?.appointmentId) {
      setError(
        "Appointment information is missing. Please book an appointment again."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/safepay/create-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: appointment.appointmentId,
            amount: appointment.fee || 2000,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create Safepay checkout."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Safepay checkout URL was not returned.");
      }

      // Save appointment information temporarily.
      sessionStorage.setItem(
        "careplusAppointment",
        JSON.stringify(appointment)
      );

      // Redirect customer to Safepay hosted checkout.
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Safepay payment error:", error);

      setError(
        error.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  if (!appointment) {
    return (
      <main className="payment-page">
        <div className="payment-container">
          <div className="payment-card">
            <h1>Payment Information</h1>

            <p className="payment-error">
              Appointment information is missing.
            </p>

            <button
              type="button"
              className="payment-back-btn"
              onClick={() => navigate("/appointment")}
            >
              Back to Appointment
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-page">
      <div className="payment-container">
        <div className="payment-card">

          <h1>Complete Your Payment</h1>

          <p className="payment-subtitle">
            Securely pay your appointment fee through Safepay.
          </p>

          {/* Appointment Summary */}
          <div className="payment-appointment-summary">
            <h3>Appointment Summary</h3>

            <p>
              <strong>Doctor:</strong>{" "}
              {appointment.doctor || "Dr. Nasreen Kasor"}
            </p>

            <p>
              <strong>Specialty:</strong>{" "}
              {appointment.specialty || "Gynecology Specialist"}
            </p>

            <p>
              <strong>Patient:</strong>{" "}
              {appointment.fullName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {appointment.email}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {appointment.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {appointment.time}
            </p>

            <p>
              <strong>Appointment Fee:</strong>{" "}
              PKR{" "}
              {(appointment.fee || 2000).toLocaleString()}
            </p>
          </div>

          {/* Payment Information */}
          <div className="safepay-payment-box">
            <h3>Secure Payment</h3>

            <p>
              You will be redirected to Safepay's secure
              hosted checkout page to complete your payment.
            </p>

            <div className="safepay-features">
              <div>✓ Secure hosted checkout</div>
              <div>✓ Card payment supported</div>
              <div>✓ Your card details are handled by Safepay</div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="demo-payment-note">
            <strong>Sandbox Payment:</strong>{" "}
            This project is currently using Safepay Sandbox/Test Mode.
            No real payment will be charged.
          </div>

          {/* Error */}
          {error && (
            <div className="payment-error">
              {error}
            </div>
          )}

          {/* Pay Button */}
          <button
            type="button"
            className="pay-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Connecting to Safepay..."
              : `Pay PKR ${(appointment.fee || 2000).toLocaleString()}`}
          </button>

          <p className="payment-security-note">
            You will enter your card details only on Safepay's
            secure payment page.
          </p>

        </div>
      </div>
    </main>
  );
}

export default Payment;