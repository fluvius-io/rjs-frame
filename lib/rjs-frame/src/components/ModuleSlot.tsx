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
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export class ModuleSlot extends React.Component<ModuleSlotProps, ModuleSlotState> {
  private unsubscribe: (() => void) | null = null;

  static contextType = PageLayoutContext;
  context!: React.ContextType<typeof PageLayoutContext>;

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
      return <div className="module-slot module-slot--loading"></div>;
    }

    const { id, fallback } = this.props;
    const fullSlotId = `${this.context.layoutId}:${id}`;
    const moduleData = this.state.pageState?.priv_state?.[fullSlotId];

    if (!moduleData && fallback) {
      return (
        <div className="module-slot module-slot--with-fallback">
          {fallback}
        </div>
      );
    }

    if (!moduleData) {
      return <div className="module-slot" data-slot-id={fullSlotId}></div>;
    }

    return (
      <div className="module-slot" data-slot-id={fullSlotId}>
        {this.props.children}
      </div>
    );
  }
} 