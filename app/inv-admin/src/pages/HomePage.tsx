import { BarChart3, Package, Settings, Users } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule } from "rjs-frame";
import logoTransparent from "../assets/img/logo-transparent.png";

export default function HomePage() {
  return (
    <ThreeColumnLayout>
      <PageModule slotName="header">
        <div className="flex items-center justify-between">
          <img
            src={logoTransparent}
            alt="Invest Mate - Trading Management Platform"
            style={{ height: "60px", margin: "-16px 0px" }}
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PageModule>

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Investments
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </nav>
        </div>
      </PageModule>

      <PageModule slotName="main">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to the Invest Mate Admin panel. Manage your investments,
              users, and view reports.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Investments
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,345</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  New investment "Tech Portfolio A" added to platform
                </p>
                <p className="text-sm">
                  User John Doe updated investment allocations
                </p>
                <p className="text-sm">Monthly report generated successfully</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageModule>

      <PageModule slotName="rightPanel">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full">Add Investment</Button>
            <Button variant="outline" className="w-full">
              Generate Report
            </Button>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">System Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Database</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>API</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>Storage</span>
                <span className="text-yellow-600">75% Used</span>
              </div>
            </div>
          </div>
        </div>
      </PageModule>

      <PageModule slotName="footer">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2024 Invest Mate. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
