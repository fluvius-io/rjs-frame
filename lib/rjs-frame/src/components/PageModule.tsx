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
import { RjsAppErrorBoundary } from "./RjsApp";

export interface PageModuleState {
  appState: AppState;
  initialized: boolean;
}

export interface PageModuleProps {
  children?: React.ReactNode;
  slotName: string;
  data?: Record<string, any>;
  condition?: ParamSpec;
  className?: string;
  moduleName?: string;
}

export class PageModule<
  P extends PageModuleProps = PageModuleProps,
  S extends PageModuleState = PageModuleState
> extends React.Component<P, S> {
  private moduleIdValue: string;
  private unsubscribe: (() => void) | null = null;
  private moduleName: string;
  private slotContextRef = React.createRef<PageSlotContextType>();

  static contextType = PageLayoutContext;
  declare readonly context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: P) {
    super(props);
    this.moduleIdValue = this.generateModuleId(props);
    this.moduleName = props.moduleName || this.moduleIdValue;
    this.state = {
      appState: getAppState(),
      initialized: false,
    } as unknown as S;
  }

  get moduleId(): string {
    return this.moduleIdValue;
  }

  generateModuleId(props: P) {
    return `${this.constructor.name}-${generate()}`;
  }

  componentDidMount() {
    this.setState({ initialized: true });
  }

  componentWillUnmount() {}

  // Getter for accessing current page state
  protected get appState(): AppState {
    return this.state.appState;
  }

  // Getter for accessing module-specific private state
  protected get moduleState(): any {
    return this.state.appState.moduleState[this.moduleIdValue] || {};
  }

  // Getter for accessing slot context
  protected get slotContext(): PageSlotContextType | null {
    return this.slotContextRef.current;
  }

  renderContent() {
    return this.props.children;
  }

  renderContext() {
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

  render(): React.ReactNode {
    return (
      <RjsAppErrorBoundary errorModule={this.moduleName}>
        {this.renderContext()}
      </RjsAppErrorBoundary>
    );
  }
}

export class RoutingModule extends PageModule {
  render() {
    return <Routes>{this.props.children}</Routes>;
  }
}

export { Route } from "react-router-dom";
