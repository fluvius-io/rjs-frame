import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageStore } from 'rjs-frame';
import { parseUrlPath } from 'rjs-frame';

export const RouteChangeHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentState = pageStore.get();
    
    // Parse the full URL using the proper utility function
    const { pageName, pageParams, linkParams } = parseUrlPath(location.pathname);
    
    // Use the first segment as fallback if no pageName is parsed
    const finalPageName = pageName || location.pathname.split('/').filter(Boolean)[0] || 'dashboard';
    
    // Update page store
    pageStore.set({
      ...currentState,
      name: finalPageName,
      pageParams,
      linkParams,
      time: Date.now().toString()
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}; 