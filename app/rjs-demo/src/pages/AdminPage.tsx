import { AdminHeader } from '../modules/admin/AdminHeader';
import { ArgumentsModule } from '@/modules/ArgumentsModule';
import { FilterModule } from '../modules/FilterModule';
import { GenericLayout } from '../layouts/GenericLayout';
import { setPageName } from 'rjs-frame';
import { useEffect } from 'react';


const AdminPage: React.FC = () => {
  useEffect(() => {
    setPageName('admin');
  }, []);

  let modulesMount = {
    header: <AdminHeader />,
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