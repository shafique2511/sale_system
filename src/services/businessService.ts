import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Business = Database['public']['Tables']['businesses']['Row'];
export type Branch = Database['public']['Tables']['branches']['Row'];

export const businessService = {
  async getBusiness(businessId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
    
    if (error) throw error;
    return data as Business;
  },

  async getBranches(businessId: string) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) throw error;
    return data as Branch[];
  },

  async createBusiness(name: string, type: string) {
    const { data, error } = await supabase
      .from('businesses')
      .insert({ name, type })
      .select()
      .single();
    
    if (error) throw error;
    return data as Business;
  },

  async createBranch(businessId: string, name: string, isMain: boolean = false) {
    const { data, error } = await supabase
      .from('branches')
      .insert({ business_id: businessId, name, is_main: isMain })
      .select()
      .single();
    
    if (error) throw error;
    return data as Branch;
  }
};
