import React from "react";
import { Routes } from "react-router-dom";
import { generate } from "short-uuid";
import {
  PageLayoutContext,
  PageSlotContext,
  type PageSlotContextType,
} from "../contexts/LayoutContexts";
import { pageStore } from "../store/pageStore";
import "../styles/index.css";
import type { PageState } from "../types/PageState";
import { cn } from "../utils";
import { shouldRender, type MatchParams } from "../utils/matchParams";

export interface PageModuleState {
  pageState: PageState;
  initialized: boolean;
}

export interface PageModuleProps {
  children?: React.ReactNode;
  slotName?: string;
  data?: Record<string, any>;
  matchParams?: MatchParams;
  className?: string;
}

// Re-export types for convenience
export type { MatchParams, MatchParamValue } from "../utils/matchParams";

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
    this.moduleName = this.constructor.name;
    this.state = {
      pageState: pageStore.get(),
      initialized: false,
    } as unknown as S;
  }

  generateModuleId(props: P) {
    return generate();
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
  protected get pageState(): PageState {
    return this.state.pageState;
  }

  // Getter for accessing module-specific private state
  protected get moduleState(): any {
    return this.state.pageState.moduleState[this.moduleId] || {};
  }

  // Getter for accessing slot context
  protected get slotContext(): PageSlotContextType | null {
    return this.slotContextRef.current;
  }

  // Method to check if this module should render based on matchParams
  protected shouldRenderModule(): boolean {
    const { matchParams } = this.props;
    const { pageParams } = this.state.pageState;

    return shouldRender(
      matchParams,
      pageParams,
      `PageModule[${this.moduleName}]`
    );
  }

  render() {
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

    // Check if module should render based on matchParams
    if (!this.shouldRenderModule()) {
      // Module doesn't match current page parameters, don't render
      return null;
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
