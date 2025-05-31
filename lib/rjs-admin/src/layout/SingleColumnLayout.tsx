import React from 'react';
import { PageLayout, PageSlot as RjsPageSlot } from 'rjs-frame';
import { cn } from '@/lib/utils';

const PageSlot = RjsPageSlot as any;

export interface SingleColumnLayoutProps {
  className?: string;
  children?: React.ReactNode;
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