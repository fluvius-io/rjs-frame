import { PageSlot, PageLayout } from 'rjs-frame';

export class DashboardLayout extends PageLayout {
  renderContent() {
    return (
      <div className="flex h-screen bg-background">
        <PageSlot name="sidebar" className="w-64 h-screen bg-card border-r border-border p-4" />
        <PageSlot name="main" className="flex-1 overflow-auto" />
        <PageSlot name="arguments-sidebar" className="w-80 h-screen bg-card border-l border-border p-4 overflow-y-auto" />
      </div>
    );
  }
} 