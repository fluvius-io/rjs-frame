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
  children?: React.ReactNode;
  data?: Record<string, any>;
}

export abstract class PageModule extends React.Component<PageModuleProps, PageModuleState> {
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

    const { data = {} } = this.props;

    // Subscribe to store changes
    this.unsubscribe = pageStore.subscribe((value) => {
      this.setState({ pageState: value });
    });

    updatePageState((state) => ({
      ...state,
      priv_state: {
        ...state.priv_state,
        [this.moduleId]: {
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

    if (!this.context) return;

    updatePageState((state) => {
      const { [this.moduleId]: _, ...rest } = state.priv_state;
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

    return this.renderContent();
  }

  protected abstract renderContent(): React.ReactNode;
}
