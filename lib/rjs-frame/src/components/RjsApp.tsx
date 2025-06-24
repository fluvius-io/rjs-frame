import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { ConfigManager } from "../config/ConfigManager";
import type { AuthContext } from "../types/AuthContext";
import { ErrorScreen, ErrorState } from "./ErrorScreen";
import { RjsRouteHandler } from "./RjsRouteHandler";

export interface AppConfig {
  "auth.loginRedirect": string;
  "auth.context": string;
  [key: string]: any;
}

interface AppContextType {
  config: ConfigManager<AppConfig>;
  isLoading: boolean;
  isRevealing: boolean;
  error: ErrorState | null;
  authContext: AuthContext | null;
}

// Default configuration values
const defaultConfig: AppConfig = {
  "auth.loginRedirect": "/api/auth/login",
  "auth.context": "/api/auth/info",
  "auth.logout": "/api/auth/logout",
  "auth.callback": "/api/auth/callback",
  "app.version": "unknown",
};

// Transition timing
const REVEALING_TIME: number = 1000; // This must be consistent to the CSS transition time
const SKIP_REVEALING_ON_FAST_LOAD: number = 1000;

// Create configuration context
const AppContext = createContext<AppContextType>({
  config: new ConfigManager(defaultConfig),
  isLoading: true,
  isRevealing: false,
  error: null,
  authContext: null,
});

// Hook to use configuration context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within RjsApp");
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

interface ErrorBoundaryState {
  errorLines: number;
  errorState: ErrorState | null;
}

interface RjsAppErrorBoundaryProps {
  children: React.ReactNode;
  errorModule: string;

