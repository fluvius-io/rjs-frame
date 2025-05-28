import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage, AdminPage } from './pages';
import { setPageName } from 'rjs-frame/src/store/pageStore';

// Wrapper component to handle route changes
const RouteChangeHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    // Extract the page name from the path (first segment)
    const pageName = location.pathname.split('/')[1] || 'home';
    setPageName(pageName);
  }, [location]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <RouteChangeHandler>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </RouteChangeHandler>
    </Router>
  );
};

export default App;