import { supabase } from '@/lib/supabase';

export interface Booking {
  id: string;
  business_id: string;
  customer_id: string | null;
  service_id: string | null;
  staff_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  notes: string | null;
  created_at: string;
}

export const bookingService = {
  async getBookings(businessId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, customer:customers(name), service:services(name), staff:profiles(full_name)')
      .eq('business_id', businessId)
      .order('booking_date', { ascending: false });
    
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
