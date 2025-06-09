/**
 * LoadingScreen Component Example
 * Demonstrates various usage patterns for the LoadingScreen component
 */

import React, { useState } from "react";
import { LoadingScreen } from "../src";

// Basic LoadingScreen example
export const BasicLoadingScreenExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Basic LoadingScreen Example</h2>
        <p>This demonstrates the basic loading screen overlay.</p>

        <button
          onClick={() => setIsLoading(!isLoading)}
          style={{
            padding: "10px 20px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Hide Loading" : "Show Loading"}
        </button>
      </div>

      <LoadingScreen visible={isLoading} />
    </div>
  );
};

// Custom message example
export const CustomMessageLoadingExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Custom Message LoadingScreen</h2>
        <p>This shows a loading screen with a custom message.</p>

        <button
          onClick={() => setIsLoading(!isLoading)}
          style={{
            padding: "10px 20px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Hide Loading" : "Show Custom Loading"}
        </button>
      </div>

      <LoadingScreen visible={isLoading} message="Fetching user data..." />
    </div>
  );
};

// Styled LoadingScreen example
export const StyledLoadingScreenExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Styled LoadingScreen</h2>
        <p>This demonstrates custom styling with CSS classes.</p>

        <button
          onClick={() => setIsLoading(!isLoading)}
          style={{
            padding: "10px 20px",
            background: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Hide Loading" : "Show Styled Loading"}
        </button>
      </div>

      <LoadingScreen
        visible={isLoading}
        message="Processing your request..."
        className="custom-loading-screen"
      />

      <style>{`
        .custom-loading-screen .loading-screen__backdrop {
          background-color: rgba(139, 92, 246, 0.9);
        }
        .custom-loading-screen .loading-screen__spinner {
          border-top-color: #ffffff;
        }
        .custom-loading-screen .loading-screen__message {
          color: #ffffff;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

// Simulation of different loading states
export const LoadingStateSimulationExample: React.FC = () => {
  const [currentState, setCurrentState] = useState<
    "idle" | "loading" | "complete"
  >("idle");

  const simulateLoading = async () => {
    setCurrentState("loading");

    // Simulate a 3-second loading process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setCurrentState("complete");

    // Reset after showing complete state
    setTimeout(() => setCurrentState("idle"), 2000);
  };

  const getMessage = () => {
    switch (currentState) {
      case "loading":
        return "Loading data from server...";
      case "complete":
        return "Loading complete!";
      default:
        return "Loading application...";
    }
  };

  return (
    <div
      style={{ position: "relative", height: "400px", background: "#f5f5f5" }}
    >
      <div style={{ padding: "20px" }}>
        <h2>Loading State Simulation</h2>
        <p>This simulates a real loading process with different states.</p>
        <p>
          Current State: <strong>{currentState}</strong>
        </p>

        <button
          onClick={simulateLoading}
          disabled={currentState === "loading"}
          style={{
            padding: "10px 20px",
            background: currentState === "loading" ? "#6b7280" : "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: currentState === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {currentState === "loading" ? "Loading..." : "Start Loading Process"}
        </button>
      </div>

      <LoadingScreen
        visible={currentState === "loading"}
        message={getMessage()}
      />
    </div>
  );
};

// Export all examples
export {
  BasicLoadingScreenExample,
  CustomMessageLoadingExample,
  LoadingStateSimulationExample,
  StyledLoadingScreenExample,
};
