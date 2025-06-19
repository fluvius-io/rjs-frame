import { cn } from "@/lib/utils";
import type { PageLayoutProps } from "rjs-frame";
import { PageLayout, PageSection, PageSlot } from "rjs-frame";

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
      md: "w-72",
      lg: "w-80",
    };

    return (
      <div className={cn("min-h-screen bg-background", className)}>
        <header className="w-full border-b bg-background/95">
          <PageSlot name="header" className="mx-auto px-4 py-4" />
        </header>

        <div className="content-layout flex flex-1">
          <PageSection
            tag="aside"
            matchParams={{ sidebar: true }}
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)] border-r bg-muted/10",
              widthClasses[sidebarWidth]
            )}
          >
            <div className="p-4">
              <PageSlot name="sidebar" />
            </div>
          </PageSection>

          <PageSection tag="main" className="flex-1 overflow-hidden">
            <div className="h-full p-6">
              <PageSlot name="main" />
            </div>
          </PageSection>

          <PageSection
            tag="aside"
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)] border-l bg-muted/10",
              widthClasses[rightPanelWidth]
            )}
          >
            <div className="p-4">
              <PageSlot name="rightPanel" />
            </div>
          </PageSection>
        </div>

        <footer className="border-t bg-muted/50">
          <PageSlot name="footer" className="container mx-auto px-4 py-6" />
        </footer>
      </div>
    );
  }
}
