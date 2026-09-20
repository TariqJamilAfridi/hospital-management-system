import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createSafepayCheckout } from "../services/api";
import { formatCurrency } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const appointment = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Log appointment data for debugging
    console.log("💳 Payment - Appointment Data:", appointment);
    
    if (!appointment?.appointmentId) {
      console.error("❌ Payment - Missing appointmentId");
    }
  }, [appointment]);

  const handlePayment = async () => {
    if (!appointment?.appointmentId) {
      setError(
        "Appointment information is missing. Please book an appointment again."
      );
      console.error("❌ Payment - No appointmentId found in state");
      return;
    }

    console.log("💳 Payment - Starting payment process");
    console.log("💳 Payment - Appointment ID:", appointment.appointmentId);
    console.log("💳 Payment - Amount:", appointment.fee || 2000);

    setLoading(true);
    setError("");

    try {
      const data = await createSafepayCheckout({
        appointmentId: appointment.appointmentId,
        amount: appointment.fee || 2000,
      });

      console.log("✅ Payment - Safepay response:", data);

      if (!data.checkoutUrl) {
        throw new Error("Safepay checkout URL was not returned.");
      }

      // Save appointment information temporarily
      sessionStorage.setItem(
        "careplusAppointment",
        JSON.stringify(appointment)
      );

      console.log("✅ Payment - Redirecting to:", data.checkoutUrl);

      // Redirect customer to Safepay hosted checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("❌ Payment - Safepay payment error:", error);
      console.error("❌ Payment - Error message:", error.message);

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
        <section className="payment-header">
          <h1>Payment Information</h1>
          <p>Complete your appointment payment securely</p>
        </section>

        <section className="payment-section">
          <div className="payment-error-container">
            <div className="payment-error-icon">⚠️</div>
            <h2>Appointment Information Missing</h2>
            <p className="payment-error">
              We couldn't find your appointment details. 
              Please book an appointment first.
            </p>

            <div className="payment-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => navigate("/appointment")}
              >
                Book Appointment
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/")}
              >
                Go to Home
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="payment-page">
      {/* Page Header */}
      <section className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Securely pay your appointment fee through Safepay</p>
      </section>

      {/* Loading Overlay */}
      {loading && (
        <LoadingSpinner 
          fullScreen={true}
          message="Connecting to Safepay secure payment gateway..." 
        />
      )}

      {/* Payment Content */}
      <section className="payment-section">
        <div className="payment-summary">
          <h2>Appointment Summary</h2>

          <div className="summary-doctor">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80"
              alt={appointment.doctor || "Dr. Nasreen Kasor"}
            />
            <div>
              <h3>{appointment.doctor || "Dr. Nasreen Kasor"}</h3>
              <p>{appointment.specialty || "Gynecology Specialist"}</p>
            </div>
          </div>

          <div className="summary-details">
            <div className="summary-item">
              <span>Patient Name</span>
              <strong>{appointment.fullName}</strong>
            </div>

            <div className="summary-item">
              <span>Email</span>
              <strong>{appointment.email}</strong>
            </div>

            <div className="summary-item">
              <span>Phone</span>
              <strong>{appointment.phone}</strong>
            </div>

            <div className="summary-item">
              <span>Appointment Date</span>
              <strong>{appointment.date}</strong>
            </div>

            <div className="summary-item">
              <span>Appointment Time</span>
              <strong>{appointment.time}</strong>
            </div>
          </div>

          <div className="total-payment">
            <span>Total Amount</span>
            <strong>{formatCurrency(appointment.fee || 2000)}</strong>
          </div>
        </div>

        <div className="payment-form-container">
          <h2>Secure Payment</h2>

          <div className="safepay-info">
            <div className="safepay-logo">
              <span className="payment-icon">🔒</span>
              <h3>Pay with Safepay</h3>
            </div>

            <p>
              You will be redirected to Safepay's secure hosted checkout page 
              to complete your payment.
            </p>

            <div className="safepay-features">
              <div className="feature-item">
                <span>✓</span>
                <p>Secure 256-bit encryption</p>
              </div>
              <div className="feature-item">
                <span>✓</span>
                <p>Card payment supported</p>
              </div>
              <div className="feature-item">
                <span>✓</span>
                <p>Your details are safe with Safepay</p>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="demo-payment-note">
            <strong>⚙️ Sandbox Mode:</strong>{" "}
            This project uses Safepay Test Mode. No real charges will be made.
          </div>

          {/* Error */}
          {error && (
            <div className="payment-error-box">
              <span className="error-icon">⚠️</span>
              <div>
                <strong>Payment Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="button"
            className="payment-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "⏳ Connecting to Safepay..."
              : `💳 Pay ${formatCurrency(appointment.fee || 2000)}`}
          </button>

          <div className="secure-payment">
            <span>🔒</span>
            <p>
              Your payment information is encrypted and secure. 
              Card details are never stored on our servers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Payment;