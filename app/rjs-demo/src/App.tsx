import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage, AdminPage } from './pages';
import { updatePageState } from 'rjs-frame';
import { parseUrlFragments, parseSearchParams } from '../../../lib/rjs-frame/src/utils/urlUtils';
import type { SlotParams, SlotStatus } from 'rjs-frame';

// Wrapper component to handle route changes and params
const RouteChangeHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    // Extract the page name and arguments from the path
    const fragments = location.pathname.split('/').filter(Boolean);
    const pageName = fragments[0] || 'home';
    
    // Get arguments from the remaining fragments
    const argFragments = fragments.slice(1).join('/');
    const { params: slotParams, statuses: slotStatus } = parseUrlFragments(argFragments);

    // Update page state with route params and search params
    updatePageState(state => {
      const newState = {
        ...state,
        name: pageName,
        slotParams,
        slotStatus,
        linkParams: parseSearchParams(location.search),
        pageParams: {}
      };
      console.log('[RouteChangeHandler] Page state updated:', {
        path: location.pathname,
        page: pageName,
        slotParams, 
        slotStatus,
        linkParams: parseSearchParams(location.search)
      });
      return newState;
    });
  }, [location.pathname, location.search]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <RouteChangeHandler>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home/*" element={<HomePage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </RouteChangeHandler>
    </Router>
  );
};

export default App;