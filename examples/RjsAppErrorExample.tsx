import React from "react";
import { PageModule } from "../src/components/PageModule";
import { RjsApp, useAppContext } from "../src/components/RjsApp";

// Component that throws an error
const ErrorThrowingComponent: React.FC = () => {
  const [shouldError, setShouldError] = React.useState(false);

  if (shouldError) {
    throw new Error("This is a simulated error in a React component!");
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Error Throwing Component
      </h3>
      <p className="text-red-600 mb-3">
        This component will throw an error when you click the button below.
      </p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        onClick={() => setShouldError(true)}
      >
        Trigger Error
      </button>
    </div>
  );
};

// Component that uses the app context to clear errors
const ErrorControlComponent: React.FC = () => {
  const { error, setError } = useAppContext();

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        Error Control
      </h3>
      <div className="space-y-2">
        <p className="text-blue-600">
          Current error state: {error ? "Error present" : "No error"}
        </p>
        {error && (
          <div className="text-sm text-blue-700">
            <strong>Error message:</strong> {error.message}
          </div>
        )}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setError(null)}
          disabled={!error}
        >
          Clear Error
        </button>
      </div>
    </div>
  );
};

// Module that can trigger errors
class ErrorModule extends PageModule {
  private errorTriggered = false;

  componentDidMount() {
    super.componentDidMount();
    // Simulate an error after 3 seconds
    setTimeout(() => {
      if (!this.errorTriggered) {
        this.errorTriggered = true;
        throw new Error("This is a simulated error in a PageModule!");
      }
    }, 3000);
  }

  renderContent() {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Error Module
        </h3>
        <p className="text-yellow-600">
          This PageModule will throw an error after 3 seconds to demonstrate the
          error boundary.
        </p>
        <div className="mt-3 text-sm text-yellow-500">
          ⏰ Error will trigger in:{" "}
          {this.errorTriggered ? "Triggered!" : "3 seconds"}
        </div>
      </div>
    );
  }
}

// Normal component that works fine
const NormalComponent: React.FC = () => {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Normal Component
      </h3>
      <p className="text-green-600">
        This component works normally and won't trigger any errors.
      </p>
    </div>
  );
};

// Main app content
const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          RjsApp Error Handling Example
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <NormalComponent />
          <ErrorThrowingComponent />
          <ErrorControlComponent />
          <ErrorModule />
        </div>

        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            How RjsApp Error Handling Works:
          </h3>
          <ul className="text-gray-600 space-y-1 text-sm">
            <li>
              • <strong>Error Boundary:</strong> RjsApp wraps content in an
              error boundary
            </li>
            <li>
              • <strong>Error Catching:</strong> Catches errors from any child
              component
            </li>
            <li>
              • <strong>Error Display:</strong> Shows ErrorScreen when errors
              occur
            </li>
            <li>
              • <strong>Error Control:</strong> Use setError from useAppContext
              to manage errors
            </li>
            <li>
              • <strong>Recovery:</strong> Clear errors to return to normal app
              state
            </li>
            <li>
              • <strong>Logging:</strong> Errors are logged to console for
              debugging
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main example component
export const RjsAppErrorExample: React.FC = () => {
  return (
    <RjsApp>
      <AppContent />
    </RjsApp>
  );
};

export default RjsAppErrorExample;
