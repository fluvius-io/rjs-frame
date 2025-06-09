import React from "react";
import "../styles/components/ErrorScreen.css";

export interface ErrorScreenProps {
  /** Error object to display */
  error: Error;
  /** Title for the error screen */
  title?: string;
  /** Additional CSS class names */
  className?: string;
  /** Custom retry button text */
  retryText?: string;
  /** Callback for retry action */
  onRetry?: () => void;
  /** Whether to show the retry button */
  showRetry?: boolean;
  /** Custom error message (overrides error.message) */
  message?: string;
}

/**
 * ErrorScreen - Full-screen error overlay component
 *
 * Displays error information with optional retry functionality.
 * Typically used for critical errors that prevent application loading.
 */
export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  title = "Configuration Error",
  className = "",
  retryText = "Reload Application",
  onRetry = () => window.location.reload(),
  showRetry = true,
  message,
}) => {
  const errorMessage =
    message || error.message || "An unexpected error occurred";

  return (
    <div className={`error-screen ${className}`}>
      <div className="error-screen__backdrop" />
      <div className="error-screen__content">
        <div className="error-screen__icon">
          <svg
            className="error-screen__icon-svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="error-screen__header">
          <h3 className="error-screen__title">{title}</h3>
        </div>

        <div className="error-screen__body">
          <p className="error-screen__message">{errorMessage}</p>
        </div>

        {showRetry && (
          <div className="error-screen__footer">
            <button
              onClick={onRetry}
              className="error-screen__retry-button"
              type="button"
            >
              {retryText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
