import React from "react";
import {
  PageLayoutContext,
  type PageLayoutContextType,
} from "../contexts/LayoutContexts";
import {
  getAppSettingsValue,
  getAppState,
  setPageName,
  subscribeToAppState,
  updateAppSettings,
} from "../store/appStateStore";
import { AppState } from "../types/AppState";
import { PageLayoutOptions } from "./PageLayoutOptions";
import { PageModule } from "./PageModule";

type ModuleValue = React.ReactNode | React.ReactNode[];

export interface PageLayoutProps {
  className?: string;
  children?: React.ReactNode;
  xRay?: boolean;
  title?: string;
  slotClasses?: Record<string, string>;
}

interface PageLayoutState {
  showPageConfigurationModal: boolean;
  appState: AppState;
}

export abstract class PageLayout<
  T extends PageLayoutProps = PageLayoutProps,
  S extends PageLayoutState = PageLayoutState
> extends React.Component<T, S> {
  private layoutId: string;
  private static activeInstance: PageLayout | null = null;
  private static instanceCount: number = 0;
  private unsubscribeAppState?: () => void;

  private gatherModulesFromChildren(): Record<string, React.ReactNode[]> {
    const pageModules: Record<string, React.ReactNode[]> = {};

    React.Children.forEach(this.props.children, (child) => {
      if (!React.isValidElement(child)) {
        console.warn(
          "[PageLayout] Invalid child element found, skipping:",
          child
        );
        return;
      }

      // Check if child is a PageModule instance
      const childType = child.type as any;
      const isPageModule =
        childType &&
        (childType.prototype instanceof PageModule ||
          childType === PageModule ||
          (childType.prototype &&
            childType.prototype.constructor?.name === "PageModule"));

      if (!isPageModule) {
        throw new Error(
          `[PageLayout] All children must be PageModule instances. Found: ${
            childType?.name || "Unknown"
          }. ` +
            `Please ensure all children extend PageModule and have a slotName prop.`
        );
      }

      // Extract props from the child
      const childProps = child.props as any;

      // Extract slotName from props, default to "main" if missing
      let slotName = childProps?.slotName;

      if (!slotName || typeof slotName !== "string") {
        slotName = "main";
        console.log(
          `[PageLayout] PageModule child missing slotName prop, defaulting to "main". Component: ${
            childType?.name || "Unknown"
          }`
        );
      }

      // Add to modules grouped by slot name
      if (!pageModules[slotName]) {
        pageModules[slotName] = [];
      }
      pageModules[slotName].push(child);
    });

    return pageModules;
  }

  protected get modules() {
    return this.gatherModulesFromChildren();
  }

  constructor(props: T) {
    super(props);
    this.layoutId = this.constructor.name;
    this.state = {
      showPageConfigurationModal: false,
      appState: getAppState(),
    } as S;
  }

  componentDidMount() {
    // Increment instance count for tracking
    PageLayout.instanceCount++;

    // Check if there's already an active instance
    if (PageLayout.activeInstance && PageLayout.activeInstance !== this) {
      console.warn(
        `[PageLayout] Multiple PageLayout instances detected. Only one PageLayout should be active at a time.`,
        `Current: ${this.layoutId}, Previous: ${PageLayout.activeInstance.layoutId}`
      );

      // Force cleanup of previous instance
      PageLayout.activeInstance.forceCleanup();
    }

    // Set this as the active instance
    PageLayout.activeInstance = this;

    // Subscribe to page store changes
    this.unsubscribeAppState = subscribeToAppState((appState: AppState) => {
      this.setState({ appState });
    });

    // Initialize xRay from props if provided (for backward compatibility)
    if (this.props.xRay !== undefined) {
      updateAppSettings({ xRay: this.props.xRay });
    }

    // Set initial breadcrumbs from title prop
    if (this.props.title) {
      setPageName(this.props.title);
    }

    // Validate children on mount
    try {
      this.gatherModulesFromChildren();
      // Setup event listeners only for the active instance
      this.setupEventListeners();
      this.onMount();
    } catch (error) {
      console.error("[PageLayout] Validation failed:", error);
      throw error;
    }
  }

  componentDidUpdate(prevProps: PageLayoutProps) {
    // Update breadcrumbs if title prop changes
    if (prevProps.title !== this.props.title && this.props.title) {
      setPageName(this.props.title);
    }
  }

  componentWillUnmount() {
    // Decrement instance count
    PageLayout.instanceCount--;

    // Unsubscribe from page store
    if (this.unsubscribeAppState) {
      this.unsubscribeAppState();
    }

    // Clean up only if this is the active instance
    if (PageLayout.activeInstance === this) {
      this.cleanupEventListeners();
      PageLayout.activeInstance = null;
    }

    this.onUnmount();
  }

  private setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  private cleanupEventListeners() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  private forceCleanup() {
    // Force cleanup of event listeners and state for inactive instances
    this.cleanupEventListeners();
    if (this.state.showPageConfigurationModal) {
      this.setState({ showPageConfigurationModal: false });
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Only handle events if this is the active instance
    if (PageLayout.activeInstance !== this) {
      return;
    }

    // Option+O (Mac) / Alt+O (Windows) to toggle options dialog
    if (event.altKey && event.code === "KeyO") {
      event.preventDefault();
      this.setState({
        showPageConfigurationModal: !this.state.showPageConfigurationModal,
      });
      return;
    }

    // Escape to close options dialog
    if (event.key === "Escape" && this.state.showPageConfigurationModal) {
      event.preventDefault();
      this.setState({ showPageConfigurationModal: false });
      return;
    }

    // Option+X (Mac) / Alt+X (Windows) to toggle X-Ray mode directly
    if (event.altKey && event.code === "KeyX") {
      event.preventDefault();
      this.toggleXRay();
      return;
    }
  };

  private toggleXRay = () => {
    const currentXRay = getAppSettingsValue("xRay", false);
    updateAppSettings({ xRay: !currentXRay });
    // Force re-render to pick up the global state change
    this.forceUpdate();
  };

  private closePageConfigurationModal = () => {
    this.setState({ showPageConfigurationModal: false });
  };

  // Static method to get current active instance info (useful for debugging)
  static getActiveInstanceInfo() {
    return {
      activeInstance: PageLayout.activeInstance?.layoutId || null,
      totalInstances: PageLayout.instanceCount,
    };
  }

  protected onMount(): void {
    // Override in subclass if needed
  }

  protected onUnmount(): void {
    // Override in subclass if needed
  }

  abstract renderContent(): React.ReactNode;

  render() {
    const xRayEnabled = getAppSettingsValue("xRay", false);

    const pageContext: PageLayoutContextType = {
      layoutId: this.layoutId,
      pageModules: this.modules,
      pageParams: this.state.appState.pageParams,
      linkParams: this.state.appState.linkParams,
      hashParams: this.state.appState.hashParams,
      slotClasses: this.props.slotClasses || {},
      addPageModule: (slotName: string, content: React.ReactNode) => {
        // TODO: Implement dynamic module addition if needed
        console.warn("[PageLayout] addPageModule not yet implemented");
      },
      removePageModule: (slotName: string, content: React.ReactNode) => {
        // TODO: Implement dynamic module removal if needed
        console.warn("[PageLayout] removePageModule not yet implemented");
      },
    };

    const className = xRayEnabled ? "page-layout x-ray" : "page-layout";

    return (
      <PageLayoutContext.Provider value={pageContext}>
        <div id={this.layoutId} className={className}>
          {this.renderContent()}
        </div>
        <PageLayoutOptions
          isVisible={
            this.state.showPageConfigurationModal &&
            PageLayout.activeInstance === this
          }
          layoutId={this.layoutId}
          modules={this.modules}
          xRayEnabled={xRayEnabled}
          isActiveInstance={PageLayout.activeInstance === this}
          totalInstances={PageLayout.instanceCount}
          onClose={this.closePageConfigurationModal}
          onToggleXRay={this.toggleXRay}
        />
      </PageLayoutContext.Provider>
    );
  }
}
