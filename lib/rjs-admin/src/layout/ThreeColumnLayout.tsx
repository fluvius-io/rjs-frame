import type { PageLayoutProps } from "rjs-frame";
import { PageLayout, PageSection, PageSlot } from "rjs-frame";
import { cn } from "rjs-frame/src/utils";

export interface ThreeColumnLayoutProps extends PageLayoutProps {
  sidebarWidth?: "sm" | "md" | "lg";
  rightPanelWidth?: "sm" | "md" | "lg";
}

export class ThreeColumnLayout extends PageLayout<ThreeColumnLayoutProps> {
  renderContent() {
    const {
      className,
      sidebarWidth = "md",
      rightPanelWidth = "sm",
    } = this.props as ThreeColumnLayoutProps;

    const widthClasses = {
      sm: "w-64",
      md: "w-80",
      lg: "w-120",
    };

    return (
      <div className={cn("min-h-screen bg-background", className)}>
        <header className="w-full border-b bg-background/95">
          <PageSlot name="header" className="mx-auto px-4 py-4" />
        </header>

        <div className="content-layout flex flex-1 min-h-[calc(100vh-124px)]">
          <PageSection
            tag="aside"
            matchParams={{ sidebar: true }}
            resizable={true}
            className={cn("bg-muted/10", widthClasses[sidebarWidth])}
          >
            <PageSlot className="p-4" name="sidebar" />
          </PageSection>

          <PageSection
            tag="main"
            className="flex-1 border-l border-r overflow-hidden"
          >
            <PageSlot className="h-full p-6" name="main" />
          </PageSection>

          <PageSection
            tag="aside"
            className={cn("bg-muted/10", widthClasses[rightPanelWidth])}
          >
            <PageSlot className="p-4" name="rightPanel" />
          </PageSection>
        </div>

        <footer className="border-t bg-muted/50">
          <PageSlot name="footer" className="container mx-auto p-4" />
        </footer>
      </div>
    );
  }
}
