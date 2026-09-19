import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(resetToken, formData.password, formData.confirmPassword);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setApiError(error.message || "Failed to reset password. Please try again.");
    }
  };

  if (!resetToken) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon error-icon">❌</div>
              <h1>Invalid Reset Link</h1>
              <p>The password reset link is invalid or missing</p>
            </div>
            <div className="auth-footer">
              <Link to="/forgot-password" className="auth-link">
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <LoadingSpinner message="Resetting password..." />
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
              <h1>Password Reset Successful!</h1>
              <p>Your password has been successfully reset</p>
            </div>

            <div className="alert alert-success">
              <span className="alert-icon">🎉</span>
              <div>
                <p>You can now login with your new password.</p>
                <p style={{ marginTop: "8px", fontSize: "14px" }}>
                  Redirecting to login page...
                </p>
              </div>
            </div>

            <div className="auth-footer">
              <Link to="/login" className="btn-auth-primary" style={{ textDecoration: "none" }}>
                Go to Login
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
            <div className="auth-icon">🔒</div>
            <h1>Reset Your Password</h1>
            <p>Enter your new password below</p>
          </div>

          {apiError && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">
                New Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={errors.password ? "error" : ""}
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <small className="form-hint">
                Password must be at least 6 characters long
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn-auth-primary" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
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

export default ResetPassword;
