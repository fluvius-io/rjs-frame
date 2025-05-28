import React, { useEffect } from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { AdminHeader } from '../modules/admin/AdminHeader';
import { FilterModule } from '../modules/FilterModule';
import { setPageName } from 'rjs-frame/src/store/pageStore';

const AdminPage: React.FC = () => {
  useEffect(() => {
    setPageName('admin');
  }, []);

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