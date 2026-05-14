import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];

export const inventoryService = {
  async getProducts(businessId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Product[];
  },

  async getServices(businessId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Service[];
  },

  async createProduct(product: Database['public']['Tables']['products']['Insert']) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async createService(service: Database['public']['Tables']['services']['Insert']) {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
    
    if (error) throw error;
    return data as Service;
  }
};
