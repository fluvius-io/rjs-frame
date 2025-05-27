import { PageLayout, ModuleSlot } from 'rjs-frame';

export class HomeLayout extends PageLayout {
  renderContent() {
    return (
      <div className="home-layout">
        <h1>HomeLayout</h1>
        <ModuleSlot id="header" fallback={<div>Loading header...</div>} />
        <div className="content">
          <ModuleSlot id="sidebar" />
          <ModuleSlot id="main" />
        </div>
        <ModuleSlot id="footer" />
      </div>
    );
  }
} 