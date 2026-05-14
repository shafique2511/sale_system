import { supabase } from '@/lib/supabase';

export interface MembershipPlan {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_type: 'monthly' | 'yearly' | 'lifetime';
  service_limit: number | null; // null for unlimited
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
}

export interface UserMembership {
  id: string;
  customer_id: string;
  plan_id: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'expired' | 'cancelled';
  remaining_hits: number | null;
  plan?: MembershipPlan;
  customer?: { name: string };
}

export const membershipService = {
  async getPlans(businessId: string) {
    const { data, error } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('price');
    
    if (error) throw error;
    return data as MembershipPlan[];
  },

  async getActiveMemberships(businessId: string) {
    const { data, error } = await supabase
      .from('memberships')
      .select('*, plan:membership_plans(*), customer:customers(name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as UserMembership[];
  }
};
