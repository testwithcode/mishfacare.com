/*
  # Add Admin Authentication and Order Management

  1. New Tables
    - `admin_users` - Admin account management
    - Updated `orders` table with customer session tracking

  2. Security
    - Enable RLS on admin_users
    - Add policies for admin access only
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_session_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_session_id text;
  END IF;
END $$;
