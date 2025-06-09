/**
 * ErrorScreen Component Example
 * Demonstrates various usage patterns for the ErrorScreen component
 */

import React, { useState } from "react";
import { ErrorScreen } from "../src";

// Basic ErrorScreen example
export const BasicErrorScreenExample: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const error = new Error(
    "Unable to connect to the server. Please check your internet connection and try again."
  );

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Basic ErrorScreen Example</h2>
        <p>This demonstrates the basic error screen overlay.</p>

        <button
          onClick={() => setShowError(!showError)}
          style={{
            padding: "10px 20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showError ? "Hide Error" : "Show Error"}
        </button>
      </div>

      {showError && <ErrorScreen error={error} />}
    </div>
  );
};

// Custom title and retry example
export const CustomErrorScreenExample: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const error = new Error(
    "Failed to load user preferences. Your session may have expired."
  );

  const handleRetry = () => {
    console.log("Custom retry action triggered");
    setShowError(false);
    // In a real app, you might reload data or redirect to login
  };

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Custom ErrorScreen Example</h2>
        <p>This shows custom title, retry text, and custom retry action.</p>

        <button
          onClick={() => setShowError(!showError)}
          style={{
            padding: "10px 20px",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showError ? "Hide Error" : "Show Custom Error"}
        </button>
      </div>

      {showError && (
        <ErrorScreen
          error={error}
          title="Authentication Error"
          retryText="Sign In Again"
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

// No retry button example
export const NoRetryErrorScreenExample: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const error = new Error(
    "This feature is currently unavailable. Please try again later."
  );

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>No Retry Button Example</h2>
        <p>This error screen doesn't show a retry button.</p>

        <button
          onClick={() => setShowError(!showError)}
          style={{
            padding: "10px 20px",
            background: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showError ? "Hide Error" : "Show Info Error"}
        </button>
      </div>

      {showError && (
        <ErrorScreen
          error={error}
          title="Service Unavailable"
          showRetry={false}
        />
      )}
    </div>
  );
};

// Custom message override example
export const CustomMessageErrorScreenExample: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const error = new Error("Original error message that will be overridden");

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Custom Message Example</h2>
        <p>This overrides the error message with a custom one.</p>

        <button
          onClick={() => setShowError(!showError)}
          style={{
            padding: "10px 20px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showError ? "Hide Error" : "Show Custom Message"}
        </button>
      </div>

      {showError && (
        <ErrorScreen
          error={error}
          title="Data Sync Error"
          message="We're having trouble syncing your data. Please ensure you're connected to the internet and try again."
          retryText="Try Again"
        />
      )}
    </div>
  );
};

// Styled ErrorScreen example
export const StyledErrorScreenExample: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const error = new Error(
    "Network timeout occurred while processing your request."
  );

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Styled ErrorScreen</h2>
        <p>This demonstrates custom styling with CSS classes.</p>

        <button
          onClick={() => setShowError(!showError)}
          style={{
            padding: "10px 20px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showError ? "Hide Error" : "Show Styled Error"}
        </button>
      </div>

      {showError && (
        <ErrorScreen
          error={error}
          title="Network Error"
          className="custom-error-screen"
        />
      )}

      <style>{`
        .custom-error-screen .error-screen__backdrop {
          background-color: rgba(99, 102, 241, 0.8);
        }
        .custom-error-screen .error-screen__content {
          border-color: #6366f1;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }
        .custom-error-screen .error-screen__title {
          color: #6366f1;
        }
        .custom-error-screen .error-screen__retry-button {
          background-color: #6366f1;
        }
        .custom-error-screen .error-screen__retry-button:hover {
          background-color: #4f46e5;
        }
      `}</style>
    </div>
  );
};

// Different error types simulation
export const ErrorTypesSimulationExample: React.FC = () => {
  const [errorType, setErrorType] = useState<
    "none" | "network" | "auth" | "validation" | "server"
  >("none");

  const errors = {
    network: new Error(
      "Unable to connect to server. Please check your internet connection."
    ),
    auth: new Error(
      "Your session has expired. Please sign in again to continue."
    ),
    validation: new Error(
      "The data you entered is invalid. Please check your input and try again."
    ),
    server: new Error(
      "Internal server error occurred. Our team has been notified."
    ),
  };

  const errorConfigs = {
    network: {
      title: "Connection Error",
      retryText: "Retry Connection",
      onRetry: () => setErrorType("none"),
    },
    auth: {
      title: "Authentication Required",
      retryText: "Sign In",
      onRetry: () => setErrorType("none"),
    },
    validation: {
      title: "Invalid Data",
      retryText: "Go Back",
      onRetry: () => setErrorType("none"),
    },
    server: {
      title: "Server Error",
      retryText: "Report Issue",
      onRetry: () => setErrorType("none"),
    },
  };

  return (
    <div
      style={{ position: "relative", height: "500px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Error Types Simulation</h2>
        <p>Click buttons to see different types of error screens.</p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "16px",
          }}
        >
          <button
            onClick={() => setErrorType("network")}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Network Error
          </button>

          <button
            onClick={() => setErrorType("auth")}
            style={{
              padding: "8px 16px",
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Auth Error
          </button>

          <button
            onClick={() => setErrorType("validation")}
            style={{
              padding: "8px 16px",
              background: "#eab308",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Validation Error
          </button>

          <button
            onClick={() => setErrorType("server")}
            style={{
              padding: "8px 16px",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Server Error
          </button>

          <button
            onClick={() => setErrorType("none")}
            style={{
              padding: "8px 16px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Error
          </button>
        </div>

        <p style={{ marginTop: "16px" }}>
          Current Error Type:{" "}
          <strong>{errorType === "none" ? "None" : errorType}</strong>
        </p>
      </div>

      {errorType !== "none" && (
        <ErrorScreen error={errors[errorType]} {...errorConfigs[errorType]} />
      )}
    </div>
  );
};

// Export all examples
export {
  BasicErrorScreenExample,
  CustomErrorScreenExample,
  CustomMessageErrorScreenExample,
  ErrorTypesSimulationExample,
  NoRetryErrorScreenExample,
  StyledErrorScreenExample,
};
