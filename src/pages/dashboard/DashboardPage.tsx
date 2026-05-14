import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Package, 
  ArrowUpRight,
  TrendingDown,
  Activity
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
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 18 },
  { name: 'Wed', revenue: 2000, bookings: 12 },
  { name: 'Thu', revenue: 2780, bookings: 20 },
  { name: 'Fri', revenue: 1890, bookings: 15 },
  { name: 'Sat', revenue: 2390, bookings: 25 },
  { name: 'Sun', revenue: 3490, bookings: 30 },
];

const statusData = [
  { name: 'Completed', value: 400, color: '#10b981' },
  { name: 'Pending', value: 300, color: '#f59e0b' },
  { name: 'Cancelled', value: 100, color: '#ef4444' },
];

export const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your business performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value="$12,845" 
          description="from last month" 
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 12.5, isUp: true }}
        />
        <StatCard 
          title="Total Bookings" 
          value="148" 
          description="from last month" 
          icon={<Calendar className="h-4 w-4" />}
          trend={{ value: 4.2, isUp: true }}
        />
        <StatCard 
          title="Active Members" 
          value="42" 
          description="new this month" 
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 18, isUp: true }}
        />
        <StatCard 
          title="Completion Rate" 
          value="94.2%" 
          description="average this week" 
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{ value: 2.1, isUp: false }}
        />
      </div>

      <AIInsights />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue breakdown for the current week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
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

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Breakdown of all bookings by status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events happening in your business.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { user: 'Sarah Johnson', action: 'booked a Classic Haircut', time: '2 mins ago', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { user: 'POS Terminal 1', action: 'Coffee & Sandwich Sale - $18.50', time: '15 mins ago', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
                { user: 'Mike Peters', action: 'Check-in: Beard Trim', time: '1 hour ago', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { user: 'Inventory System', action: 'Low Stock Alert: Hair Wax', time: '2 hours ago', icon: Package, color: 'text-red-500', bg: 'bg-red-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn("mt-1 p-2 rounded-full", item.bg)}>
                    <item.icon className={cn("h-4 w-4", item.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.user}</p>
                    <p className="text-sm text-muted-foreground">{item.action}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start gap-2 h-12">
              <ArrowUpRight className="h-4 w-4" />
              New POS Order
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12">
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
