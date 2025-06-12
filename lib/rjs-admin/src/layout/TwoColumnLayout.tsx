import { cn } from "@/lib/utils";
import type { PageLayoutProps } from "rjs-frame";
import { PageLayout, PageSlot } from "rjs-frame";

export interface TwoColumnLayoutProps extends PageLayoutProps {
  className?: string;
  sidebarWidth?: "sm" | "md" | "lg";
}

export class TwoColumnLayout extends PageLayout {
  renderContent() {
    const { className, sidebarWidth = "md" } = this
      .props as TwoColumnLayoutProps;

    const sidebarWidthClasses = {
      sm: "w-64",
      md: "w-72",
      lg: "w-80",
    };

    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <PageSlot name="header" className="container mx-auto px-4 py-4" />
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)] border-r bg-muted/10",
              sidebarWidthClasses[sidebarWidth]
            )}
          >
            <div className="p-4">
              <PageSlot name="sidebar" />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full p-6">
              <PageSlot name="main" />
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t bg-muted/50">
          <PageSlot name="footer" className="container mx-auto px-4 py-6" />
        </footer>
      </div>
    );
  }
}
