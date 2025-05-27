import React from 'react';
import { useStore } from '@nanostores/react';
import { pageStore } from '../store/pageStore';

export interface PageLayoutContextType {
  layoutId: string;
}

export const PageLayoutContext = React.createContext<PageLayoutContextType | null>(null);

export interface PageLayoutProps {
  children?: React.ReactNode;
}

export abstract class PageLayout extends React.Component<PageLayoutProps> {
  static displayName = 'PageLayout';
  private layoutId: string;

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
      <PageLayoutContext.Provider value={{ layoutId: this.layoutId }}>
        {this.renderContent()}
        {this.props.children}
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