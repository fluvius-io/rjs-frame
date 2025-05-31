import React, { ReactNode, useEffect, useContext, createContext, PureComponent } from 'react';
import { PageLayoutContext } from '../contexts/LayoutContexts';
import { PageSlotContext, type PageSlotContextType } from '../contexts/LayoutContexts';
import { pageStore } from '../store/pageStore';
import '../styles/index.css';
import type { PageState } from '../types/PageState';
import { PageParams } from '../types/PageState';
import { getXRayEnabled } from '../store/pageStore';
import { PageModule } from './PageModule';

export interface PageSlotState {
  pageState: PageState;
  initialized: boolean;
  error: string | null;
}

export interface PageSlotProps {
  name?: string;
  renderEmpty?: boolean;
  allowToggle?: boolean;
  visible?: 'show' | 'hide'| 'always';
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
    this.unsubscribe = pageStore.subscribe((value: PageState) => {
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
    
    return (
      JSON.stringify(prevState.pageParams) !== JSON.stringify(newState.pageParams) ||
      prevState.pageName !== newState.pageName
    );
  }

  protected get hasDefaultParams() {
    return this.slotName in this.state.pageState.pageParams;
  }

  protected get slotParams() {
    return this.state.pageState.pageParams?.[this.slotName] || undefined;
  }

  protected get pageParams() {
    return this.state.pageState.pageParams || {};
  }

  protected get slotName() {
    return this.props.name || 'main';
  }
  
  protected get slotVisible() : boolean {
    let defaultVisibility = this.props.visible || 'always';

    if (defaultVisibility === 'show') {
      return this.pageParams[this.slotName] !== false;
    }

    if (defaultVisibility === 'hide') {
      return Boolean(this.pageParams[this.slotName]);
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

    let slotContext: PageSlotContextType = { args: this.pageParams, name: this.slotName };

    const pageSlotClassName = this.props.className 
      ? `page-slot ${this.props.className}` 
      : 'page-slot';


    return (
      <PageSlotContext.Provider value={slotContext}>
        <div 
          className={pageSlotClassName} 
          data-slot-name={this.slotName}
          data-slot-visibility={this.props.visible || 'always'}
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