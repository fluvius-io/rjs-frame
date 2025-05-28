import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage, AdminPage } from './pages';
import { updatePageState } from 'rjs-frame';
import type { SlotParams, SlotStatus } from 'rjs-frame';

// Parse URL fragments into slotParams object
const parseFragments = (fragments: string): { params: SlotParams; statuses: SlotStatus } => {
  if (!fragments) return { params: {}, statuses: {} };
  const params: SlotParams = {};
  const statuses: SlotStatus = {};
  fragments.split('/').filter(Boolean).forEach(fragment => {
    // Split by either ':' or '!'
    const splitIndex = fragment.includes(':') ? fragment.indexOf(':') : fragment.indexOf('!');
    if (splitIndex === -1) return;
    
    const name = fragment.slice(0, splitIndex); // slot name    
    const value = fragment.slice(splitIndex + 1); // slot status
    if (name) params[name] = value || '';
    if (name) statuses[name] = value == '-' ? 'hidden' : 'active'; // slot status
  });
  return { params, statuses };
};

// Parse search params into linkParams
const parseSearchParams = (search: string): Record<string, string> => {
  const params: Record<string, string> = {};
  new URLSearchParams(search).forEach((value, key) => {
    params[key] = value;
  });
  return params;
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
    const { params: slotParams, statuses: slotStatus } = parseFragments(argFragments);

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