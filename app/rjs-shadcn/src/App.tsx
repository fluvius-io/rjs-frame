import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ModuleSlot } from 'rjs-frame';
import { DashboardLayout } from './components/DashboardLayout';
import { RouteChangeHandler } from './components/RouteChangeHandler';
import { SidebarModule } from './modules/SidebarModule';
import { StatsModule } from './modules/StatsModule';
import { ChartModule } from './modules/ChartModule';
import { DataTableModule } from './modules/DataTableModule';

function App() {
  return (
    <Router>
      <RouteChangeHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/*" element={<DashboardLayoutPage />} />
      </Routes>
    </Router>
  );
}

function DashboardLayoutPage() {
  let modulesMount = {
    sidebar: <SidebarModule />,
  }
  return (
    <DashboardLayout modules={modulesMount}>      
      {/* Main Content */}
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="analytics/*" element={<AnalyticsPage />} />
          <Route path="users/*" element={<UsersPage />} />
          <Route path="reports/*" element={<ReportsPage />} />
          <Route path="sales/*" element={<SalesPage />} />
          <Route path="settings/*" element={<SettingsPage />} />
        </Routes>
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
      <ModuleSlot name="stats">
        <StatsModule />
      </ModuleSlot>
      <ModuleSlot name="charts">
        <ChartModule />
      </ModuleSlot>
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
      <ModuleSlot name="analytics-charts">
        <ChartModule />
      </ModuleSlot>
    </div>
  );
}

function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight p-6 pb-0">Users</h1>
        <p className="text-muted-foreground px-6">Manage your users and permissions</p>
      </div>
      <ModuleSlot name="user-table">
        <DataTableModule />
      </ModuleSlot>
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
      <ModuleSlot name="sales-stats">
        <StatsModule />
      </ModuleSlot>
      <ModuleSlot name="sales-charts">
        <ChartModule />
      </ModuleSlot>
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
