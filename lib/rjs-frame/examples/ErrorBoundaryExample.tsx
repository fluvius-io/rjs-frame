import React from "react";
import { PageModule } from "../src/components/PageModule";

// Example module that can trigger an error
class ErrorProneModule extends PageModule {
  private errorTriggered = false;

  componentDidMount() {
    super.componentDidMount();
    // Simulate an error after 2 seconds
    setTimeout(() => {
      if (!this.errorTriggered) {
        this.errorTriggered = true;
        throw new Error("This is a simulated error in the module!");
      }
    }, 2000);
  }

  renderContent() {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Error Prone Module
        </h3>
        <p className="text-blue-600">
          This module will throw an error after 2 seconds to demonstrate the
          error boundary.
        </p>
        <div className="mt-3 text-sm text-blue-500">
          ⏰ Error will trigger in:{" "}
          {this.errorTriggered ? "Triggered!" : "2 seconds"}
        </div>
      </div>
    );
  }
}

// Example module with a button to trigger error
class ManualErrorModule extends PageModule {
  renderContent() {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Manual Error Module
        </h3>
        <p className="text-red-600 mb-3">
          Click the button below to trigger an error and see the error boundary
          in action.
        </p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          onClick={() => {
            throw new Error("Manual error triggered by button click!");
          }}
        >
          Trigger Error
        </button>
      </div>
    );
  }
}

// Example module that works normally
class NormalModule extends PageModule {
  renderContent() {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Normal Module
        </h3>
        <p className="text-green-600">
          This module works normally and won't trigger any errors.
        </p>
      </div>
    );
  }
}

// Main example component
export const ErrorBoundaryExample: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        PageModule Error Boundary Example
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NormalModule />
        <ManualErrorModule />
        <ErrorProneModule />
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          How it works:
        </h3>
        <ul className="text-gray-600 space-y-1 text-sm">
          <li>
            • <strong>Normal Module:</strong> Works without errors
          </li>
          <li>
            • <strong>Manual Error Module:</strong> Click the button to trigger
            an error
          </li>
          <li>
            • <strong>Error Prone Module:</strong> Automatically throws an error
            after 2 seconds
          </li>
          <li>
            • <strong>Error Boundary:</strong> Catches errors and displays a
            user-friendly message
          </li>
          <li>
            • <strong>Recovery:</strong> Click "Try Again" to reset the error
            state
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorBoundaryExample;
