import { cn } from "@/lib/utils";
import type { PageLayoutProps } from "rjs-frame";
import { PageLayout, PageSlot } from "rjs-frame";

export interface ThreeColumnLayoutProps extends PageLayoutProps {
  className?: string;
  sidebarWidth?: "sm" | "md" | "lg";
  rightPanelWidth?: "sm" | "md" | "lg";
}

export class ThreeColumnLayout extends PageLayout {
  renderContent() {
    const {
      className,
      sidebarWidth = "md",
      rightPanelWidth = "sm",
    } = this.props as ThreeColumnLayoutProps;

    const widthClasses = {
      sm: "w-64",
      md: "w-72",
      lg: "w-80",
    };

    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {/* Header */}
        <header className="w-full border-b bg-background/95">
          <PageSlot name="header" className="mx-auto px-4 py-4" />
        </header>

        <div className="flex flex-1">
          {/* Left Sidebar */}
          <PageSlot name="sidebar-outer" matchParams={{ sidebar: true }}>
            <aside
              className={cn(
                "sticky top-16 h-[calc(100vh-4rem)] border-r bg-muted/10",
                widthClasses[sidebarWidth]
              )}
            >
              <div className="p-4">
                <PageSlot name="sidebar" />
              </div>
            </aside>
          </PageSlot>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full p-6">
              <PageSlot name="main" />
            </div>
          </main>

          {/* Right Panel */}
          <aside
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)] border-l bg-muted/10",
              widthClasses[rightPanelWidth]
            )}
          >
            <div className="p-4">
              <PageSlot name="rightPanel" />
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="border-t bg-muted/50">
          <PageSlot name="footer" className="container mx-auto px-4 py-6" />
        </footer>
      </div>
    );
  }
}
