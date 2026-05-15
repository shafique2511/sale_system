import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  CreditCard, 
  Package, 
  UsersRound, 
  PieChart, 
  Settings, 
  Store, 
  UserCircle,
  LogOut,
  ChevronRight,
  TrendingUp,
  Tag,
  Briefcase,
  History,
  Trophy,
  Gift,
  Megaphone,
  Layers,
  MapPin,
  Key
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const adminMenu = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Bookings', href: '/bookings', icon: BookOpen },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Members', href: '/members', icon: UserCircle },
  { name: 'Plans', href: '/membership-plans', icon: Layers },
  { name: 'POS', href: '/pos', icon: CreditCard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Inventory', href: '/inventory', icon: Briefcase },
  { name: 'Staff', href: '/staff', icon: UsersRound },
  { name: 'Commission', href: '/commission', icon: TrendingUp },
  { name: 'Payments', href: '/payments', icon: History },
  { name: 'Loyalty', href: '/loyalty', icon: Trophy },
  { name: 'Rewards', href: '/rewards', icon: Gift },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Branches', href: '/branches', icon: MapPin },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'License', href: '/license', icon: Key },
];

const customerMenu = [
  { name: 'Home', href: '/portal', icon: Store },
  { name: 'Book Now', href: '/portal/book', icon: Calendar },
  { name: 'My Bookings', href: '/portal/bookings', icon: History },
  { name: 'Membership', href: '/portal/membership', icon: UserCircle },
  { name: 'Rewards', href: '/portal/rewards', icon: Gift },
  { name: 'Profile', href: '/portal/profile', icon: UserCircle },
];

export const Sidebar = ({ className, onClick, ...props }: SidebarProps & { onClick?: () => void }) => {
  const { profile, signOut } = useAuth();
  
  const menu = profile?.role === 'customer' ? customerMenu : adminMenu;

  return (
    <div className={cn("pb-12 h-full border-r bg-card", className)}>
      <div className="space-y-4 py-4 h-full flex flex-col">
        <div className="px-6 py-2">
          <h2 className="text-2xl font-bold tracking-tight text-primary">OmniBiz</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Management System</p>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {menu.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClick}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </div>
        </ScrollArea>
        <div className="px-6 mt-auto pt-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-3"
            onClick={signOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
