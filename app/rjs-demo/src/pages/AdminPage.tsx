import React from 'react';
import { AdminHeader } from '../modules/admin/AdminHeader';
import { HomeLayout } from '@/layouts/GenericLayout';

const AdminPage: React.FC = () => {
  let modulesMount = {
    header: <AdminHeader key="header" slotId="header" />
  }

  return (
    <HomeLayout modules={modulesMount}>
      <h3>Admin Page</h3>
    </HomeLayout>
  );
};

export default AdminPage; 