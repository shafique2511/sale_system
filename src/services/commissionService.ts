import { supabase } from '@/lib/supabase';

export interface Commission {
  id: string;
  business_id: string;
  staff_id: string;
  order_id: string | null;
  sale_amount: number;
  commission_rate: number;
  earned_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export const commissionService = {
  async getCommissions(businessId: string) {
    const { data, error } = await supabase
      .from('commissions')
      .select(`
        *,
        staff:profiles(full_name)
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async calculateCommissions(businessId: string) {
    // In a real app, this would be a database function or trigger
    // For now, we'll just fetch what's there
    return this.getCommissions(businessId);
  }
};
