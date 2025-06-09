import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { ConfigManager } from "../config/ConfigManager";
import type { AuthContext } from "../types/AuthContext";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import { RjsRouteHandler } from "./RjsRouteHandler";

// Import component styles
import "../styles/components/UnauthorizedScreen.css";

// Configuration context types
interface AppConfig {
  "auth.loginRedirect": string;
  "auth.context": string;
  [key: string]: any;
}

interface ConfigContextType {
  config: ConfigManager<AppConfig> | null;
  isLoading: boolean;
  error: Error | null;
  authContext: AuthContext | null;
}

// Default configuration values
const defaultConfig: AppConfig = {
  "auth.loginRedirect": "/api/auth/login",
  "auth.context": "/api/auth/info",
  "auth.logout": "/api/auth/logout",
};

// Create configuration context
const ConfigContext = createContext<ConfigContextType>({
  config: null,
  isLoading: true,
  error: null,
  authContext: null,
});

// Hook to use configuration context
export const useAppConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useAppConfig must be used within RjsApp");
  }
  return context;
};

// Unauthorized screen component
const UnauthorizedScreen: React.FC<{ loginRedirectUrl?: string }> = ({
  loginRedirectUrl,
}) => {
  return (
    <div className="unauthorized-screen">
      <div className="unauthorized-screen__backdrop">
        <div className="unauthorized-screen__content">
          <h1 className="unauthorized-screen__title">
            Authentication Required
          </h1>
          <p className="unauthorized-screen__message">
            You must be signed in to access this application. Please
            authenticate to continue.
          </p>
          {loginRedirectUrl && (
            <a
              className="unauthorized-screen__login-button"
              href={loginRedirectUrl}
            >
              Sign In to Continue
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Configuration provider component
const ConfigProvider: React.FC<{
  configUrl?: string;
  authContextUrl?: string;
  authRequired?: boolean;
  children: React.ReactNode;
}> = ({
  configUrl,
  authContextUrl = "/api/auth/info",
  authRequired = false,
  children,
}) => {
  const [config, setConfig] = useState<ConfigManager<AppConfig> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [authContext, setAuthContext] = useState<AuthContext | null>(null);

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load config and auth context in parallel
        const promises: Promise<any>[] = [];

        // Add config loading promise
        const configPromise = ConfigManager.create(defaultConfig, configUrl, {
          timeout: 10000,
          retries: 2,
          headers: {
            "Content-Type": "application/json",
          },
        });
        promises.push(configPromise);

        // Add auth context loading promise if authContextUrl is provided
        let authPromise: Promise<AuthContext | null> = Promise.resolve(null);
        if (authContextUrl) {
          authPromise = fetch(authContextUrl)
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${response.statusText}`
                );
              }
              const authData = await response.json();

              // Validate that the response matches our AuthContext type
              if (
                authData &&
                typeof authData === "object" &&
                "realm" in authData &&
                "user" in authData &&
                "profile" in authData &&
                "organization" in authData
              ) {
                return authData as AuthContext;
              } else {
                console.warn(
                  "Auth context response does not match expected structure:",
                  authData
                );
                return null;
              }
            })
            .catch((authError) => {
              return null;
            });
        }
        promises.push(authPromise);

        // Wait for both promises to complete
        const [configManager, authContextResult] = await Promise.all(promises);

        setConfig(configManager);
        setAuthContext(authContextResult);
      } catch (configError) {
        console.error("Failed to initialize configuration:", configError);
        setError(
          configError instanceof Error
            ? configError
            : new Error("Configuration initialization failed")
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeConfig();
  }, [configUrl, authContextUrl]);

  const contextValue: ConfigContextType = {
    config,
    isLoading,
    error,
    authContext,
  };

  // Determine which screen to show based on priority:
  // 1. Loading (highest priority)
  // 2. Error (configuration/network issues)
  // 3. Unauthorized (auth required but not available)
  // 4. Children (normal app content)

  const loginRedirectUrl = () => {
    const url = config?.get<string>("auth.loginRedirect") || "/api/auth/login";
    return url + "?next=" + window.location.href;
  };

  const renderContent = () => {
    // Priority 1: Show loading screen while initializing
    if (isLoading) {
      return <LoadingScreen message="Starting up application ..." />;
    }

    // Priority 2: Show error screen for configuration/network failures
    if (error) {
      return <ErrorScreen error={error} />;
    }

    // Priority 3: Show unauthorized screen when auth is required but not available
    if (authRequired && !authContext) {
      return <UnauthorizedScreen loginRedirectUrl={loginRedirectUrl()} />;
    }

    // Priority 4: Show normal app content
    return children;
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {renderContent()}
    </ConfigContext.Provider>
  );
};

// Enhanced RjsApp component
export function RjsApp({
  children,
  configUrl,
  authContextUrl,
  authRequired = false,
}: {
  children: React.ReactNode;
  configUrl?: string;
  authContextUrl?: string;
  authRequired?: boolean;
}) {
  return (
    <ConfigProvider
      configUrl={configUrl}
      authContextUrl={authContextUrl}
      authRequired={authRequired}
    >
      <BrowserRouter>
        <RjsRouteHandler />
        <Routes>{children}</Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

// Export router components for convenience
export {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
