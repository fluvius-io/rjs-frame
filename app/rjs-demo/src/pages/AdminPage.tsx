import React from 'react';
import { AdminHeader } from '../modules/admin/AdminHeader';
import { GenericLayout } from '@/layouts/GenericLayout';
import { FilterModule } from '../modules/FilterModule';

const AdminPage: React.FC = () => {
  let modulesMount = {
    header: <AdminHeader key="header" />
  }

  return (<>
    <GenericLayout modules={modulesMount}>
      <h2>Admin Filter Module</h2>
      <FilterModule />
    </GenericLayout>
    </>
  );
};

export default AdminPage; 