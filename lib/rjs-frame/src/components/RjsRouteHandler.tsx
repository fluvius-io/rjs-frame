import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeFromBrowserLocation } from '../store/pageStore';

export function RjsRouteHandler() {
  const location = useLocation();

  useEffect(() => {
    // Initialize page state from current URL whenever route changes
    initializeFromBrowserLocation(window.location);
    console.log('[RouteChangeHandler] URL updated:', window.location.pathname);
  }, [location.pathname, location.search, location.hash]);

  return null; // This component doesn't render anything
} 