-- OMNIBIZ SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Businesses
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('owner', 'manager', 'staff', 'customer')) DEFAULT 'customer',
  business_id UUID REFERENCES businesses(id),
  branch_id UUID REFERENCES branches(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  barcode TEXT,
  description TEXT,
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES user_profiles(id),
  staff_id UUID REFERENCES user_profiles(id),
  service_id UUID REFERENCES services(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (POS)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES user_profiles(id),
  customer_id UUID REFERENCES user_profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  service_id UUID REFERENCES services(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership Plans
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_days INTEGER,
  visit_limit INTEGER,
  credit_amount DECIMAL(10,2),
  discount_percentage INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (Legacy or separate tracking)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  points INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback & Reviews
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES user_profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  sentiment TEXT, -- positive, neutral, negative (analyzed by AI)
  source TEXT DEFAULT 'direct', -- direct, email, qr
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES (BASIC)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- ... (rest of policies)
-- 3.9 Customers Policies
CREATE POLICY "Staff can view customers" ON customers
  FOR SELECT USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Staff can insert customers" ON customers
  FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid()));

-- 3.10 Feedback Policies
CREATE POLICY "Anyone can view public feedback" ON feedback
  FOR SELECT USING (is_public = true OR business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Customers can insert feedback" ON feedback
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- 3.1 Businesses Policies
CREATE POLICY "Authenticated users can view businesses" ON businesses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create a business" ON businesses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners can update their own business" ON businesses
  FOR UPDATE USING (id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role = 'owner'));

-- 3.2 User Profiles Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- 3.3 Branches Policies (Owned by business)
CREATE POLICY "Authenticated users can view branches" ON branches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert branches" ON branches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners can manage branches" ON branches
  FOR ALL USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role = 'owner'));

-- 3.4 Services Policies
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Managers and owners can update services" ON services
  FOR UPDATE USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Managers and owners can delete services" ON services
  FOR DELETE USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role IN ('owner', 'manager')));

-- 3.5 Products Policies
CREATE POLICY "Authenticated users can view products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Managers and owners can update products" ON products
  FOR UPDATE USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Managers and owners can delete products" ON products
  FOR DELETE USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role IN ('owner', 'manager')));

-- 3.6 Bookings Policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (customer_id = auth.uid() OR staff_id = auth.uid() OR business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role IN ('owner', 'manager')));

CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Staff can manage their bookings" ON bookings
  FOR UPDATE USING (staff_id = auth.uid() OR business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid() AND role IN ('owner', 'manager')));

-- 3.7 Orders Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view orders of their business" ON orders
  FOR SELECT USING (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Staff can insert orders" ON orders
  FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid()));

-- 3.8 Order Items Policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view order items" ON order_items
  FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid())));

-- Staff can manage their order items
CREATE POLICY "Staff can insert order items" ON order_items
  FOR INSERT WITH CHECK (order_id IN (SELECT id FROM orders WHERE business_id IN (SELECT business_id FROM user_profiles WHERE id = auth.uid())));

-- 4. FUNCTIONS & RPCs

-- Atomic stock decrement
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - amount
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
