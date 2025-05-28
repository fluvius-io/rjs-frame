import React from 'react';
import { AdminHeader } from '../modules/admin/AdminHeader';
import { HomeLayout } from '@/layouts/HomeLayout';

const AdminPage: React.FC = () => {
  let mountPoints = {
    header: [<AdminHeader key="header" slotId="header" />]
  }

  return (
    <HomeLayout modules={mountPoints}>
      <h3>Admin Page</h3>
    </HomeLayout>
  );
};

export default AdminPage; 