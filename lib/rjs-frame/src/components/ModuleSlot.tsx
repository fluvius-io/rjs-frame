import React from 'react';
import { pageStore } from '../store/pageStore';
import { PageLayoutContext } from './PageLayout';
import '../styles/ModuleSlot.scss';

export interface ModuleSlotState {
  pageState: any;
  initialized: boolean;
  error: string | null;
}

export interface ModuleSlotProps {
  id: string;
  children?: React.ReactNode;
}

export class ModuleSlot extends React.Component<ModuleSlotProps, ModuleSlotState> {
  private unsubscribe: (() => void) | null = null;

  static contextType = PageLayoutContext;
  declare context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: ModuleSlotProps) {
    super(props);
    this.state = {
      pageState: pageStore.get(),
      initialized: false,
      error: null
    };
  }

  componentDidMount() {
    if (!this.context) {
      this.setState({ error: 'ModuleSlot must be rendered within a PageLayout' });
      return;
    }

    // Subscribe to store changes
    this.unsubscribe = pageStore.subscribe((value) => {
      this.setState({ pageState: value });
    });

    this.setState({ initialized: true });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    if (!this.context) {
      return (
        <div className="module-slot module-slot--error">
          ModuleSlot must be rendered within a PageLayout
        </div>
      );
    }

    if (!this.state.initialized) {
      return <div className="module-slot module-slot--loading">{this.props.children}</div>;
    }

    const { id } = this.props;
    const fullSlotId = `${this.context.layoutId}:${id}`.toLowerCase();

    let hasModules = !!this.context.pageModules[id] && this.context.pageModules[id].length > 0;
    let content = hasModules ? this.context.pageModules[id] : this.props.children;
    let contentSource = hasModules ? 'Modules' : 'Children';

    return (
      <div className="module-slot" data-slot-id={fullSlotId} style={{border: '1px solid green', margin: '5px', padding: '10px'}}>
        <div style={{border: '1px solid orange', padding: '10px', margin: '5px'}}>
        <h3>Module Slot: {fullSlotId}</h3>
        <div>Source: {contentSource}</div>
        {content}
        </div>
      </div>
    );
  }
} 