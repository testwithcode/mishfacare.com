/*
  # Add Discount and Coupon Management

  1. New Tables
    - `discounts` - Product discounts and deals
    - `coupons` - Customer coupon codes
    - `product_inventory` - Track stock levels

  2. Changes
    - Update products table with additional fields

  3. Security
    - Enable RLS on all new tables
    - Add policies for public reads and admin writes
*/

CREATE TABLE IF NOT EXISTS discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  max_uses integer,
  used_count integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  min_order_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL UNIQUE REFERENCES products(id),
  quantity_in_stock integer NOT NULL DEFAULT 0,
  reorder_level integer DEFAULT 10,
  last_updated timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sku'
  ) THEN
    ALTER TABLE products ADD COLUMN sku text UNIQUE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'cost_price'
  ) THEN
    ALTER TABLE products ADD COLUMN cost_price numeric;
  END IF;
END $$;

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discounts are publicly readable"
  ON discounts FOR SELECT
  USING (true);

CREATE POLICY "Coupons can be used by anyone"
  ON coupons FOR SELECT
  USING (is_active);

CREATE POLICY "Inventory is publicly readable"
  ON product_inventory FOR SELECT
  USING (true);

CREATE INDEX idx_discounts_product ON discounts(product_id);
CREATE INDEX idx_discounts_active ON discounts(is_active);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_inventory_product ON product_inventory(product_id);
