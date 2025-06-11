import {
  Cloud,
  Database,
  Download,
  Filter,
  Globe,
  RefreshCw,
  Server,
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

export default function DataPage() {
  return (
    <ThreeColumnLayout>
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              All Data
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Globe className="mr-2 h-4 w-4" />
              Market Data
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Cloud className="mr-2 h-4 w-4" />
              API Feeds
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Server className="mr-2 h-4 w-4" />
              Internal DB
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Exports
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Data Health</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Sources</span>
                <span className="font-medium text-green-600">12/14</span>
              </div>
              <div className="flex justify-between">
                <span>Last Update</span>
                <span className="font-medium">2m ago</span>
              </div>
              <div className="flex justify-between">
                <span>Data Quality</span>
                <span className="font-medium text-green-600">98.7%</span>
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
                Data Management
              </h2>
              <p className="text-muted-foreground">
                Monitor data sources, APIs, and market data feeds.
              </p>
            </div>
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Records
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4M</div>
                <p className="text-xs text-muted-foreground">
                  +12K new records today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Sources
                </CardTitle>
                <Globe className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-xs text-muted-foreground">
                  Out of 14 total sources
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Cloud className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">47.8K</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Data Quality
                </CardTitle>
                <Filter className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <p className="text-xs text-muted-foreground">
                  Excellent data integrity
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Yahoo Finance API</p>
                      <p className="text-xs text-muted-foreground">
                        Real-time market data • Last sync: 30s ago
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      ✓ Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alpha Vantage</p>
                      <p className="text-xs text-muted-foreground">
                        Historical data • Last sync: 2m ago
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      ✓ Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">IEX Cloud</p>
                      <p className="text-xs text-muted-foreground">
                        News & fundamentals • Last sync: 1m ago
                      </p>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      ⚠ Delayed
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Data Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Market Prices</p>
                      <p className="text-xs text-muted-foregreen">
                        5,247 symbols updated
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      30s ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Company Financials</p>
                      <p className="text-xs text-muted-foreground">
                        834 companies refreshed
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      2m ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Economic Indicators</p>
                      <p className="text-xs text-muted-foreground">
                        47 indicators updated
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      5m ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Market Data API</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Used: 8,247/10,000
                    </span>
                    <span className="text-xs text-green-600">82%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="w-4/5 h-full bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">News API</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Used: 3,456/5,000
                    </span>
                    <span className="text-xs text-yellow-600">69%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="w-3/5 h-full bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Analytics API</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Used: 1,234/3,000
                    </span>
                    <span className="text-xs text-blue-600">41%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="w-2/5 h-full bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
