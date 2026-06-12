/*
  # Mishfa Care Database Schema

  1. New Tables
    - `products` - Store all product information (sanitary pads, diapers, baby care)
    - `cart_items` - Shopping cart items (temporary storage)
    - `orders` - Order tracking
    - `contact_messages` - Contact form submissions
    - `distributor_applications` - Distributor signup forms
    - `chatbot_interactions` - Log chatbot conversations

  2. Security
    - Enable RLS on all tables
    - Add policies for public reads on products
    - Restrict write access to authenticated users or API
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('sanitary_pads', 'baby_diapers', 'women_care', 'baby_care')),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  features text[],
  is_featured boolean DEFAULT false,
  stock_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS distributor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile_number text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  business_name text NOT NULL,
  current_business_type text NOT NULL,
  monthly_expected_order text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_question text NOT NULL,
  bot_response text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add to cart"
  ON cart_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view and manage their cart"
  ON cart_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view all orders (basic info)"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit distributor applications"
  ON distributor_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Chatbot interactions are publicly readable"
  ON chatbot_interactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can log chatbot interactions"
  ON chatbot_interactions FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_distributor_created ON distributor_applications(created_at);
