import { useEffect } from 'react';
import { GenericLayout } from '../layouts/GenericLayout';
import { AdminHeader } from '../modules/admin/AdminHeader';
import { FilterModule } from '../modules/FilterModule';
import { setPageName } from 'rjs-frame';
import { ArgumentsModule } from '@/modules/ArgumentsModule';

const AdminPage: React.FC = () => {
  useEffect(() => {
    setPageName('admin');
  }, []);

  let modulesMount = {
    header: <AdminHeader key="header" />,
    sidebar: <ArgumentsModule />,
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