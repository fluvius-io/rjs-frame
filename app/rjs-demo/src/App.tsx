import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeLayout } from './layouts/HomeLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomeHeader } from './modules/home/HomeHeader';
import { AdminHeader } from './modules/admin/AdminHeader';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomeLayout />
              <HomeHeader />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <AdminLayout />
              <AdminHeader />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; 