import { PageModule } from 'rjs-frame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export class ChartModule extends PageModule {
  renderContent() {
    return <ChartContent />;
  }
}

function ChartContent() {
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const trafficData = [
    { time: '00:00', visitors: 20 },
    { time: '04:00', visitors: 15 },
    { time: '08:00', visitors: 80 },
    { time: '12:00', visitors: 120 },
    { time: '16:00', visitors: 95 },
    { time: '20:00', visitors: 60 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#0088FE' },
    { name: 'Mobile', value: 35, color: '#00C49F' },
    { name: 'Tablet', value: 20, color: '#FFBB28' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Sales Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales and revenue data</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Device Usage</CardTitle>
          <CardDescription>Traffic by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Chart */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
          <CardDescription>Hourly visitor count</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 