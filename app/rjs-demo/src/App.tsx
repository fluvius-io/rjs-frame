import React from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { HomePage, AdminPage } from './pages';
import { initializeFromBrowserLocation } from 'rjs-frame';

// Wrapper component to handle route changes and params
const RouteChangeHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    // Parse the full URL including search parameters using browser location
    const pageState = initializeFromBrowserLocation(window.location);
    console.log('[RouteChangeHandler] Page state updated:', pageState);
  }, [location.pathname, location.search]);

  return <>{children}</>;
};

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/",
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
  return <RouterProvider router={router} />;
};

export default App;