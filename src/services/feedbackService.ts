import { supabase } from '@/lib/supabase';

export interface Feedback {
  id: string;
  business_id: string;
  branch_id: string;
  customer_id: string | null;
  rating: number;
  comment: string | null;
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  source: string;
  is_public: boolean;
  created_at: string;
  customer?: {
    full_name: string;
  } | null;
}

export const feedbackService = {
  async getFeedback(businessId: string, branchId?: string | null) {
    let query = supabase
      .from('feedback')
      .select('*, customer:user_profiles(full_name)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Feedback[];
  },

  async submitFeedback(feedback: Partial<Feedback>) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();
    
    if (error) throw error;
    return data as Feedback;
  },

  async deleteFeedback(id: string) {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
