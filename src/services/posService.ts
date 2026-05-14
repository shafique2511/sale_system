import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export const posService = {
  async createOrder(order: Database['public']['Tables']['orders']['Insert'], items: Array<{
    product_id?: string;
    service_id?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>) {
    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create the order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Update stock for products
    for (const item of items) {
      if (item.product_id) {
        // This should probably be a RPC call or use increment/decrement to be safe
        // For now, doing a simple decrement
        const { error: stockError } = await supabase.rpc('decrement_stock', { 
          p_id: item.product_id, 
          amount: item.quantity 
        });
        if (stockError) console.error('Stock update error:', stockError);
      }
    }

    return orderData as Order;
  },

  async getRecentOrders(businessId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getDashboardStats(businessId: string) {
    // 1. Total sales (lifetime or maybe current month)
    const { data: salesData, error: salesError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('business_id', businessId);
    
    if (salesError) throw salesError;
    const totalSales = (salesData || []).reduce((sum, order) => sum + Number(order.total_amount), 0);

    // 2. Total bookings
    const { count: bookingsCount, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);
    
    if (bookingsError) throw bookingsError;

    // 3. Active products/services
    const { count: inventoryCount, error: inventoryError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);
    
    if (inventoryError) throw inventoryError;

    // 4. Revenue data for chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: chartData, error: chartError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('business_id', businessId)
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (chartError) throw chartError;

    // Process chart data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay: Record<string, number> = {};
    
    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        revenueByDay[days[d.getDay()]] = 0;
    }

    chartData?.forEach(order => {
        const day = days[new Date(order.created_at).getDay()];
        if (revenueByDay[day] !== undefined) {
            revenueByDay[day] += Number(order.total_amount);
        }
    });

    const processedChartData = Object.entries(revenueByDay).map(([name, revenue]) => ({
        name,
        revenue
    })).reverse(); // Oldest first

    return {
      totalSales,
      bookingsCount: bookingsCount || 0,
      inventoryCount: inventoryCount || 0,
      revenueChart: processedChartData
    };
  },

  async getReports(businessId: string) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name), service:services(name))')
      .eq('business_id', businessId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return orders;
  }
};
