import React from 'react';

export interface PageLayoutContextType {
  layoutId?: string;
  pageModules: Record<string, React.ReactNode[]>;
  xRay?: boolean;
}

export const PageLayoutContext = React.createContext<PageLayoutContextType>({pageModules: {}});

export interface PageSlotContextType {
  args?: string;
  name: string;
}

export const PageSlotContext = React.createContext<PageSlotContextType>({name: 'main'}); 