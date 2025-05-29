import React from 'react';
import { pageStore } from '../store/pageStore';
import { PageLayoutContext } from './PageLayout';
import '../styles/ModuleSlot.scss';
import type { PageState } from '../types/PageState';

export interface ModuleSlotState {
  pageState: PageState;
  initialized: boolean;
  error: string | null;
}

export interface ModuleSlotContextType {
  args?: string;
  name: string;
}

export interface ModuleSlotProps {
  name?: string;
  renderEmpty?: boolean;
  allowToggle?: boolean;
  defaultParamValue?: string;
  children?: React.ReactNode;
}

export const ModuleSlotContext = React.createContext<ModuleSlotContextType>({name: 'main'});

export class ModuleSlot extends React.Component<ModuleSlotProps, ModuleSlotState> {
  private unsubscribe: (() => void) | null = null;
  private mounted: boolean = false;

  static contextType = PageLayoutContext;
  declare context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: ModuleSlotProps) {
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
      this.setState({ error: 'ModuleSlot must be rendered within a PageLayout' });
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

  protected get slotStatus() {
    let defaultStatus = this.props.allowToggle ? 'hidden' : 'active';
    return this.state.pageState.slotStatus?.[this.slotName] || defaultStatus;
  }

  protected get slotParams() {
    return this.state.pageState.slotParams?.[this.slotName] || undefined;
  }

  protected get slotName() {
    return this.props.name || 'main';
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
        <div className="module-slot module-slot--error">
          ERROR: ModuleSlot must be rendered within a PageLayout
        </div>
      );
    }

    if (!this.state.initialized) {
      return <div className="module-slot module-slot--loading">{this.props.children}</div>;
    }

    const { renderEmpty = false } = this.props;

    let slotContent = this.context.pageModules[this.slotName];
    let hasSlotContent = !!slotContent && slotContent.length > 0;
    let renderingContent = hasSlotContent ? slotContent : [this.props.children];
    let hideSlot = this.slotStatus === 'hidden';
    let slotContext: ModuleSlotContextType = { args: this.slotParams, name: this.slotName };
           
    if(hideSlot || (!renderEmpty && !renderingContent)) {
      return null;
    }

    return (
      <ModuleSlotContext.Provider value={slotContext}>
        <div className="module-slot" data-slot-name={this.slotName}>
          {renderingContent.map((content, index) => (
            <React.Fragment key={index}>
              {content}
            </React.Fragment>
          ))}
        <div className="module-slot__status">{this.slotName} : {this.slotStatus} {this.slotParams ?  ' = ' + this.slotParams : ''}</div>
        </div>
      </ModuleSlotContext.Provider>
    );
  }
} 