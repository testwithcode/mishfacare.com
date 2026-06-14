/*
  # Add missing product storefront columns

  1. Changes
    - Add `products.is_active` for storefront/admin visibility control
    - Add `products.original_price` for strike-through pricing displays

  2. Notes
    - Safe to run multiple times
    - Backfills existing rows with sensible defaults
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE public.products ADD COLUMN original_price numeric;
  END IF;
END $$;

UPDATE public.products
SET is_active = true
WHERE is_active IS NULL;

ALTER TABLE public.products
ALTER COLUMN is_active SET DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
