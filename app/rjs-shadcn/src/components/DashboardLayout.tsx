import { ModuleSlot, PageLayout } from 'rjs-frame';

export class DashboardLayout extends PageLayout {
  renderContent() {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 h-screen bg-card border-r border-border p-4">
          <ModuleSlot name="sidebar"></ModuleSlot>
        </div>
        <div className="flex-1 overflow-auto">
          <ModuleSlot />
        </div>
      </div>
    );
  }
} 