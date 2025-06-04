import React from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { initializeFromBrowserLocation } from 'rjs-frame';
import { appConfig } from './config';
import { AdminPage, HomePage } from './pages';

// Wrapper component to handle route changes and params
const RouteChangeHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    // Parse the full URL including search parameters using browser location
    const pageState = initializeFromBrowserLocation(window.location);
    
    // Only log in debug mode
    if (appConfig.features.debugMode) {
      console.log('[RouteChangeHandler] Page state updated:', pageState);
    }
  }, [location.pathname, location.search]);

  return <>{children}</>;
};

// Create router with future flags
const router = createBrowserRouter([
  {
    path: appConfig.routing.basePath,
    element: (
      <RouteChangeHandler>
        <HomePage />
      </RouteChangeHandler>
    ),
  },
  {
    path: "/home/*",
    element: (
      <RouteChangeHandler>
        <HomePage />
      </RouteChangeHandler>
    ),
  },
  {
    path: "/admin/*",
    element: (
      <RouteChangeHandler>
        <AdminPage />
      </RouteChangeHandler>
    ),
  },
], {
  future: {
    v7_startTransition: true,
  } as any, // Type assertion for v7 future flag
});

const App: React.FC = () => {
  // Log configuration on app startup in debug mode
  React.useEffect(() => {
    if (appConfig.features.debugMode) {
      appConfig.logConfig();
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;