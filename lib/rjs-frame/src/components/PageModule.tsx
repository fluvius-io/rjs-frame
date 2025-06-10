import React from "react";
import { Routes } from "react-router-dom";
import { generate } from "short-uuid";
import {
  PageLayoutContext,
  PageSlotContext,
  type PageSlotContextType,
} from "../contexts/LayoutContexts";
import { pageStore, updatePageState } from "../store/pageStore";
import "../styles/index.css";
import type { PageState } from "../types/PageState";

export interface PageModuleState {
  pageState: PageState;
  initialized: boolean;
}

export interface PageModuleProps {
  children?: React.ReactNode;
  slotName?: string;
  data?: Record<string, any>;
}

export class PageModule extends React.Component<
  PageModuleProps,
  PageModuleState
> {
  private moduleId: string;
  private unsubscribe: (() => void) | null = null;
  private mounted: boolean = false;
  private moduleName: string;
  private slotContextRef = React.createRef<PageSlotContextType>();

  static contextType = PageLayoutContext;
  declare readonly context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: PageModuleProps) {
    super(props);
    this.moduleId = generate();
    this.moduleName = this.constructor.name;
    this.state = {
      pageState: pageStore.get(),
      initialized: false,
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (!this.context) {
      console.error("PageModule must be rendered within a PageLayout");
      return;
    }

    const { data = {} } = this.props;

    // Subscribe to store changes with selective updates
    this.unsubscribe = pageStore.subscribe((value) => {
      if (this.mounted && this.shouldUpdate(value)) {
        this.setState({ pageState: value });
      }
    });

    updatePageState((state) => ({
      ...state,
      moduleState: {
        ...state.moduleState,
        [this.moduleId]: {
          component: this.moduleId,
          ...data,
        },
      },
    }));

    this.setState({ initialized: true });
  }

  // Override this method in subclasses to customize when the module should re-render
  protected shouldUpdate(newState: PageState): boolean {
    const prevState = this.state.pageState;

    // Default: only pageName and pageParams are checked for updates
    return (
      prevState.pageName !== newState.pageName ||
      JSON.stringify(prevState.pageParams) !==
        JSON.stringify(newState.pageParams)
    );

    // TODO: Add more checks for other state properties if needed
    // JSON.stringify(prevState.linkParams) !==
    //   JSON.stringify(newState.linkParams) ||
    // prevState.breadcrumbs !== newState.breadcrumbs ||
    // JSON.stringify(prevState.globalState) !==
    //   JSON.stringify(newState.globalState) ||
    // JSON.stringify(prevState.moduleState) !==
    //   JSON.stringify(newState.moduleState)
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (!this.context) return;

    updatePageState((state) => {
      const { [this.moduleId]: _, ...rest } = state.moduleState;
      return {
        ...state,
        moduleState: rest,
      };
    });
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

    return (
      <PageSlotContext.Consumer>
        {(slotContext) => {
          // Store the context in ref for access in other methods
          (this.slotContextRef as any).current = slotContext;

          if (!slotContext) {
            return (
              <div className="page-module page-module--error">
                ERROR: PageModule must be rendered within a PageSlot
              </div>
            );
          }

          return this.renderContent();
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
