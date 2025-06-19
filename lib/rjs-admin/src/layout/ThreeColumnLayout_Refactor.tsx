import { cn } from "@/lib/utils";
import type { PageLayoutProps } from "rjs-frame";
import { PageLayout, PageSlot } from "rjs-frame";

export interface ThreeColumnLayoutProps extends PageLayoutProps {
  className?: string;
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
        <PageSlot
          htmlTag="header"
          name="header"
          className="w-full border-b bg-background/95 mx-auto px-4 py-4"
        />

        <div className="content-layout flex flex-1">
          <PageSlot
            name="sidebar-outer"
            htmlTag="aside"
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)] p-4 border-r bg-muted/10",
              widthClasses[sidebarWidth]
            )}
            matchParams={{ sidebar: true }}
          >
            <PageSlot name="sidebar" />
          </PageSlot>

          <PageSlot
            name="main-outer"
            htmlTag="main"
            className="flex-1 overflow-hidden h-full p-6"
          >
            <PageSlot name="main" />
          </PageSlot>

          <PageSlot
            name="right-outer"
            htmlTag="aside"
            className={cn(
              "sticky top-16 h-[calc(100vh-4rem)] border-l bg-muted/10",
              widthClasses[rightPanelWidth]
            )}
          >
            <PageSlot name="rightPanel" />
          </PageSlot>
        </div>

        <PageSlot
          htmlTag="footer"
          name="footer"
          className="container mx-auto px-4 py-6 border-t bg-muted/50"
        />
      </div>
    );
  }
}
