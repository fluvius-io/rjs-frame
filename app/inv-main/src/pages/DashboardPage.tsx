import {
  BarChart3,
  Filter,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule } from "rjs-frame";
import { Header } from "../components";

export default function DashboardPage() {
  return (
    <ThreeColumnLayout>
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dashboard Views</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LineChart className="mr-2 h-4 w-4" />
              Performance
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PieChart className="mr-2 h-4 w-4" />
              Asset Allocation
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trends
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Team Analytics
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Quick Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total ROI</span>
                <span className="font-medium text-green-600">+18.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Gain</span>
                <span className="font-medium text-green-600">+3.4%</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Score</span>
                <span className="font-medium text-yellow-600">Medium</span>
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
                Analytics Dashboard
              </h2>
              <p className="text-muted-foreground">
                Comprehensive portfolio analytics and performance insights.
              </p>
            </div>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Portfolio Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,586</div>
                <p className="text-xs text-muted-foreground">
                  +18.2% from last quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Return
                </CardTitle>
                <LineChart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+3.4%</div>
                <p className="text-xs text-muted-foreground">
                  Beating benchmark by 1.2%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Positions
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">
                  Across 8 sectors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Risk Score
                </CardTitle>
                <Filter className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">6.8</div>
                <p className="text-xs text-muted-foreground">
                  Medium risk portfolio
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Apple Inc. (AAPL)</p>
                      <p className="text-xs text-muted-foreground">
                        Technology • 12.3% of portfolio
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +4.2%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Microsoft (MSFT)</p>
                      <p className="text-xs text-muted-foreground">
                        Technology • 10.8% of portfolio
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +2.7%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Amazon (AMZN)</p>
                      <p className="text-xs text-muted-foreground">
                        Consumer • 8.9% of portfolio
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +1.9%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Technology</p>
                      <p className="text-xs text-muted-foreground">
                        35.4% allocation
                      </p>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-9 h-full bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Healthcare</p>
                      <p className="text-xs text-muted-foreground">
                        18.7% allocation
                      </p>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-5 h-full bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Financial</p>
                      <p className="text-xs text-muted-foreground">
                        15.2% allocation
                      </p>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-4 h-full bg-yellow-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
