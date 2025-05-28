import React from 'react';
import { atom } from 'nanostores';
import { pageStore, updatePageState } from '../store/pageStore';
import { generate } from 'short-uuid';
import { PageLayoutContext } from './PageLayout';

export interface PageModuleState {
  pageState: any;
  initialized: boolean;
}

export interface PageModuleProps {
  slotId: string;
  children?: React.ReactNode;
  data?: Record<string, any>;
}

export abstract class PageModuleBase extends React.Component<PageModuleProps, PageModuleState> {
  private moduleId: string;
  private unsubscribe: (() => void) | null = null;

  static contextType = PageLayoutContext;
  declare readonly context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: PageModuleProps) {
    super(props);
    this.moduleId = generate();
    this.state = { 
      pageState: pageStore.get(),
      initialized: false
    };
  }

  componentDidMount() {
    if (!this.context) {
      console.error('PageModule must be rendered within a PageLayout');
      return;
    }

    if (!this.props.slotId) {
      console.error('PageModule must be provided a slotId prop');
      return;
    }

    const { data = {} } = this.props;
    const fullSlotId = `${this.context.layoutId}:${this.props.slotId}`;

    // Subscribe to store changes
    this.unsubscribe = pageStore.subscribe((value) => {
      this.setState({ pageState: value });
    });

    updatePageState((state) => ({
      ...state,
      priv_state: {
        ...state.priv_state,
        [fullSlotId]: {
          component: this.moduleId,
          ...data
        }
      }
    }));

    this.setState({ initialized: true });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    if (!this.context || !this.props.slotId) return;

    const fullSlotId = `${this.context.layoutId}:${this.props.slotId}`;

    updatePageState((state) => {
      const { [fullSlotId]: _, ...rest } = state.priv_state;
      return {
        ...state,
        priv_state: rest
      };
    });
  }

  render() {
    if (!this.context) {
      console.error('PageModule must be rendered within a PageLayout');
      return null;
    }

    if (!this.state.initialized) {
      return null;
    }

    const fullSlotId = `${this.context.layoutId}:${this.props.slotId}`;
    const currentModule = this.state.pageState?.priv_state?.[fullSlotId];

    if (!currentModule) {
      return null;
    }

    return this.renderContent();
  }

  protected abstract renderContent(): React.ReactNode;
}

// Export the base class
export { PageModuleBase as PageModule };
