import { supabase } from '@/lib/supabase';

export interface LoyaltyReward {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  point_cost: number;
  reward_type: 'service' | 'product' | 'voucher';
  is_active: boolean;
  created_at: string;
}

export interface LoyaltyStats {
  activeParticipants: number;
  totalRedeemed: number;
  topEarners: { id: string; name: string; points: number }[];
}

export const loyaltyService = {
  async getRewards(businessId: string) {
    const { data, error } = await supabase
      .from('loyalty_rewards')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('point_cost');
    
    if (error) throw error;
    return data as LoyaltyReward[];
  },

  async getLoyaltyStats(businessId: string): Promise<LoyaltyStats> {
    // Get top earners
    const { data: earners, error: earnersError } = await supabase
      .from('customers')
      .select('id, name, points')
      .eq('business_id', businessId)
      .gt('points', 0)
      .order('points', { ascending: false })
      .limit(10);
    
    if (earnersError) throw earnersError;

    // Get active participants count
    const { count: participantsCount, error: countError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gt('points', 0);

    if (countError) throw countError;

    return {
      activeParticipants: participantsCount || 0,
      totalRedeemed: 0, // Mock for now until redemption table exists
      topEarners: earners || []
    };
  }
};
