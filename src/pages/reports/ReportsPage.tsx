import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Filter, 
  ArrowUpRight, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { posService } from '@/services/posService';
import { toast } from 'sonner';

export const ReportsPage = () => {
  const { businessId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const orders = await posService.getReports(businessId);
      
      // Process monthly stats
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData: Record<string, { revenue: number, orders: number }> = {};
      
      orders.forEach(order => {
        const date = new Date(order.created_at);
        const month = monthNames[date.getMonth()];
        if (!monthlyData[month]) monthlyData[month] = { revenue: 0, orders: 0 };
        monthlyData[month].revenue += Number(order.total_amount);
        monthlyData[month].orders += 1;
      });

      const processedMonthlyStats = Object.entries(monthlyData).map(([month, stats]) => ({
        month,
        revenue: stats.revenue,
        expenses: stats.revenue * 0.6 // Mock expenses for now
      }));

      // Category breakdown
      let serviceRevenue = 0;
      let productRevenue = 0;

      orders.forEach(order => {
        order.order_items?.forEach((item: any) => {
          if (item.service_id) serviceRevenue += Number(item.total_price);
          if (item.product_id) productRevenue += Number(item.total_price);
        });
      });

      const processedCategorySales = [
        { name: 'Services', value: serviceRevenue, color: '#3b82f6' },
        { name: 'Products', value: productRevenue, color: '#10b981' },
      ].filter(c => c.value > 0);

      // Total Revenue
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const avgTicketValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      setData({
        monthlyStats: processedMonthlyStats,
        categorySales: processedCategorySales,
        totalRevenue,
        avgTicketValue,
        totalOrders: orders.length
      });
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Reports</h1>
          <p className="text-muted-foreground">Detailed analysis of revenue, performance, and trends.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter Range
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> All-time performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Avg Ticket Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.avgTicketValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average per customer order</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Processed transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses (Est.)</CardTitle>
            <CardDescription>Performance comparison over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyStats}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Breakdown of sales sources.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data?.categorySales.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service vs Product Performance</CardTitle>
          <CardDescription>Comparison details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Revenue Contribution</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.categorySales.map((cat: any) => (
                <TableRow key={cat.name}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>${cat.value.toFixed(2)}</TableCell>
                  <TableCell>{((cat.value / (data.totalRevenue || 1)) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              {data?.categorySales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No data available yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
