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

export interface ModuleSlotProps {
  name?: string;
  allowEmpty?: boolean;
  paramValue?: string;
  initStatus?: string;
  children?: React.ReactNode;
}

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
      if (this.mounted) {
        // Only update if slotStatus or slotParams changed (relevant to this slot)
        const slotName = this.slotName;
        const prevState = this.state.pageState;
        
        const shouldUpdate = 
          prevState.slotStatus?.[slotName] !== value.slotStatus?.[slotName] ||
          JSON.stringify(prevState.slotParams) !== JSON.stringify(value.slotParams) ||
          prevState.name !== value.name;

        if (shouldUpdate) {
          this.setState({ pageState: value });
        }
      }
    });

    this.setState({ initialized: true });
  }

  protected get slotStatus() {
    return this.state.pageState.slotStatus?.[this.slotName] || 'active';
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

    const { allowEmpty = false } = this.props;

    let slotContent = this.context.pageModules[this.slotName];
    let hasSlotContent = !!slotContent && slotContent.length > 0;
    let renderContent = hasSlotContent ? slotContent : this.props.children;
    let hideSlot = this.slotStatus === 'hidden';
    
    console.log('ModuleSlot Render manual subscription', this.state.pageState);
        
    if(hideSlot || (!renderContent && !allowEmpty)) {
      return null;
    }

    return (
      <div className="module-slot" data-slot-id={this.slotName}>
        <div className="module-slot__status">{this.slotName} {this.slotStatus}</div>
        {renderContent}
      </div>
    );
  }
} 