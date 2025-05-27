import React from 'react';
import { useStore } from '@nanostores/react';
import { pageStore } from '../store/pageStore';

export interface ModuleSlotProps {
  id: string;
  fallback?: React.ReactNode;
}

export const ModuleSlot: React.FC<ModuleSlotProps> = ({ id, fallback = null }) => {
  const pageState = useStore(pageStore);
  const moduleData = pageState.priv_state[id];

  if (!moduleData) {
    return <>{fallback}</>;
  }

  return <div data-slot-id={id}>{/* Modules will be rendered here */}</div>;
}; 