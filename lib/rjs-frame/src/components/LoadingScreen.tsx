import React from "react";

export interface LoadingScreenProps {
  /** Loading message to display */
  message?: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show the loading screen */
  visible?: boolean;
}

/**
 * LoadingScreen - Full-screen loading overlay component
 *
 * Displays a loading spinner with message during application initialization
 * or other loading states that require blocking user interaction.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Starting up application ...",
  className = "",
  visible = true,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className={`loading-screen ${className}`}>
      <div className="loading-screen__backdrop" />
      <div className="loading-screen__content">
        <div className="loading-screen__spinner" />
        <div className="loading-screen__message">{message}</div>
      </div>
    </div>
  );
};
