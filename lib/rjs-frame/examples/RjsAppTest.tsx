/**
 * Simple Test for Enhanced RjsApp
 * This file can be used to manually test the configuration context functionality
 */

import React from "react";
import { RjsApp, Route, useAppConfig } from "../src";

const TestPage: React.FC = () => {
  const { config, authContext, isLoading, error } = useAppConfig();

  if (isLoading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error.message}</div>;
  }

  return (
    <div data-testid="test-page">
      <h1>RjsApp Test Page</h1>

      <div data-testid="config-section">
        <h2>Configuration Test</h2>
        <p>
          Auth Login:{" "}
          <span data-testid="auth-login">{config?.get("auth.login")}</span>
        </p>
        <p>
          Auth Context:{" "}
          <span data-testid="auth-context-url">
            {config?.get("auth.context")}
          </span>
        </p>
      </div>

      <div data-testid="auth-section">
        <h2>Auth Context Test</h2>
        {authContext ? (
          <pre data-testid="auth-data">
            {JSON.stringify(authContext, null, 2)}
          </pre>
        ) : (
          <p data-testid="no-auth">No auth context available</p>
        )}
      </div>

      <div data-testid="methods-section">
        <h2>Config Methods Test</h2>
        <p>
          Has auth.login:{" "}
          <span data-testid="has-auth-login">
            {config?.has("auth.login") ? "Yes" : "No"}
          </span>
        </p>
        <p>
          Has unknown.key:{" "}
          <span data-testid="has-unknown">
            {config?.has("unknown.key") ? "Yes" : "No"}
          </span>
        </p>
        <p>
          Get with default:{" "}
          <span data-testid="get-with-default">
            {config?.get("missing.key", "default-value")}
          </span>
        </p>
      </div>
    </div>
  );
};

// Basic test without remote config
export const BasicRjsAppTest: React.FC = () => (
  <RjsApp>
    <Route path="*" element={<TestPage />} />
  </RjsApp>
);

// Test with mock config URL (will fail gracefully)
export const RemoteConfigRjsAppTest: React.FC = () => (
  <RjsApp configUrl="/mock-config.json">
    <Route path="*" element={<TestPage />} />
  </RjsApp>
);

// Default export for easy testing
export default BasicRjsAppTest;
