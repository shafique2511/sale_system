import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Package, 
  ArrowUpRight,
  TrendingDown,
  Activity,
  Loader2,
  ShoppingCart,
  Star,
  MessageSquare,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { posService } from '@/services/posService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const { businessId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        const [dashboardStats, orders] = await Promise.all([
          posService.getDashboardStats(businessId),
          posService.getRecentOrders(businessId, 5)
        ]);
        setStats(dashboardStats);
        setRecentOrders(orders);
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
        toast.error('Failed to load dashboard data. Please check your database connection.');
        // Set fallback stats to stop infinite loading
        setStats({
          totalSales: 0,
          bookingsCount: 0,
          inventoryCount: 0,
          averageRating: 0,
          sentimentStats: { positive: 0, neutral: 0, negative: 0 },
          revenueChart: [],
          recentOrders: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchData();
    } else if (!loading) {
      // If we finished loading auth but still have no businessId, we might need onboarding
      // But we should wait for useAuth to finish its own loading first
    }
  }, [businessId]);

  // Handle case where useAuth finished loading but businessId is still missing
  const { loading: authLoading, error: authError } = useAuth();
  
  useEffect(() => {
    if (!authLoading && !businessId && !authError) {
      navigate('/onboarding');
    }
  }, [authLoading, businessId, navigate, authError]);

  if (authLoading || loading) {
    if (authError) return null; // Let ConfigBanner handle the error UI
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your business data...</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Taking too long? Click to retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your business performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          description="Lifetime revenue" 
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 0, isUp: true }}
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.bookingsCount.toString()} 
          description="All-time appointments" 
          icon={<Calendar className="h-4 w-4" />}
          trend={{ value: 0, isUp: true }}
        />
        <StatCard 
          title="Products/Services" 
          value={stats.inventoryCount.toString()} 
          description="Active catalog items" 
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 0, isUp: true }}
        />
        <StatCard 
          title="Customer Satisfaction" 
          value={`${stats.averageRating.toFixed(1)}/5`} 
          description="Avg. based on feedback" 
          icon={<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          trend={{ value: stats.sentimentStats.positive, isUp: true }}
        />
      </div>

      <AIInsights stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue breakdown for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentOrders && stats.recentOrders.length > 0 ? stats.recentOrders : stats.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sales happening in your business.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.map((order, i) => (
                <div key={order.id} className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-full bg-green-500/10">
                    <ShoppingCart className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      Sale via {order.payment_method || 'Cash'} — ${Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No recent activity. Start by making a sale in the POS!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Sentiment</CardTitle>
            <CardDescription>AI-analyzed feedback sentiment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Positive</span>
                </div>
                <span className="text-sm font-bold">{stats.sentimentStats.positive}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Meh className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Neutral</span>
                </div>
                <span className="text-sm font-bold">{stats.sentimentStats.neutral}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Frown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Negative</span>
                </div>
                <span className="text-sm font-bold">{stats.sentimentStats.negative}</span>
              </div>
              <Button variant="ghost" className="w-full mt-2 text-xs h-8" onClick={() => navigate('/feedback')}>
                View all feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start gap-2 h-12" onClick={() => navigate('/pos')}>
              <ArrowUpRight className="h-4 w-4" />
              New POS Order
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12" onClick={() => navigate('/bookings')}>
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12" onClick={() => navigate('/inventory')}>
              <Package className="h-4 w-4" />
              Inventory Count
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12 text-primary font-bold border-primary/20 hover:bg-primary/5">
              <Activity className="h-4 w-4 text-primary" />
              End of Day Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
