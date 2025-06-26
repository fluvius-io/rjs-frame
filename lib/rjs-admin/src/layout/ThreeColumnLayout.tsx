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
        <header className="w-full border-b bg-background-90 invert relative z-50">
          <PageSlot name="header" className="mx-auto px-4 py-2" />
        </header>

        <div className="rjs-layout-body flex flex-1]">
          <PageSection
            tag="aside"
            condition={{ sidebar: true }}
            resizable="right"
            className={cn("bg-muted/10", widthClasses[sidebarWidth])}
          >
            <PageSlot name="sidebar" className="p-4" />
          </PageSection>

          <PageSection
            tag="main"
            className="flex-1 border-l border-r overflow-hidden"
          >
            <PageSlot className="h-full p-4" name="main" />
          </PageSection>

          <PageSection
            tag="aside"
            resizable="left"
            defaultWidth={640}
            className={cn("bg-muted/10", widthClasses[rightPanelWidth])}
          >
            <PageSlot name="rightPanel" className="p-4" />
          </PageSection>
        </div>

        <footer className="bg-background-90 invert">
          <PageSlot name="footer" className="container mx-auto" />
        </footer>
      </div>
    );
  }
}
