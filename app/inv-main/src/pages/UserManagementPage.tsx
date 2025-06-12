import {
  Building,
  Plus,
  Shield,
  UserCheck,
  UserCircle,
  Users,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ResourceDataTable,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule } from "rjs-frame";
import { Header } from "../components";

export default function UserManagementPage() {
  return (
    <ThreeColumnLayout sidebarWidth="lg">
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">User Management</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              All Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <UserCheck className="mr-2 h-4 w-4" />
              Active Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <UserCircle className="mr-2 h-4 w-4" />
              Inactive Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Admin Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Building className="mr-2 h-4 w-4" />
              Organizations
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">User Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Users</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-medium text-green-600">1,104</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium text-orange-600">43</span>
              </div>
              <div className="flex justify-between">
                <span>Admin Users</span>
                <span className="font-medium text-blue-600">12</span>
              </div>
            </div>
          </div>
        </div>
      </PageModule>

      <PageModule slotName="main">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                User Management
              </h2>
              <p className="text-muted-foreground">
                Manage user accounts, permissions, and organization memberships.
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +12 new users this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">1,104</div>
                <p className="text-xs text-muted-foreground">
                  88.5% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approval
                </CardTitle>
                <UserCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">43</div>
                <p className="text-xs text-muted-foreground">
                  Requires admin review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Organizations
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  Active organizations
                </p>
              </CardContent>
            </Card>
          </div>

          <ResourceDataTable
            dataApi="idm:user"
            title="Users"
            subtitle="Manage user accounts and permissions"
            showSearch={true}
            showFilters={true}
            actions={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            }
          />
          <ResourceDataTable
            dataApi="idm:organization"
            title="Organizations"
            subtitle="Manage organizations"
            showSearch={true}
            showFilters={true}
            actions={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            }
          />
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
