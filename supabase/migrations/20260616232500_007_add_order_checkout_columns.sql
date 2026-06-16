/*
  # Add checkout metadata columns to orders

  1. Changes
    - Add `orders.discount_amount` for coupon discount tracking
    - Add `orders.applied_coupon` for storing the coupon code used
    - Add `orders.customer_session_id` for confirmation page references

  2. Notes
    - Safe to run multiple times
    - Keeps existing orders intact
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN discount_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'applied_coupon'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN applied_coupon text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_session_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN customer_session_id text;
  END IF;
END $$;

UPDATE public.orders
SET discount_amount = 0
WHERE discount_amount IS NULL;

ALTER TABLE public.orders
ALTER COLUMN discount_amount SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_customer_session_id ON public.orders(customer_session_id);
