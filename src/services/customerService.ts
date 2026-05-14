import { supabase } from '@/lib/supabase';

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  points: number;
  tags: string[];
  created_at: string;
}

export const customerService = {
  async getCustomers(businessId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', businessId)
      .order('name');
    
    if (error) throw error;
    return data as Customer[];
  },

  async createCustomer(customer: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) throw error;
    return data as Customer;
  }
};
