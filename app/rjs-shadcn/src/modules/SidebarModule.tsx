import { PageModule } from 'rjs-frame';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Home, 
  FileText,
  TrendingUp 
} from 'lucide-react';

export class SidebarModule extends PageModule {
  renderContent() {
    return <SidebarContent />;
  }
}

function SidebarContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Users, label: 'Users', path: '/dashboard/users' },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
    { icon: TrendingUp, label: 'Sales', path: '/dashboard/sales' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">RJS Frame Demo</p>
      </div>
      
      <Separator className="mb-4" />
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigation(item.path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <Separator className="my-4" />
      
      <div className="mt-auto pt-4">
        <div className="text-xs text-muted-foreground">
          Built with RJS Frame
        </div>
      </div>
    </div>
  );
} 