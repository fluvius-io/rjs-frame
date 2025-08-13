import React, { useState } from "react";
import { PageSection } from "../src/components/PageSection";

export const ResizablePageSectionExample: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [mainContentWidth, setMainContentWidth] = useState(600);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Resizable Sidebar */}
      <PageSection
        resizable={true}
        minWidth={200}
        maxWidth={500}
        defaultWidth={sidebarWidth}
        resizeDirection="right"
        onResize={setSidebarWidth}
        className="bg-gray-100 p-4"
      >
        <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
        <p className="text-sm text-gray-600 mb-2">
          Current width: {sidebarWidth}px
        </p>
        <nav className="space-y-2">
          <div className="p-2 bg-white rounded cursor-pointer hover:bg-gray-50">
            Menu Item 1
          </div>
          <div className="p-2 bg-white rounded cursor-pointer hover:bg-gray-50">
            Menu Item 2
          </div>
          <div className="p-2 bg-white rounded cursor-pointer hover:bg-gray-50">
            Menu Item 3
          </div>
        </nav>
      </PageSection>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex" }}>
        <PageSection
          resizable={true}
          minWidth={400}
          maxWidth={800}
          defaultWidth={mainContentWidth}
          resizeDirection="right"
          onResize={setMainContentWidth}
          className="bg-white p-6"
        >
          <h1 className="text-2xl font-bold mb-4">Main Content</h1>
          <p className="text-sm text-gray-600 mb-2">
            Current width: {mainContentWidth}px
          </p>
          <p className="text-gray-700">
            This is the main content area. You can resize both the sidebar and
            this content area by dragging the resize handles on the right edges
            of each section.
          </p>
        </PageSection>

        {/* Right Panel */}
        <PageSection
          resizable={true}
          minWidth={200}
          maxWidth={400}
          defaultWidth={250}
          resizeDirection="left"
          className="bg-gray-50 p-4"
        >
          <h2 className="text-lg font-semibold mb-4">Right Panel</h2>
          <p className="text-sm text-gray-600">
            This panel can be resized from the left edge.
          </p>
        </PageSection>
      </div>
    </div>
  );
};
