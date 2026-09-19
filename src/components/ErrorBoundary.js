import React from 'react';
import { Link } from 'react-router';

/**
 * Error Boundary Component to catch and handle React errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something Went Wrong</h1>
            <p className="error-message">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button 
                onClick={this.handleReset} 
                className="primary-btn"
              >
                Try Again
              </button>
              <Link to="/" className="secondary-btn">
                Go to Home
              </Link>
            </div>
          </div>

          <style>{`
            .error-boundary-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f8fafc;
              padding: 40px 20px;
            }

            .error-boundary-content {
              max-width: 600px;
              width: 100%;
              background: white;
              border-radius: 16px;
              padding: 50px 40px;
              text-align: center;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }

            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }

            .error-boundary-content h1 {
              font-size: 28px;
              color: #1e293b;
              margin-bottom: 15px;
            }

            .error-message {
              font-size: 16px;
              color: #64748b;
              line-height: 1.6;
              margin-bottom: 30px;
            }

            .error-details {
              text-align: left;
              margin: 30px 0;
              padding: 20px;
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 600;
              color: #dc2626;
              margin-bottom: 10px;
            }

            .error-stack {
              font-size: 12px;
              color: #991b1b;
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }

            .error-actions {
              display: flex;
              gap: 15px;
              justify-content: center;
              flex-wrap: wrap;
            }

            @media (max-width: 768px) {
              .error-boundary-content {
                padding: 40px 25px;
              }

              .error-boundary-content h1 {
                font-size: 24px;
              }

              .error-actions {
                flex-direction: column;
                width: 100%;
              }

              .error-actions .primary-btn,
              .error-actions .secondary-btn {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
