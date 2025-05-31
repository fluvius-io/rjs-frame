import React from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { HomePage, AdminPage } from './pages';
import { updatePageState } from '../../../lib/rjs-frame/src/store/pageStore';
import { parseUrlPath } from '../../../lib/rjs-frame/src/utils/urlUtils';
import type { PageState } from '../../../lib/rjs-frame/src/types/PageState';

// Wrapper component to handle route changes and params
const RouteChangeHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    // Parse the full URL using the proper utility function
    const { pageName, pageParams, linkParams } = parseUrlPath(location.pathname);
    
    // Use the first segment as fallback if no pageName is parsed
    const finalPageName = pageName || location.pathname.split('/').filter(Boolean)[0] || 'home';

    // Update page state with route params and search params
    updatePageState((state: PageState) => {
      const newState = {
        ...state,
        name: finalPageName,
        pageParams,
        linkParams
      };
      console.log('[RouteChangeHandler] Page state updated:', {
        path: location.pathname,
        page: finalPageName,
        pageParams,
        linkParams
      });
      return newState;
    });
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