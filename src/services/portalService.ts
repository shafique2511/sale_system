import { supabase } from '@/lib/supabase';

export const portalService = {
  async getBusinessInfo(businessId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPublicServices(businessId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('category', 'Service')
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  },

  async getAvailableStaff(businessId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('business_id', businessId)
      .in('role', ['manager', 'staff']);
    
    if (error) throw error;
    return data;
  }
};
