import React from 'react';
import type { SlotParams } from '../types/PageState';

export interface PageLayoutContextType {
  layoutId?: string;
  pageModules: Record<string, React.ReactNode[]>;
  xRay?: boolean;
}

export const PageLayoutContext = React.createContext<PageLayoutContextType>({pageModules: {}});

export interface PageSlotContextType {
  args?: SlotParams;
  name: string;
}

export const PageSlotContext = React.createContext<PageSlotContextType>({name: 'main'}); 