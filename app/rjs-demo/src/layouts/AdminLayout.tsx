import React from 'react';
import { PageLayout, ModuleSlot } from 'rjs-frame';

export class AdminLayout extends PageLayout {
  renderContent() {
    return (
      <div className="admin-layout">
        <ModuleSlot id="header" fallback={<div>Loading admin header...</div>} />
        <div className="admin-content">
          <ModuleSlot id="nav" />
          <ModuleSlot id="main" />
        </div>
      </div>
    );
  }
} 