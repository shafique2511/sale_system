import { supabase } from '@/lib/supabase';

export interface Branch {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  is_primary: boolean;
  created_at: string;
}

export const branchService = {
  async getBranches(businessId: string) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('business_id', businessId)
      .order('is_primary', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createBranch(branch: Partial<Branch>) {
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBranch(id: string, branch: Partial<Branch>) {
    const { data, error } = await supabase
      .from('branches')
      .update(branch)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteBranch(id: string) {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
