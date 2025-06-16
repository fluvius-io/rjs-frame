import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../../src/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../src/components/common/Card";

// Simple demo components for Storybook (not PageModules)
const DemoHeader = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        Settings
      </Button>
      <Button size="sm">Profile</Button>
    </div>
  </div>
);

const DemoSidebar = () => (
  <nav className="space-y-2">
    <div className="font-semibold text-lg mb-4">Navigation</div>
    <div className="space-y-1">
      <Button variant="ghost" className="w-full justify-start">
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        Users
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        Settings
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        Analytics
      </Button>
    </div>
  </nav>
);

const DemoMainContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold mb-4">Main Content Area</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Active users this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Total revenue this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>New orders today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const DemoRightPanel = () => (
  <div className="space-y-4">
    <div className="font-semibold">Activity Feed</div>
    <div className="space-y-3">
      <div className="text-sm">
        <div className="font-medium">User John signed up</div>
        <div className="text-muted-foreground">2 minutes ago</div>
      </div>
      <div className="text-sm">
        <div className="font-medium">New order #1234</div>
        <div className="text-muted-foreground">5 minutes ago</div>
      </div>
      <div className="text-sm">
        <div className="font-medium">System update completed</div>
        <div className="text-muted-foreground">1 hour ago</div>
      </div>
    </div>
  </div>
);

const DemoFooter = () => (
  <div className="text-center text-sm text-muted-foreground">
    © 2024 Admin Dashboard. All rights reserved.
  </div>
);

// Create wrapper components that work with our layout pattern
const SingleColumnLayoutDemo = () => {
  // Create a mock layout that renders the structure manually
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <DemoHeader />
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <DemoMainContent />
        </div>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <DemoFooter />
        </div>
      </footer>
    </div>
  );
};

const TwoColumnLayoutDemo = ({
  sidebarWidth = "md",
}: {
  sidebarWidth?: "sm" | "md" | "lg";
}) => {
  const sidebarWidthClasses = {
    sm: "w-64",
    md: "w-72",
    lg: "w-80",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <DemoHeader />
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`sticky top-16 h-[calc(100vh-4rem)] border-r bg-muted/10 ${sidebarWidthClasses[sidebarWidth]}`}
        >
          <div className="p-4">
            <DemoSidebar />
          </div>
        </aside>
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <DemoMainContent />
          </div>
        </main>
      </div>
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <DemoFooter />
        </div>
      </footer>
    </div>
  );
};

const ThreeColumnLayoutDemo = ({
  sidebarWidth = "md",
  rightPanelWidth = "sm",
}: {
  sidebarWidth?: "sm" | "md" | "lg";
  rightPanelWidth?: "sm" | "md" | "lg";
}) => {
  const widthClasses = {
    sm: "w-64",
    md: "w-72",
    lg: "w-80",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <DemoHeader />
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`sticky top-16 h-[calc(100vh-4rem)] border-r bg-muted/10 ${widthClasses[sidebarWidth]}`}
        >
          <div className="p-4">
            <DemoSidebar />
          </div>
        </aside>
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <DemoMainContent />
          </div>
        </main>
        <aside
          className={`sticky top-16 h-[calc(100vh-4rem)] border-l bg-muted/10 ${widthClasses[rightPanelWidth]}`}
        >
          <div className="p-4">
            <DemoRightPanel />
          </div>
        </aside>
      </div>
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <DemoFooter />
        </div>
      </footer>
    </div>
  );
};

const meta: Meta = {
  title: "Layouts/Overview",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleColumn: Story = {
  render: () => <SingleColumnLayoutDemo />,
};

export const TwoColumnSmallSidebar: Story = {
  render: () => <TwoColumnLayoutDemo sidebarWidth="sm" />,
};

export const TwoColumnMediumSidebar: Story = {
  render: () => <TwoColumnLayoutDemo sidebarWidth="md" />,
};

export const TwoColumnLargeSidebar: Story = {
  render: () => <TwoColumnLayoutDemo sidebarWidth="lg" />,
};

export const ThreeColumnDefault: Story = {
  render: () => <ThreeColumnLayoutDemo />,
};

export const ThreeColumnCustomWidths: Story = {
  render: () => (
    <ThreeColumnLayoutDemo sidebarWidth="lg" rightPanelWidth="md" />
  ),
};
