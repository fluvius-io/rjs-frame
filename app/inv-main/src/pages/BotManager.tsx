import { Package2, Plus, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { Button, DataTable, ThreeColumnLayout } from "rjs-admin";
import { PageModule } from "rjs-frame";
import { Header } from "../components";

export default function BotManager() {
  return (
    <ThreeColumnLayout sidebarWidth="lg">
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Bot Types</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Package2 className="mr-2 h-4 w-4" />
              All Bots
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Stocks
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Package2 className="mr-2 h-4 w-4" />
              Bonds
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Package2 className="mr-2 h-4 w-4" />
              ETFs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Package2 className="mr-2 h-4 w-4" />
              Crypto
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Investments</span>
                <span className="font-medium">2,847</span>
              </div>
              <div className="flex justify-between">
                <span>Low Performance</span>
                <span className="font-medium text-orange-600">23</span>
              </div>
              <div className="flex justify-between">
                <span>High Risk</span>
                <span className="font-medium text-red-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </PageModule>

      <PageModule slotName="main">
        <DataTable
          dataSource="idm:organization"
          actions={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          }
        />
      </PageModule>

      <PageModule slotName="rightPanel">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              <Package2 className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
            <Button variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search Portfolio
            </Button>
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Portfolio Health</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Performing Well</span>
                <span className="text-green-600">2,819</span>
              </div>
              <div className="flex justify-between">
                <span>Underperforming</span>
                <span className="text-orange-600">23</span>
              </div>
              <div className="flex justify-between">
                <span>High Risk</span>
                <span className="text-red-600">5</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Recent Activity</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• AAPL position increased</p>
              <p>• Portfolio rebalanced</p>
              <p>• Performance alert for TSLA</p>
              <p>• Asset class "Crypto" updated</p>
            </div>
          </div>
        </div>
      </PageModule>

      <PageModule slotName="footer">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2025 Invest Mate (invest-mate.net). All rights reserved.</p>
          <p>Last updated: 2 minutes ago</p>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
