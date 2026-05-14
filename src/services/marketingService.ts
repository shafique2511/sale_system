import { supabase } from '@/lib/supabase';

export interface Campaign {
  id: string;
  business_id: string;
  name: string;
  type: 'Email' | 'SMS';
  status: 'Draft' | 'Active' | 'Completed';
  reach: number;
  conversions: number;
  created_at: string;
}

export const marketingService = {
  async getCampaigns(businessId: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAudienceSegments(businessId: string) {
    // This could count customers based on criteria
    const { data, error } = await supabase
      .from('customers')
      .select('id, last_visit, points')
      .eq('business_id', businessId);
    
    if (error) throw error;
    
    const now = new Date();
    const segments = {
      active: data.filter(c => c.last_visit && (now.getTime() - new Date(c.last_visit).getTime()) < 30 * 24 * 60 * 60 * 1000).length,
      lapsed: data.filter(c => !c.last_visit || (now.getTime() - new Date(c.last_visit).getTime()) >= 30 * 24 * 60 * 60 * 1000).length,
      highSpenders: data.filter(c => c.points > 1000).length,
      total: data.length
    };
    
    return segments;
  }
};