  // Disable builtin error display and relay to external error screen
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Error Boundary Component
export class RjsAppErrorBoundary extends React.Component<
  RjsAppErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: RjsAppErrorBoundaryProps) {
    super(props);
    this.state = {
      errorLines: 3,
      errorState: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Call the parent's error handler
    if (this.props.onError) {
      return this.props.onError(error, errorInfo);
    }

    // Set the error using the existing setError function
    this.setState({
      errorState: {
        error,
        errorInfo,
        errorTitle: "Component Error",
      } as ErrorState,
      errorLines: 3,
    });
  }

  render() {
    if (!this.props.onError && this.hasError) {
      return this.renderError();
    }

    return this.props.children;
  }

  get hasError(): boolean {
    return (
      this.state.errorState !== null && this.state.errorState.error !== null
    );
  }

  protected renderError(): React.ReactNode {
    if (!this.hasError) {
      return null;
    }

    const handleCopyError = (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      navigator.clipboard.writeText(error?.stack || "");
      const el = e.currentTarget;
      el.textContent = "[ copied to clipboard ]";
      setTimeout(() => {
        el.textContent = "[ copy ]";
      }, 5000);
    };

    const { errorState, errorLines = 3 } = this.state;

    const { error, errorInfo, errorTitle } = errorState!;
    const lines = error?.stack?.split("\n") || [];
    return (
      <div className="error-boundary page-module--error">
        <div className="page-module-error__content">
          <h3 className="page-module-error__title">
            {errorTitle || "Component Error"} [{this.props.errorModule}]
          </h3>
          <p className="page-module-error__message">
            {error?.message || "An unexpected error occurred"}
          </p>
          <ul className="px-4 page-module-error__message font-mono text-xs list-disc">
            {lines.slice(0, errorLines).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
            {lines.length > errorLines && (
              <li className="cursor-pointer">
                <span
                  onClick={() => this.setState({ errorLines: lines.length })}
                  className="text-xs text-muted-foreground hover:text-primary mr-4"
                >
                  [... more ...]
                </span>
                <span
                  onClick={handleCopyError}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  [ copy ]
                </span>
              </li>
            )}
          </ul>

          <button
            className="page-module-error__retry mt-2"
            onClick={() =>
              this.setState({
                errorState: null,
                errorLines: 3,
              } as ErrorBoundaryState)
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}

// Enhanced RjsApp component
export function RjsApp({
  children,
  config: propConfig,
}: {
  children: React.ReactNode;
  config?: Partial<AppConfig>;
}) {
  propConfig = propConfig || {};
  const authContextUrl = propConfig["auth.context"] || "/api/auth/info";
  const authRequired = propConfig["auth.required"] || true;
  const configUrl = propConfig["config.url"];
  const configParams = propConfig["config.params"] || {
    timeout: 10000,
    retries: 2,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const [appConfig, setAppConfig] = useState<ConfigManager<AppConfig>>(
    new ConfigManager(
      { ...defaultConfig, ...propConfig },
      configUrl,
      configParams
    )
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [authContext, setAuthContext] = useState<AuthContext | null>(null);

  let timestamp = 0;

  const setLoadingStatus = (loadingStatus: boolean) => {
    if (loadingStatus == true) {
      timestamp = new Date().getTime();
    }

    if (isLoading == loadingStatus) {
      return;
    }

    setIsLoading(loadingStatus);
    if (!loadingStatus) {
      if (error || (authRequired && !authContext)) {
        return;
      }

      const timeDiff = new Date().getTime() - timestamp;
      if (
        SKIP_REVEALING_ON_FAST_LOAD > 0 &&
        timeDiff < SKIP_REVEALING_ON_FAST_LOAD
      ) {
        return;
      }

      // Loading is complete, transition to the next state
      setIsRevealing(true);
      setTimeout(() => {
        setIsRevealing(false);
      }, REVEALING_TIME);
    }
  };

  // Handle errors from the error boundary
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error("RjsApp caught an error:", error);
    // Set the error using the existing setError function
    setError({ error, errorInfo, errorTitle: "Application Error" });
  };

  useEffect(() => {
    // Add classes
    if (isLoading) {
      document.body.classList.add("app-loading");
      return;
    }

    document.body.classList.remove("app-loading");
    if (isRevealing) {
      document.body.classList.add("app-transition");
    } else {
      document.body.classList.remove("app-transition");
      document.body.classList.add("app-done");
    }
  }, [isRevealing, isLoading]);

  const validateAuthContext = (authContext: AuthContext) => {
    if (
      authContext &&
      typeof authContext === "object" &&
      "realm" in authContext &&
      "user" in authContext &&
      "profile" in authContext &&
      "organization" in authContext
    ) {
      return authContext as AuthContext;
    }
    throw new Error(
      "Auth context response does not match expected structure: " +
        JSON.stringify(authContext)
    );
  };

  const initApp = async () => {
    try {
      setLoadingStatus(true);
      setError(null);

      // Load config and auth context in parallel
      const promises: Promise<any>[] = [];

      // Add config loading promise
      const configPromise = appConfig.loadRemoteConfig();
      promises.push(configPromise);

      // Add auth context loading promise if authContextUrl is provided
      let authPromise: Promise<AuthContext | null> = Promise.resolve(null);
      if (authContextUrl) {
        authPromise = fetch(authContextUrl)
          .then(async (response) => {
            if (!response.ok) {
              if (response.status == 401) {
                return null;
              }

              setError({
                error: new Error(
                  `HTTP ${response.status}: ${response.statusText}`
                ),
                errorInfo: null,
                errorTitle: "Authentication Error",
              });
              return null;
            }
            const authData = await response.json();

            // Validate that the response matches our AuthContext type
            return validateAuthContext(authData);
          })
          .catch((authError) => {
            setError({
              error: new Error("Failed to fetch auth context: " + authError),
              errorInfo: null,
              errorTitle: "Authentication Error",
            });
            return null;
          });
      }
      promises.push(authPromise);

      // Wait for both promises to complete
      const [configResult, authContext] = await Promise.all(promises);

      setAppConfig(configResult);
      setAuthContext(authContext);
      console.log("authContext", authContext);
    } catch (configError) {
      console.error("Failed to initialize configuration:", configError);
      setError({
        error:
          configError instanceof Error
            ? configError
            : new Error("Configuration initialization failed"),
        errorInfo: null,
        errorTitle: "Configuration Error",
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    initApp();
  }, [configUrl, authContextUrl]);

  const contextValue: AppContextType = {
    config: appConfig,
    isLoading,
    isRevealing,
    error,
    authContext,
  };

  // Determine which screen to show based on priority:
  // 1. Loading (highest priority)
  // 2. Error (configuration/network issues)
  // 3. Unauthorized (auth required but not available)
  // 4. Children (normal app content)

  const loginRedirectUrl = () => {
    const url =
      appConfig.get<string>("auth.loginRedirect") || "/api/auth/login";
    return url + "?next=" + encodeURIComponent(window.location.href);
  };

  const renderContent = () => {
    if (error) {
      return <ErrorScreen error={error} />;
    }

    if (isLoading) {
      return null;
    }

    // Priority 3: Show unauthorized screen when auth is required but not available
    if (authRequired && !authContext) {
      return <UnauthorizedScreen loginRedirectUrl={loginRedirectUrl()} />;
    }

    return (
      <BrowserRouter>
        <RjsRouteHandler />
        <Routes>{children}</Routes>
      </BrowserRouter>
    );
  };

  return (
    <AppContext.Provider value={contextValue}>
      <RjsAppErrorBoundary
        errorModule="Application Error"
        onError={handleError}
      >
        {renderContent()}
      </RjsAppErrorBoundary>
    </AppContext.Provider>
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
