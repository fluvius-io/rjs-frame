import React from "react";
import { Routes } from "react-router-dom";
import { generate } from "short-uuid";
import {
  PageLayoutContext,
  PageSlotContext,
  type PageSlotContextType,
} from "../contexts/LayoutContexts";
import { getAppState, matchPageParams } from "../store/appStateStore";
import "../styles/index.css";
import type { AppState } from "../types/AppState";
import { cn } from "../utils";
import { type ParamSpec } from "../utils/matchParams";

export interface PageModuleState {
  appState: AppState;
  initialized: boolean;
  hasError?: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorLines?: number;
}

export interface PageModuleProps {
  children?: React.ReactNode;
  slotName?: string;
  data?: Record<string, any>;
  condition?: ParamSpec;
  className?: string;
  moduleName?: string;
}

export class PageModule<
  P extends PageModuleProps = PageModuleProps,
  S extends PageModuleState = PageModuleState
> extends React.Component<P, S> {
  private moduleId: string;
  private unsubscribe: (() => void) | null = null;
  private mounted: boolean = false;
  private moduleName: string;
  private slotContextRef = React.createRef<PageSlotContextType>();

  static contextType = PageLayoutContext;
  declare readonly context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: P) {
    super(props);
    this.moduleId = generate();
    this.moduleName = props.moduleName || this.constructor.name;
    this.state = {
      appState: getAppState(),
      initialized: false,
      hasError: false,
    } as unknown as S;
  }

  generateModuleId(props: P) {
    return generate();
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error(`PageModule [${this.moduleName}] Error:`, error);
    console.error(`PageModule [${this.moduleName}] Error Info:`, errorInfo);

    // Update state to show error UI
    this.setState({
      hasError: true,
      error,
      errorInfo,
    } as unknown as S);
  }

  componentDidMount() {
    this.mounted = true;

    if (!this.context) {
      console.error("PageModule must be rendered within a PageLayout");
      return;
    }

    const { data = {} } = this.props;

    this.setState({ initialized: true });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // Getter for accessing current page state
  protected get appState(): AppState {
    return this.state.appState;
  }

  // Getter for accessing module-specific private state
  protected get moduleState(): any {
    return this.state.appState.moduleState[this.moduleId] || {};
  }

  // Getter for accessing slot context
  protected get slotContext(): PageSlotContextType | null {
    return this.slotContextRef.current;
  }

  // Method to render error UI
  protected renderError(): React.ReactNode {
    const { error, errorLines = 3 } = this.state;

    const lines = error?.stack?.split("\n") || [];
    return (
      <div className="page-module page-module--error">
        <div className="page-module-error__content">
          <h3 className="page-module-error__title">
            Error in module [{this.moduleName}]
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
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(error?.stack || "");
                    e.currentTarget.textContent = "[ copied to clipboard ]";
                    setTimeout(() => {
                      e.currentTarget.textContent = "[ copy ]";
                    }, 5000);
                  }}
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
                hasError: false,
                error: undefined,
                errorInfo: undefined,
                errorLines: 3,
              } as unknown as S)
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  render() {
    // Check for errors first
    if (this.state.hasError) {
      return this.renderError();
    }

    if (
      !matchPageParams(this.props.condition, `PageModule[${this.moduleName}]`)
    ) {
      return null;
    }
    if (!this.context) {
      return (
        <div className="page-module page-module--error">
          ERROR: PageModule must be rendered within a PageLayout:{" "}
          {this.moduleName}
        </div>
      );
    }

    if (!this.state.initialized) {
      return <div className="page-module page-module--loading">Loading...</div>;
    }

    return (
      <PageSlotContext.Consumer>
        {(slotContext) => {
          // Store the context in ref for access in other methods
          (this.slotContextRef as any).current = slotContext;

          if (!slotContext) {
            return (
              <div className="page-module page-module--error">
                ERROR: PageModule [{this.moduleName}] must be rendered within a
                PageSlot
              </div>
            );
          }

          return (
            <div className={cn("page-module", this.props.className)}>
              {this.renderContent()}
            </div>
          );
        }}
      </PageSlotContext.Consumer>
    );
  }

  protected renderContent(): React.ReactNode {
    return this.props.children;
  }
}

export class RoutingModule extends PageModule {
  render() {
    return <Routes>{this.props.children}</Routes>;
  }
}

export { Route } from "react-router-dom";
