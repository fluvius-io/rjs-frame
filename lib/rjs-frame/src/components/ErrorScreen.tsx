import React, { useState } from "react";
import "../styles/components/ErrorScreen.css";

export interface ErrorState {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  errorTitle: string;
}

export interface ErrorScreenProps {
  /** Error object to display */
  error: ErrorState;
  /** Title for the error screen */
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
  className = "",
  retryText = "Reload Application",
  onRetry = () => window.location.reload(),
  showRetry = true,
  message,
}) => {
  const errorMessage =
    message || error.error.message || "An unexpected error occurred";
  const [showLines, setShowLines] = useState(3);
  const lines = error.errorInfo?.componentStack?.split("\n") || [];

  return (
    <div className={`error-screen ${className}`}>
      <div className="error-screen__backdrop" />
      <div className="error-screen__content">
        <div className="error-screen__header">
          <h3 className="error-screen__title">{error.errorTitle}</h3>
        </div>

        <div className="error-screen__body">
          <p className="error-screen__message mb-4 text-lg">{errorMessage}</p>
          {error.errorInfo && (
            <ul className="error-screen__message">
              {lines.slice(0, showLines).map(
                (line, index) =>
                  line && (
                    <li
                      className="text-left break-all mb-2 list-disc font-mono text-xs"
                      key={index}
                    >
                      {line}
                    </li>
                  )
              )}
            </ul>
          )}

          {lines.length > showLines && (
            <p className="error-screen__message">
              <button onClick={() => setShowLines(showLines + 3)}>
                ... more ...
              </button>
            </p>
          )}
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
