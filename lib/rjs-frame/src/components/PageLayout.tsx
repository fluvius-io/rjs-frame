import React from 'react';
import { useStore } from '@nanostores/react';
import { pageStore } from '../store/pageStore';

export interface PageLayoutContextType {
  layoutId: string;
  pageModules: Record<string, React.ReactNode[]>;
}

export const PageLayoutContext = React.createContext<PageLayoutContextType | null>(null);

type ModuleValue = React.ReactNode | React.ReactNode[];

export interface PageLayoutProps {
  children?: React.ReactNode;
  modules?: Record<string, ModuleValue>;
}

const RESERVED_MODULE_KEYS = ['main'] as const;

export abstract class PageLayout extends React.Component<PageLayoutProps> {
  static displayName = 'PageLayout';
  private layoutId: string;

  private normalizeModules(modules: Record<string, ModuleValue> = {}): Record<string, React.ReactNode[]> {
    let pageModules = Object.entries(modules).reduce((acc, [key, value]) => {
      if(key === 'main') {
        throw new Error("'main' is a reserved module key for layout children. Please use a different key.");
      }

      acc[key] = Array.isArray(value) ? value : [value];
      return acc;
    }, {} as Record<string, React.ReactNode[]>);

    if (this.props.children) {
      pageModules.main = [this.props.children];
    }

    return pageModules;
  }

  protected get modules() {
    return this.normalizeModules(this.props.modules);
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
      <PageLayoutContext.Provider value={{ layoutId: this.layoutId, pageModules: this.modules}}>
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