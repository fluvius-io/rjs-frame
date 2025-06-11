import {
  AlertTriangle,
  Filter,
  Signal,
  TrendingDown,
  TrendingUp,
  Zap,
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

export default function SignalsPage() {
  return (
    <ThreeColumnLayout>
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Signal Types</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Signal className="mr-2 h-4 w-4" />
              All Signals
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Buy Signals
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingDown className="mr-2 h-4 w-4" />
              Sell Signals
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Risk Alerts
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Zap className="mr-2 h-4 w-4" />
              Real-time
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Signal Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Signals</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span>Buy Signals</span>
                <span className="font-medium text-green-600">28</span>
              </div>
              <div className="flex justify-between">
                <span>Sell Signals</span>
                <span className="font-medium text-red-600">19</span>
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
                Trading Signals
              </h2>
              <p className="text-muted-foreground">
                Monitor real-time trading signals and market alerts.
              </p>
            </div>
            <Button>
              <Signal className="mr-2 h-4 w-4" />
              Create Signal
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Signals
                </CardTitle>
                <Signal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">
                  +5 new signals today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Buy Signals
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">28</div>
                <p className="text-xs text-muted-foreground">
                  Strong upward momentum
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sell Signals
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">19</div>
                <p className="text-xs text-muted-foreground">
                  Market correction indicators
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Signal Accuracy
                </CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days performance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AAPL Buy Signal</p>
                      <p className="text-xs text-muted-foreground">
                        Technical Analysis • 2 min ago
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +2.3%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">TSLA Sell Alert</p>
                      <p className="text-xs text-muted-foreground">
                        Momentum • 5 min ago
                      </p>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -1.8%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SPY Neutral</p>
                      <p className="text-xs text-muted-foreground">
                        Market Analysis • 8 min ago
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      0.0%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">NVDA</p>
                      <p className="text-xs text-muted-foreground">
                        Technology • Strong Buy
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +8.2%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AMD</p>
                      <p className="text-xs text-muted-foreground">
                        Semiconductors • Buy
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +5.7%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">MSFT</p>
                      <p className="text-xs text-muted-foreground">
                        Cloud Computing • Hold
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +3.1%
                    </span>
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
