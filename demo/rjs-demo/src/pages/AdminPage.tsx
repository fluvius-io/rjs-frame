import { AdminHeader } from '../modules/admin/AdminHeader';
import { FilterModule } from '../modules/FilterModule';
import { GenericLayout } from '../layouts/GenericLayout';


const AdminPage: React.FC = () => {
  return (
    <GenericLayout title="Administration">
      <AdminHeader slotName="header" />
      <FilterModule>
        <h2>Admin Filter Module</h2>
      </FilterModule>
    </GenericLayout>
  );
};

export default AdminPage; 