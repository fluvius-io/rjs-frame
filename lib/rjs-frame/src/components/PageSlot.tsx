import { PageLayoutContext } from '../contexts/LayoutContexts';
import { PageSlotContext, type PageSlotContextType } from '../contexts/LayoutContexts';
import { pageStore } from '../store/pageStore';
import React from 'react';
import '../styles/RjsFrame.scss';
import type { PageState } from '../types/PageState';

export interface PageSlotState {
  pageState: PageState;
  initialized: boolean;
  error: string | null;
}

export interface PageSlotProps {
  name?: string;
  renderEmpty?: boolean;
  allowToggle?: boolean;
  defaultVisibility?: 'show' | 'hide'| 'always';
  defaultParamValue?: string;
  className?: string;
  children?: React.ReactNode;
}

export class PageSlot extends React.Component<PageSlotProps, PageSlotState> {
  private unsubscribe: (() => void) | null = null;
  private mounted: boolean = false;

  static contextType = PageLayoutContext;
  declare context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: PageSlotProps) {
    super(props);
    
    // Initialize state with latest store value
    this.state = {
      pageState: pageStore.get(),
      initialized: false,
      error: null
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (!this.context) {
      this.setState({ error: 'PageSlot must be rendered within a PageLayout' });
      return;
    }

    // Get the latest state immediately when mounting
    const currentState = pageStore.get();
    this.setState({ pageState: currentState });

    // Subscribe to store changes after mounting
    this.unsubscribe = pageStore.subscribe((value) => {
      if (this.shouldUpdate(value)) {
        this.setState({ pageState: value });
      }
    });

    this.setState({ initialized: true });
  }

  // Override this method in subclasses to customize when the slot should re-render
  protected shouldUpdate(newState: PageState): boolean {
    if(!this.mounted) {
      return false;
    }

    const prevState = this.state.pageState;
    const slotName = this.slotName;
    
    return (
      prevState.slotStatus?.[slotName] !== newState.slotStatus?.[slotName] ||
      JSON.stringify(prevState.slotParams) !== JSON.stringify(newState.slotParams) ||
      prevState.name !== newState.name
    );
  }

  protected get hasDefaultParams() {
    return this.slotName in this.state.pageState.slotParams;
  }

  protected get slotParams() {
    return this.state.pageState.slotParams?.[this.slotName] || undefined;
  }

  protected get slotName() {
    return this.props.name || 'main';
  }
  
  protected get slotVisible() : boolean {
    let defaultVisibility = this.props.defaultVisibility || 'show';

    if (defaultVisibility === 'always') {
      return true;
    }

    if (defaultVisibility === 'show') {
      return !this.slotParams || !['off', 'hide', 'hidden'].includes(this.slotParams as string);
    }

    if (defaultVisibility === 'hide') {
      return this.hasDefaultParams && (!this.slotParams || !['off', 'hide', 'hidden'].includes(this.slotParams as string));
    }

    return true;
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  render() {
    if (!this.context) {
      return (
        <div className="page-slot page-slot--error">
          ERROR: PageSlot must be rendered within a PageLayout
        </div>
      );
    }

    if(!this.slotVisible) {
      return null;
    }

    if (!this.state.initialized) {
      return <div className="page-slot page-slot--loading">{this.props.children}</div>;
    }

    const { renderEmpty = false } = this.props;

    let slotContent = this.context.pageModules[this.slotName];
    let hasSlotContent = !!slotContent && slotContent.length > 0;
    let renderingContent = hasSlotContent ? slotContent : [this.props.children];
           
    if(!renderEmpty && !renderingContent) {
      return null;
    }

    let slotContext: PageSlotContextType = { args: this.slotParams, name: this.slotName };

    const pageSlotClassName = this.props.className 
      ? `page-slot ${this.props.className}` 
      : 'page-slot';

    // Prepare data attributes for X-Ray mode pseudo-elements
    const slotParamsDisplay = this.slotParams ? ` = ${this.slotParams}` : '';

    return (
      <PageSlotContext.Provider value={slotContext}>
        <div 
          className={pageSlotClassName} 
          data-slot-name={this.slotName}
          data-slot-params={slotParamsDisplay}
        >
          {renderingContent.map((content, index) => (
            <React.Fragment key={index}>
              {content}
            </React.Fragment>
          ))}
        </div>
      </PageSlotContext.Provider>
    );
  }
} 