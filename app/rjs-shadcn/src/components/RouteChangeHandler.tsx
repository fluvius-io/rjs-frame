import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageStore } from 'rjs-frame';
import { parseUrlFragments, parseSearchParams } from 'rjs-frame';

export const RouteChangeHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentState = pageStore.get();
    
    // Parse URL fragments from the pathname
    const pathParts = location.pathname.split('/').filter(Boolean);
    const fragmentString = pathParts.slice(1).join('/'); // Remove the first part (e.g., 'dashboard')
    const { params: slotParams, statuses: slotStatus } = parseUrlFragments(fragmentString);
    
    // Parse search parameters
    const linkParams = parseSearchParams(location.search);
    
    // Update page store
    pageStore.set({
      ...currentState,
      name: pathParts[0] || 'dashboard',
      pageParams: {}, // Empty for now, can be used for page-level params
      linkParams,
      slotParams,
      slotStatus,
      time: Date.now().toString()
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}; 