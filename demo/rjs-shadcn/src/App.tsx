import { RoutingModule, RjsApp, Route, Navigate } from 'rjs-frame';
import { DashboardLayout } from './components/DashboardLayout';
import { SidebarModule } from './modules/SidebarModule';
import { StatsComponent } from './modules/StatsModule';
import { ChartComponent } from './modules/ChartModule';
import { PaginatedUsersComponent } from './modules/PaginatedUsersModule';

// Wrapper to make the main content a PageModule


function App() {
  return (
    <RjsApp>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/*" element={<DashboardLayoutPage />} />
    </RjsApp>
  );
}

function DashboardLayoutPage() {
  return (
    <DashboardLayout>
      <SidebarModule slotName="sidebar" />
      <RoutingModule>
        <Route index element={<DashboardHome />} />
        <Route path="/-/*" element={<DashboardHome />} />
        <Route path="analytics/*" element={<AnalyticsPage />} />
        <Route path="users/*" element={<UsersPage />} />
        <Route path="reports/*" element={<ReportsPage />} />
        <Route path="sales/*" element={<SalesPage />} />
        <Route path="settings/*" element={<SettingsPage />} />
      </RoutingModule>
    </DashboardLayout>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight p-6 pb-0">Dashboard</h1>
        <p className="text-muted-foreground px-6">Welcome to your dashboard overview</p>
      </div>
        <StatsComponent />
        <ChartComponent />
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight p-6 pb-0">Analytics</h1>
        <p className="text-muted-foreground px-6">Detailed analytics and insights</p>
      </div>
        <ChartComponent />
    </div>
  );
}

function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <PaginatedUsersComponent />
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight p-6 pb-0">Reports</h1>
        <p className="text-muted-foreground px-6">Generate and view reports</p>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">Reports coming soon</h3>
          <p className="text-sm text-muted-foreground mt-2">This feature is under development</p>
        </div>
      </div>
    </div>
  );
}

function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight p-6 pb-0">Sales</h1>
        <p className="text-muted-foreground px-6">Track your sales performance</p>
      </div>
      <StatsComponent />
      <ChartComponent />
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight p-6 pb-0">Settings</h1>
        <p className="text-muted-foreground px-6">Configure your application settings</p>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">Settings coming soon</h3>
          <p className="text-sm text-muted-foreground mt-2">This feature is under development</p>
        </div>
      </div>
    </div>
  );
}

export default App;
