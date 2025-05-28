import React from 'react';
import { useStore } from '@nanostores/react';
import { pageStore } from '../store/pageStore';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

export interface PageLayoutContextType {
  layoutId: string;
  pageModules: Record<string, React.ReactNode[]>;
}

export const PageLayoutContext = React.createContext<PageLayoutContextType | null>(null);

export interface PageLayoutProps {
  children?: React.ReactNode;
  modules?: Record<string, React.ReactNode[]>;  
}

export abstract class PageLayout extends React.Component<PageLayoutProps> {
  static displayName = 'PageLayout';
  private layoutId: string;

  protected get modules() {
    return this.props.modules || {};
  }

  constructor(props: PageLayoutProps) {
    super(props);
    this.layoutId = this.constructor.name;
  }

  componentDidMount() {
    this.onMount();
  }

  componentWillUnmount() {
    this.onUnmount();
  }

  protected onMount(): void {
    // Override in subclass if needed
  }

  protected onUnmount(): void {
    // Override in subclass if needed
  }

  abstract renderContent(): React.ReactNode;

  render() {
    return (
      <PageLayoutContext.Provider value={{ layoutId: this.layoutId, pageModules: this.modules }}>
        {this.renderContent()}
      </PageLayoutContext.Provider>
    );
  }
}

export const withPageState = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithPageStateComponent(props: P) {
    const pageState = useStore(pageStore);
    return <WrappedComponent {...props} pageState={pageState} />;
  };
}; 