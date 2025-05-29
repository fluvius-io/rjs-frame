import React from "react";
import { pageStore, updatePageState } from "../store/pageStore";
import { generate } from "short-uuid";
import { PageLayoutContext } from "./PageLayout";
import { ModuleSlotContext, type ModuleSlotContextType } from "./ModuleSlot";
import type { PageState } from "../types/PageState";
import "../styles/ModuleSlot.scss";

export interface PageModuleState {
  pageState: PageState;
  initialized: boolean;
}

export interface PageModuleProps {
  children?: React.ReactNode;
  data?: Record<string, any>;
}

export abstract class PageModule extends React.Component<
  PageModuleProps,
  PageModuleState
> {
  private moduleId: string;
  private unsubscribe: (() => void) | null = null;
  private mounted: boolean = false;
  private moduleName: string;
  private slotContextRef = React.createRef<ModuleSlotContextType>();

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
      privState: {
        ...state.privState,
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
      prevState.name !== newState.name ||
      JSON.stringify(prevState.slotParams) !== JSON.stringify(newState.slotParams) ||
      JSON.stringify(prevState.linkParams) !== JSON.stringify(newState.linkParams) ||
      prevState.privState[this.moduleId] !== newState.privState[this.moduleId]
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
      const { [this.moduleId]: _, ...rest } = state.privState;
      return {
        ...state,
        privState: rest,
      };
    });
  }

  // Getter for accessing current page state
  protected get pageState(): PageState {
    return this.state.pageState;
  }

  // Getter for accessing module-specific private state
  protected get moduleState(): any {
    return this.state.pageState.privState[this.moduleId] || {};
  }

  // Getter for accessing slot context
  protected get slotContext(): ModuleSlotContextType | null {
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
      <ModuleSlotContext.Consumer>
        {(slotContext) => {
          // Store the context in ref for access in other methods
          (this.slotContextRef as any).current = slotContext;
          
          if (!slotContext) {
            return (
              <div className="page-module page-module--error">
                ERROR: PageModule must be rendered within a ModuleSlot
              </div>
            );
          }

          return (
            <div className="page-module" data-slot-name={this.slotContext ? this.slotContext.name : 'main'}>
              {this.renderContent()}
            </div>
          );
        }}
      </ModuleSlotContext.Consumer>
    );
  }

  protected abstract renderContent(): React.ReactNode;
}
