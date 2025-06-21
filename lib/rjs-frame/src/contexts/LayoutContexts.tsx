import React, { createContext, useContext } from "react";
import { HashParams, LinkParams, PageParams } from "../types/AppState";

/**
 * Global Layout Context - provides access to registered page modules and breadcrumbs
 */
export interface PageLayoutContextType {
  layoutId: string;
  pageModules: { [slotName: string]: React.ReactNode[] };
  pageParams: PageParams;
  linkParams: LinkParams;
  hashParams: HashParams;
  slotClasses: Record<string, string>;
  addPageModule: (slotName: string, content: React.ReactNode) => void;
  removePageModule: (slotName: string, content: React.ReactNode) => void;
}

export interface PageSlotContextType {
  name: string;
}

export const PageLayoutContext = createContext<PageLayoutContextType | null>(
  null
);

export const PageSlotContext = createContext<PageSlotContextType | null>(null);

/**
 * Hook to access PageLayout context including breadcrumb functionality
 */
export const usePageContext = () => {
  const context = useContext(PageLayoutContext);
  if (!context) {
    throw new Error("usePageLayout must be used within a PageLayout component");
  }
  return context;
};
