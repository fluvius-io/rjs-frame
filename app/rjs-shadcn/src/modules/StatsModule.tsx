import { PageModule } from 'rjs-frame';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export class StatsModule extends PageModule {
  renderContent() {
    return <StatsContent />;
  }
}

function StatsContent() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      description: 'from last month'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'Sales',
      value: '+12,234',
      change: '+19%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'from last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      description: 'from last month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon className={`h-4 w-4 mr-1 ${trendColor}`} />
                <span className={trendColor}>{stat.change}</span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 