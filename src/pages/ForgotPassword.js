import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail()) {
      return;
    }

    try {
      const result = await forgotPassword(email);
      setSuccess(true);
      
      // Store reset token for development (remove in production)
      if (result.resetToken) {
        setResetToken(result.resetToken);
      }
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <LoadingSpinner message="Sending reset link..." />
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon success-icon">✅</div>
              <h1>Check Your Email</h1>
              <p>Password reset instructions have been sent to your email</p>
            </div>

            <div className="alert alert-success">
              <span className="alert-icon">📧</span>
              <div>
                <p>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p style={{ marginTop: "8px", fontSize: "14px" }}>
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
            </div>

            {/* Development only - show reset token */}
            {resetToken && (
              <div className="alert alert-info">
                <span className="alert-icon">🔧</span>
                <div>
                  <p><strong>Development Mode:</strong></p>
                  <p style={{ fontSize: "13px", marginTop: "4px" }}>
                    Use this link to reset password:
                  </p>
                  <Link 
                    to={`/reset-password/${resetToken}`}
                    className="reset-link"
                    style={{ 
                      display: "block", 
                      marginTop: "8px", 
                      color: "#1d4ed8",
                      wordBreak: "break-all"
                    }}
                  >
                    Reset Password Link
                  </Link>
                </div>
              </div>
            )}

            <div className="auth-actions">
              <p className="resend-text">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setResetToken("");
                  }}
                  className="text-link"
                >
                  Try again
                </button>
              </p>
            </div>

            <div className="auth-footer">
              <Link to="/login" className="back-link">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🔑</div>
            <h1>Forgot Password?</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                className={error ? "error" : ""}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <button type="submit" className="btn-auth-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p>
              Remember your password?{" "}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
