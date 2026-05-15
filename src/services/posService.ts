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
    
    // 3. Award Loyalty Points if customer is linked
    if (order.customer_id) {
      try {
        // Get the business loyalty settings first
        const { data: business } = await supabase
          .from('businesses')
          .select('loyalty_points_per_dollar')
          .eq('id', order.business_id)
          .single();
        
        const rate = business?.loyalty_points_per_dollar || 1;
        const pointsToAward = Math.floor(Number(order.total_amount) * rate);
        
        if (pointsToAward > 0) {
          // Increment customer points
          const { error: pointsError } = await supabase.rpc('increment_customer_points', {
            c_id: order.customer_id,
            amount: pointsToAward
          });
          
          if (pointsError) console.error('Points awarding error:', pointsError);
        }
      } catch (err) {
        console.error('Failed to award loyalty points:', err);
      }
    }

    // 4. Update stock for products
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
    // Helper to run query and return empty data on error
    const safeQuery = async (query: any) => {
      try {
        const { data, count, error } = await query;
        if (error) {
          console.warn('Dashboard Query Warning:', error);
          return { data: null, count: 0, error };
        }
        return { data, count, error: null };
      } catch (err) {
        console.warn('Dashboard Query Catch:', err);
        return { data: null, count: 0, error: err };
      }
    };

    // 1. Total sales
    const salesResult = await safeQuery(
      supabase.from('orders').select('total_amount').eq('business_id', businessId)
    );
    const totalSales = (salesResult.data || []).reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);

    // 2. Total bookings
    const bookingsResult = await safeQuery(
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('business_id', businessId)
    );

    // 3. Active products/services
    const inventoryResult = await safeQuery(
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('business_id', businessId)
    );

    // 4. Revenue data for chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const chartResult = await safeQuery(
      supabase.from('orders')
        .select('total_amount, created_at')
        .eq('business_id', businessId)
        .gte('created_at', sevenDaysAgo.toISOString())
    );
    
    // Process chart data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        revenueByDay[days[d.getDay()]] = 0;
    }

    if (chartResult.data) {
      chartResult.data.forEach((order: any) => {
          const day = days[new Date(order.created_at).getDay()];
          if (revenueByDay[day] !== undefined) {
              revenueByDay[day] += Number(order.total_amount);
          }
      });
    }

    const processedChartData = Object.entries(revenueByDay).map(([name, revenue]) => ({
        name,
        revenue
    })).reverse();

    // 5. Feedback Stats
    const feedbackResult = await safeQuery(
      supabase.from('feedback').select('rating, sentiment').eq('business_id', businessId)
    );
    
    let averageRating = 0;
    let sentimentStats = { positive: 0, neutral: 0, negative: 0 };

    if (feedbackResult.data && feedbackResult.data.length > 0) {
      averageRating = feedbackResult.data.reduce((acc: number, f: any) => acc + f.rating, 0) / feedbackResult.data.length;
      feedbackResult.data.forEach((f: any) => {
        if (f.sentiment) sentimentStats[f.sentiment as keyof typeof sentimentStats]++;
      });
    }

    return {
      totalSales,
      bookingsCount: bookingsResult.count || 0,
      inventoryCount: inventoryResult.count || 0,
      revenueChart: processedChartData,
      averageRating,
      sentimentStats
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
