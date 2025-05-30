import React from 'react';
import { PageLayout, PageSlot } from 'rjs-frame';

export class GenericLayout extends PageLayout {
  renderContent() {
    return (
      <>
        <h1>Generic Layout</h1>
        <PageSlot name="header" className="header-slot">          
          <div>Loading header...</div>
        </PageSlot>
        <div className="content">
          <PageSlot name="sidebar" allowToggle={true} className="sidebar-slot">
            <div>Sidebar is Empty</div>
          </PageSlot>
          <PageSlot className="main-content-slot" />
        </div>
        <PageSlot name="footer" allowToggle={true} className="footer-slot" />
      </>
    );
  }
} 