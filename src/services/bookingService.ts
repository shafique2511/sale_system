import { supabase } from '@/lib/supabase';

export interface Booking {
  id: string;
  business_id: string;
  branch_id: string;
  customer_id: string;
  service_id: string;
  staff_id: string | null;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  total_price: number;
  notes: string | null;
  created_at: string;
}

export const bookingService = {
  async getBookings(businessId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, customer:customers(name), service:services(name), staff:user_profiles(full_name)')
      .eq('business_id', businessId)
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateBookingStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
