import React, { ReactNode, useEffect, useContext, createContext, useState, useRef } from 'react';
import { PageLayoutContext } from '../contexts/LayoutContexts';
import { PageSlotContext, type PageSlotContextType } from '../contexts/LayoutContexts';
import { pageStore } from '../store/pageStore';
import '../styles/index.css';
import type { PageState } from '../types/PageState';
import { PageParams } from '../types/PageState';
import { getXRayEnabled } from '../store/pageStore';
import { PageModule } from './PageModule';

export interface PageSlotProps {
  name?: string;
  renderEmpty?: boolean;
  allowToggle?: boolean;
  visible?: 'show' | 'hide'| 'always';
  defaultParamValue?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageSlot = (props: PageSlotProps) => {
  const [pageState, setPageState] = useState<PageState>(pageStore.get());
  const mountedRef = useRef(false);
  const context = useContext(PageLayoutContext);

  useEffect(() => {
    mountedRef.current = true;

    if (!context) {
      console.error('PageSlot must be rendered within a PageLayout');
      return;
    }

    // Subscribe to store changes
    const unsubscribe = pageStore.subscribe((value: PageState) => {
      if (shouldUpdate(value)) {
        setPageState(value);
      }
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [context]);

  const shouldUpdate = (newState: PageState): boolean => {
    if (!mountedRef.current) {
      return false;
    }

    return (
      JSON.stringify(pageState.pageParams) !== JSON.stringify(newState.pageParams) ||
      pageState.pageName !== newState.pageName
    );
  };

  const slotName = props.name || 'main';
  const pageParams = pageState.pageParams || {};

  const slotVisible = () => {
    let defaultVisibility = props.visible || 'always';

    if (defaultVisibility === 'show') {
      return pageParams[slotName] !== false;
    }

    if (defaultVisibility === 'hide') {
      return Boolean(pageParams[slotName]);
    }

    return true;
  };

  if (!context) {
    return (
      <div className="page-slot page-slot--error">
        ERROR: PageSlot must be rendered within a PageLayout
      </div>
    );
  }

  if (!slotVisible()) {
    return null;
  }

  const { renderEmpty = false } = props;

  let slotContent = context.pageModules[slotName];
  let hasSlotContent = !!slotContent && slotContent.length > 0;
  let renderingContent = hasSlotContent ? slotContent : [props.children];
         
  if (!renderEmpty && !renderingContent) {
    return null;
  }

  let slotContext: PageSlotContextType = { args: pageParams, name: slotName };

  const pageSlotClassName = props.className 
    ? `page-slot ${props.className}` 
    : 'page-slot';

  return (
    <PageSlotContext.Provider value={slotContext}>
      <div 
        className={pageSlotClassName} 
        data-slot-name={slotName}
        data-slot-visibility={props.visible || 'always'}
      >
        {renderingContent}
      </div>
    </PageSlotContext.Provider>
  );
} 