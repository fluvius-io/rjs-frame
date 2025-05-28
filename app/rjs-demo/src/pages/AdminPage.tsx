import React from 'react';
import { AdminHeader } from '../modules/admin/AdminHeader';
import { GenericLayout } from '@/layouts/GenericLayout';

const AdminPage: React.FC = () => {
  let modulesMount = {
    header: <AdminHeader key="header" slotId="header" />
  }

  return (
    <GenericLayout modules={modulesMount} />
  );
};

export default AdminPage; 