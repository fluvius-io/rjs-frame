import {
  Bell,
  Filter,
  Package2,
  Search,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  AuthUserAvatar,
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
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>

            <AuthUserAvatar />
          </div>
        </div>
      </PageModule>

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Investment Types</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Package2 className="mr-2 h-4 w-4" />
              All Investments
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Investment Overview
              </h2>
              <p className="text-muted-foreground">
                Monitor and manage your investment portfolio, performance, and
                asset allocation.
              </p>
            </div>
            <Button>
              <Package2 className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Investments
                </CardTitle>
                <Package2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +180 new investments this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance Alerts
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Asset Classes
                </CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Active asset classes
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Apple Inc. (AAPL)</p>
                      <p className="text-xs text-muted-foreground">
                        Stocks • Shares: 100
                      </p>
                    </div>
                    <span className="text-sm font-medium">$15,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">S&P 500 ETF</p>
                      <p className="text-xs text-muted-foreground">
                        ETFs • Shares: 50
                      </p>
                    </div>
                    <span className="text-sm font-medium">$25,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">US Treasury Bond</p>
                      <p className="text-xs text-muted-foreground">
                        Bonds • 10-Year
                      </p>
                    </div>
                    <span className="text-sm font-medium">$10,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Tesla Inc. (TSLA)</p>
                      <p className="text-xs text-muted-foreground">
                        Stocks • High Volatility
                      </p>
                    </div>
                    <span className="text-sm font-medium text-orange-600">
                      -5.2%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Bitcoin (BTC)</p>
                      <p className="text-xs text-muted-foreground">
                        Crypto • High Risk
                      </p>
                    </div>
                    <span className="text-sm font-medium text-orange-600">
                      -8.1%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">GameStop Corp.</p>
                      <p className="text-xs text-muted-foreground">
                        Stocks • Meme Stock
                      </p>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -15.3%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
          <p>&copy; 2024 Invest Mate. All rights reserved.</p>
          <p>Last updated: 2 minutes ago</p>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
