import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Clock, 
  User, 
  Gift, 
  CreditCard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const PortalLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar for Portal */}
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-full bg-card border-r flex-col p-6 space-y-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Customer Portal</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Main Street Shop</p>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { name: 'Home', href: '/portal', icon: Home },
            { name: 'Book Now', href: '/portal/book', icon: Calendar },
            { name: 'My Bookings', href: '/portal/bookings', icon: Clock },
            { name: 'Membership', href: '/portal/membership', icon: CreditCard },
            { name: 'Rewards', href: '/portal/rewards', icon: Gift },
            { name: 'Profile', href: '/portal/profile', icon: User },
          ].map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/portal'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-accent"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto md:max-w-4xl p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-card border-t flex items-center justify-around px-4 z-50">
        {[
          { name: 'Home', href: '/portal', icon: Home },
          { name: 'Book', href: '/portal/book', icon: Calendar },
          { name: 'Bookings', href: '/portal/bookings', icon: Clock },
          { name: 'Rewards', href: '/portal/rewards', icon: Gift },
          { name: 'Profile', href: '/portal/profile', icon: User },
        ].map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/portal'}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px]",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-5 w-5", isActive && "scale-110 transition-transform")} />
                <span className="text-[10px] uppercase tracking-tighter">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
