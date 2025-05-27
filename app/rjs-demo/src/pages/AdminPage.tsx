import React from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminHeader } from '../modules/admin/AdminHeader';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminHeader slotId="header" />
    </AdminLayout>
  );
};

export default AdminPage; 