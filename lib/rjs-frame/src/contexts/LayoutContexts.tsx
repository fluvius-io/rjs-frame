import React, { createContext, useContext } from 'react';
import type { PageParams } from '../types/PageState';

/**
 * Global Layout Context - provides access to registered page modules and breadcrumbs
 */
export interface PageLayoutContextType {
  layoutId: string;
  pageModules: { [slotName: string]: React.ReactNode[] };
  xRay: boolean;
  addPageModule: (slotName: string, content: React.ReactNode) => void;
  removePageModule: (slotName: string, content: React.ReactNode) => void;
}

export interface PageSlotContextType {
  args?: PageParams;
  name: string;
}

export const PageLayoutContext = createContext<PageLayoutContextType | null>(null);

export const PageSlotContext = createContext<PageSlotContextType | null>(null);

/**
 * Hook to access PageLayout context including breadcrumb functionality
 */
export const usePageLayout = () => {
  const context = useContext(PageLayoutContext);
  if (!context) {
    throw new Error('usePageLayout must be used within a PageLayout component');
  }
  return context;
}; 