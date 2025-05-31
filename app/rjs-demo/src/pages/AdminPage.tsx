import { AdminHeader } from '../modules/admin/AdminHeader';
import { FilterModule } from '../modules/FilterModule';
import { GenericLayout } from '../layouts/GenericLayout';
import { setPageName } from 'rjs-frame';
import { useEffect } from 'react';


const AdminPage: React.FC = () => {
  useEffect(() => {
    setPageName('admin');
  }, []);

  return (
    <GenericLayout>
      <AdminHeader slotName="header" />
      <FilterModule>
        <h2>Admin Filter Module</h2>
      </FilterModule>
    </GenericLayout>
  );
};

export default AdminPage; 