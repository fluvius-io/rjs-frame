import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { HomePage, AdminPage } from './pages';
import { updatePageState } from 'rjs-frame/src/store/pageStore';
import type { PageArgument } from 'rjs-frame/src/types/PageState';

// Parse URL fragments into args array
const parseFragments = (fragments: string): PageArgument[] => {
  if (!fragments) return [];
  const args = fragments.split('/').filter(Boolean).map(fragment => {
    const [name, value] = fragment.split(':');
    return [name || '', value || ''] as PageArgument;
  });
  return args;
};

// Parse search params into link_state
const parseSearchParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// Wrapper component to handle route changes and params
const RouteChangeHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    // Extract the page name and arguments from the path
    const fragments = location.pathname.split('/').filter(Boolean);
    const pageName = fragments[0] || 'home';
    
    // Get arguments from the remaining fragments
    const argFragments = fragments.slice(1).join('/');
    const args = parseFragments(argFragments);

    // Update page state with route params and search params
    updatePageState(state => {
      const newState = {
        ...state,
        name: pageName,
        args,
        link_state: parseSearchParams(location.search)
      };
      console.log('[RouteChangeHandler] Page state updated:', {
        path: location.pathname,
        page: pageName,
        args,
        linkState: parseSearchParams(location.search)
      });
      return newState;
    });
  }, [location.pathname]);

  return <>{children}</>;
};

// Page wrapper to ensure proper route handling
const PageWrapper: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const params = useParams();
  console.log('PageWrapper params:', params);
  return element;
};

const App: React.FC = () => {
  return (
    <Router>
      <RouteChangeHandler>
        <Routes>
          <Route path="/" element={<PageWrapper element={<HomePage />} />} />
          <Route path="/home/*" element={<PageWrapper element={<HomePage />} />} />
          <Route path="/admin/*" element={<PageWrapper element={<AdminPage />} />} />
        </Routes>
      </RouteChangeHandler>
    </Router>
  );
};

export default App;