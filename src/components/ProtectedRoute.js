import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Optionally restricts access to specific roles
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <LoadingSpinner message="Verifying authentication..." />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Requires admin but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-container">
          <div className="unauthorized-icon">🚫</div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <p>This page is restricted to administrators only.</p>
          <a href="/" className="btn-primary">Go to Home</a>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render the protected content
  return children;
};

export default ProtectedRoute;
