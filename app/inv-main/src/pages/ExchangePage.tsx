import {
  ArrowUpDown,
  DollarSign,
  Filter,
  LineChart,
  RefreshCw,
  TrendingUp,
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

export default function ExchangePage() {
  return (
    <ThreeColumnLayout>
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Trading Pairs</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              USD Pairs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Major Stocks
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LineChart className="mr-2 h-4 w-4" />
              ETFs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Forex
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <RefreshCw className="mr-2 h-4 w-4" />
              Crypto
            </Button>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Market Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NYSE</span>
                <span className="font-medium text-green-600">Open</span>
              </div>
              <div className="flex justify-between">
                <span>NASDAQ</span>
                <span className="font-medium text-green-600">Open</span>
              </div>
              <div className="flex justify-between">
                <span>Forex</span>
                <span className="font-medium text-green-600">24/7</span>
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
                Exchange Trading
              </h2>
              <p className="text-muted-foreground">
                Real-time trading across multiple exchanges and markets.
              </p>
            </div>
            <Button>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$25,840</div>
                <p className="text-xs text-muted-foreground">
                  Ready for trading
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Open Orders
                </CardTitle>
                <RefreshCw className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">7</div>
                <p className="text-xs text-muted-foreground">
                  Pending execution
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's P&L
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+$1,247</div>
                <p className="text-xs text-muted-foreground">
                  +4.8% unrealized gain
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trade Volume
                </CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$47,600</div>
                <p className="text-xs text-muted-foreground">
                  Today's total volume
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AAPL</p>
                      <p className="text-xs text-muted-foreground">
                        Long • 100 shares @ $175.50
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +$320
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">TSLA</p>
                      <p className="text-xs text-muted-foreground">
                        Short • 50 shares @ $242.80
                      </p>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -$180
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SPY</p>
                      <p className="text-xs text-muted-foreground">
                        Long • 200 shares @ $445.20
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      +$560
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">NVDA Buy</p>
                      <p className="text-xs text-muted-foreground">
                        Market • 25 shares • Filled
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      Executed
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">MSFT Sell</p>
                      <p className="text-xs text-muted-foreground">
                        Limit • 50 shares @ $380.00
                      </p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AMZN Buy</p>
                      <p className="text-xs text-muted-foreground">
                        Stop • 30 shares @ $145.00
                      </p>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      Queued
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">AAPL</p>
                    <p className="text-xs text-muted-foreground">Apple Inc.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">$178.25</p>
                    <p className="text-xs text-green-600">+1.8%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">GOOGL</p>
                    <p className="text-xs text-muted-foreground">
                      Alphabet Inc.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">$138.42</p>
                    <p className="text-xs text-red-600">-0.5%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">MSFT</p>
                    <p className="text-xs text-muted-foreground">
                      Microsoft Corp.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">$378.50</p>
                    <p className="text-xs text-green-600">+2.1%</p>
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
