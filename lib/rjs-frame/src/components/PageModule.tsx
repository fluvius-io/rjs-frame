import React, { useContext } from 'react';
import { useStore } from '@nanostores/react';
import { pageStore, updatePageState } from '../store/pageStore';
import { generate } from 'short-uuid';
import { PageLayoutContext } from './PageLayout';

// Base props that all PageModules must implement internally
export interface PageModuleBaseProps {
  slotId: string;
  children?: React.ReactNode;
  data?: Record<string, any>;
  pageState?: any;
}

// Props that are required when instantiating a PageModule
export interface PageModuleInstanceProps {
  children?: React.ReactNode;
  data?: Record<string, any>;
}

export class PageModuleBase<P extends PageModuleInstanceProps = PageModuleInstanceProps> extends React.Component<P & Partial<PageModuleBaseProps>> {
  private moduleId: string;
  private slotId: string;
  static contextType = PageLayoutContext;
  context!: React.ContextType<typeof PageLayoutContext>;

  constructor(props: P & Partial<PageModuleBaseProps>) {
    super(props);
    this.moduleId = generate();
    // Subclasses must set this in their constructor
    this.slotId = '';
  }

  protected setSlotId(slotId: string) {
    this.slotId = slotId;
  }

  componentDidMount() {
    if (!this.context) {
      console.error('PageModule must be rendered within a PageLayout');
      return;
    }

    if (!this.slotId) {
      console.error('PageModule must set slotId in constructor');
      return;
    }

    const { data = {} } = this.props;
    const fullSlotId = `${this.context.layoutId}:${this.slotId}`;

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
  }

  componentWillUnmount() {
    if (!this.context || !this.slotId) return;

    const fullSlotId = `${this.context.layoutId}:${this.slotId}`;

    updatePageState((state) => {
      const { [fullSlotId]: _, ...rest } = state.priv_state;
      return {
        ...state,
        priv_state: rest
      };
    });
  }

  render() {
    if (!this.context || !this.slotId) {
      console.error('PageModule must be rendered within a PageLayout and have a slotId');
      return null;
    }

    const { children, pageState } = this.props;
    const fullSlotId = `${this.context.layoutId}:${this.slotId}`;
    const currentModule = pageState?.priv_state?.[fullSlotId];

    if (!currentModule) {
      return null;
    }

    return <>{children}</>;
  }
}

// HOC to inject page state
export const PageModule = (props: PageModuleInstanceProps) => {
  const pageState = useStore(pageStore);
  const layoutContext = useContext(PageLayoutContext);

  if (!layoutContext) {
    console.error('PageModule must be rendered within a PageLayout');
    return null;
  }

  return <PageModuleBase {...props} pageState={pageState} />;
}; 