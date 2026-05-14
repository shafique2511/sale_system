import { supabase } from '@/lib/supabase';

export interface StaffProfile {
  id: string;
  full_name: string | null;
  role: 'owner' | 'manager' | 'staff';
  business_id: string | null;
  branch_id: string | null;
  created_at: string;
}

export const staffService = {
  async getStaff(businessId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, branch:branches(name)')
      .eq('business_id', businessId);
    
    if (error) throw error;
    return data;
  }
};
