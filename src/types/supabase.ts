export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          type: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          business_id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          is_main: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          is_main?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          is_main?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'owner' | 'manager' | 'staff' | 'customer'
          business_id: string | null
          branch_id: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'owner' | 'manager' | 'staff' | 'customer'
          business_id?: string | null
          branch_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'owner' | 'manager' | 'staff' | 'customer'
          business_id?: string | null
          branch_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          price: number
          duration_minutes: number
          category: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          price: number
          duration_minutes: number
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          price?: number
          duration_minutes?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          business_id: string
          branch_id: string
          customer_id: string
          staff_id: string | null
          service_id: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          total_price: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          branch_id: string
          customer_id: string
          staff_id?: string | null
          service_id: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          total_price: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          branch_id?: string
          customer_id?: string
          staff_id?: string | null
          service_id?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          total_price?: number
          notes?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          business_id: string
          name: string
          sku: string | null
          barcode: string | null
          description: string | null
          cost_price: number
          selling_price: number
          stock_quantity: number
          low_stock_threshold: number
          category: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          sku?: string | null
          barcode?: string | null
          description?: string | null
          cost_price: number
          selling_price: number
          stock_quantity: number
          low_stock_threshold?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          sku?: string | null
          barcode?: string | null
          description?: string | null
          cost_price?: number
          selling_price?: number
          stock_quantity?: number
          low_stock_threshold?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
