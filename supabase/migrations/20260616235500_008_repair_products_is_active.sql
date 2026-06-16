/*
  # Repair product active status column

  Run this if Supabase returns PGRST204 for products.is_active.
  The admin activate/deactivate controls and storefront filtering require this column.
*/

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

UPDATE public.products
SET is_active = true
WHERE is_active IS NULL;

ALTER TABLE public.products
ALTER COLUMN is_active SET DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

NOTIFY pgrst, 'reload schema';
