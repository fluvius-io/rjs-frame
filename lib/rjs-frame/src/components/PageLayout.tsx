import React from 'react';
import { PageLayoutOptions } from './PageLayoutOptions';
import { getXRayEnabled, setXRayEnabled, pageStore, setPageName } from '../store/pageStore';
import { PageModule } from './PageModule';
import { PageLayoutContext, type PageLayoutContextType } from '../contexts/LayoutContexts';
import type { PageState } from '../types/PageState';

type ModuleValue = React.ReactNode | React.ReactNode[];

export interface PageLayoutProps {
  children?: React.ReactNode;
  xRay?: boolean;
  title?: string;
}

interface PageLayoutState {
  showOptions: boolean;
  pageState: PageState;
}

export abstract class PageLayout extends React.Component<PageLayoutProps, PageLayoutState> {
  private layoutId: string;
  private static activeInstance: PageLayout | null = null;
  private static instanceCount: number = 0;
  private unsubscribePageStore?: () => void;

  private gatherModulesFromChildren(): Record<string, React.ReactNode[]> {
    const pageModules: Record<string, React.ReactNode[]> = {};
    
    React.Children.forEach(this.props.children, (child) => {
      if (!React.isValidElement(child)) {
        console.warn('[PageLayout] Invalid child element found, skipping:', child);
        return;
      }

      // Check if child is a PageModule instance
      const childType = child.type as any;
      const isPageModule = childType && (
        childType.prototype instanceof PageModule ||
        childType === PageModule ||
        (childType.prototype && childType.prototype.constructor?.name === 'PageModule')
      );

      if (!isPageModule) {
        throw new Error(
          `[PageLayout] All children must be PageModule instances. Found: ${childType?.name || 'Unknown'}. ` +
          `Please ensure all children extend PageModule and have a slotName prop.`
        );
      }

      // Extract slotName from props, default to "main" if missing
      let slotName = (child.props as any)?.slotName;
      
      if (!slotName || typeof slotName !== 'string') {
        slotName = 'main';
        console.log(`[PageLayout] PageModule child missing slotName prop, defaulting to "main". Component: ${childType?.name || 'Unknown'}`);
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

  constructor(props: PageLayoutProps) {
    super(props);
    this.layoutId = this.constructor.name;
    this.state = {
      showOptions: false,
      pageState: pageStore.get()
    };
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
    this.unsubscribePageStore = pageStore.subscribe((pageState: PageState) => {
      this.setState({ pageState });
    });

    // Initialize xRay from props if provided (for backward compatibility)
    if (this.props.xRay !== undefined) {
      setXRayEnabled(this.props.xRay);
    }

    // Set initial breadcrumbs from title prop
    if (this.props.title) {
      setPageName(this.props.title);
    }

    // Validate children on mount
    try {
      this.gatherModulesFromChildren();
    } catch (error) {
      console.error('[PageLayout] Validation failed:', error);
      throw error;
    }

    // Setup event listeners only for the active instance
    this.setupEventListeners();
    this.onMount();
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
    if (this.unsubscribePageStore) {
      this.unsubscribePageStore();
    }

    // Clean up only if this is the active instance
    if (PageLayout.activeInstance === this) {
      this.cleanupEventListeners();
      PageLayout.activeInstance = null;
    }

    this.onUnmount();
  }

  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private cleanupEventListeners() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private forceCleanup() {
    // Force cleanup of event listeners and state for inactive instances
    this.cleanupEventListeners();
    if (this.state.showOptions) {
      this.setState({ showOptions: false });
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Only handle events if this is the active instance
    if (PageLayout.activeInstance !== this) {
      return;
    }

    // Option+O (Mac) / Alt+O (Windows) to toggle options dialog
    if (event.altKey && event.code === 'KeyO') {
      event.preventDefault();
      this.setState({ showOptions: !this.state.showOptions });
      return;
    }
    
    // Escape to close options dialog
    if (event.key === 'Escape' && this.state.showOptions) {
      event.preventDefault();
      this.setState({ showOptions: false });
      return;
    }

    // Option+X (Mac) / Alt+X (Windows) to toggle X-Ray mode directly
    if (event.altKey && event.code === 'KeyX') {
      event.preventDefault();
      this.toggleXRay();
      return;
    }
  };

  private toggleXRay = () => {
    setXRayEnabled(!getXRayEnabled());
    // Force re-render to pick up the global state change
    this.forceUpdate();
  };

  private closeOptions = () => {
    this.setState({ showOptions: false });
  };

  // Static method to get current active instance info (useful for debugging)
  static getActiveInstanceInfo() {
    return {
      activeInstance: PageLayout.activeInstance?.layoutId || null,
      totalInstances: PageLayout.instanceCount
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
    const xRayEnabled = getXRayEnabled();
    const { breadcrumbs } = this.state.pageState;
    
    const contextValue: PageLayoutContextType = {
      layoutId: this.layoutId,
      pageModules: this.modules,
      xRay: xRayEnabled,
      addPageModule: (slotName: string, content: React.ReactNode) => {
        // TODO: Implement dynamic module addition if needed
        console.warn('[PageLayout] addPageModule not yet implemented');
      },
      removePageModule: (slotName: string, content: React.ReactNode) => {
        // TODO: Implement dynamic module removal if needed
        console.warn('[PageLayout] removePageModule not yet implemented');
      }
    };

    const className = xRayEnabled ? "page-layout x-ray" : "page-layout";

    return (
      <PageLayoutContext.Provider value={contextValue}>
        <div id={this.layoutId} className={className}>
          {this.renderContent()}
        </div>
        <PageLayoutOptions
          isVisible={this.state.showOptions && PageLayout.activeInstance === this}
          layoutId={this.layoutId}
          modules={this.modules}
          xRayEnabled={xRayEnabled}
          isActiveInstance={PageLayout.activeInstance === this}
          totalInstances={PageLayout.instanceCount}
          onClose={this.closeOptions}
          onToggleXRay={this.toggleXRay}
        />
      </PageLayoutContext.Provider>
    );
  }
} 