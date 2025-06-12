import { cn } from "@/lib/utils";
import type { PageLayoutProps } from "rjs-frame";
import { PageLayout, PageSlot } from "rjs-frame";

export interface SingleColumnLayoutProps extends PageLayoutProps {
  className?: string;
}

export class SingleColumnLayout extends PageLayout {
  renderContent() {
    const { className } = this.props as SingleColumnLayoutProps;

    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <PageSlot name="header" className="container mx-auto px-4 py-4" />
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            <PageSlot name="main" />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/50">
          <PageSlot name="footer" className="container mx-auto px-4 py-6" />
        </footer>
      </div>
    );
  }
}
