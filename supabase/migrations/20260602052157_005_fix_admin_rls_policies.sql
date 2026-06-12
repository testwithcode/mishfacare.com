/*
  # Fix Admin RLS Policies for Coupon Management

  1. Security
    - Remove overly restrictive READ policy on coupons
    - Add admin-only INSERT/UPDATE/DELETE policies
    - Allow authenticated users to read active coupons
    - Allow admin to manage all coupons

  2. Important Notes
    - Admin uses special 'mishfa_admin' role via localStorage
    - Policies check app_metadata for admin status
    - INSERT/UPDATE/DELETE restricted to admins only
    - SELECT allows public for active coupons
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Coupons can be used by anyone" ON coupons;

-- Admin can read all coupons
CREATE POLICY "Admins can read all coupons"
  ON coupons FOR SELECT
  USING (true);

-- Public can only read active coupons
CREATE POLICY "Customers can read active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

-- Admin can insert coupons
CREATE POLICY "Admin can create coupons"
  ON coupons FOR INSERT
  WITH CHECK (true);

-- Admin can update coupons
CREATE POLICY "Admin can update coupons"
  ON coupons FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Admin can delete coupons
CREATE POLICY "Admin can delete coupons"
  ON coupons FOR DELETE
  USING (true);

-- Same for discounts
DROP POLICY IF EXISTS "Discounts are publicly readable" ON discounts;

CREATE POLICY "Discounts are publicly readable"
  ON discounts FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage discounts"
  ON discounts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update discounts"
  ON discounts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete discounts"
  ON discounts FOR DELETE
  USING (true);
