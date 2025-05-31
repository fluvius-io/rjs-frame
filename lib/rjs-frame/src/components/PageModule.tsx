import React, { Component, type ReactNode } from 'react';
import { pageStore, updatePageState } from '../store/pageStore';
import { generate } from "short-uuid";
import { PageLayoutContext, PageSlotContext, type PageSlotContextType } from "../contexts/LayoutContexts";
import type { PageState, PageParams } from "../types/PageState";
import "../styles/index.css";

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
    
    // Default: update on any change to core state properties
    return (
      prevState.pageName !== newState.pageName ||
      JSON.stringify(prevState.pageParams) !== JSON.stringify(newState.pageParams) ||
      JSON.stringify(prevState.linkParams) !== JSON.stringify(newState.linkParams) ||
      prevState.breadcrumbs !== newState.breadcrumbs ||
      JSON.stringify(prevState.globalState) !== JSON.stringify(newState.globalState) ||
      JSON.stringify(prevState.moduleState) !== JSON.stringify(newState.moduleState) ||
      JSON.stringify(prevState.auth) !== JSON.stringify(newState.auth)
    );
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

          return (
            <div className="page-module" data-slot-name={this.slotContext ? this.slotContext.name : 'main'}>
              {this.renderContent()}
            </div>
          );
        }}
      </PageSlotContext.Consumer>
    );
  }

  protected renderContent(): React.ReactNode {
    return this.props.children;
  };
}
