import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageStore, parseUrlPath, type ParsedUrl } from 'rjs-frame';

export const RouteChangeHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentState = pageStore.get();
    
    // Parse the full URL using the proper utility function
    const { pagePath, pageParams, linkParams } = parseUrlPath(location.pathname);
    
    // Parse search parameters separately to ensure they're captured
    const searchParams = new URLSearchParams(location.search);
    const parsedLinkParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      parsedLinkParams[key] = value;
    });
    
    // Derive logical page name from the first segment of the path
    const finalPageName = pagePath.split('/')[0] || location.pathname.split('/').filter(Boolean)[0] || 'dashboard';
    
    // Update page store
    pageStore.set({
      ...currentState,
      name: finalPageName,
      pageParams,
      linkParams: parsedLinkParams, // Use the parsed search params
      time: Date.now().toString()
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}; 