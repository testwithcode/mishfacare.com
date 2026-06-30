/*
  # Normalize product SKUs

  1. Changes
    - Convert existing blank product SKUs to null
    - Prevent future blank SKUs from being stored as empty strings

  2. Notes
    - Unique constraints allow multiple null values, but not repeated empty strings
*/

UPDATE public.products
SET sku = NULL
WHERE btrim(coalesce(sku, '')) = '';

CREATE OR REPLACE FUNCTION public.normalize_product_sku()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.sku = NULLIF(btrim(NEW.sku), '');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_product_sku_before_write ON public.products;

CREATE TRIGGER normalize_product_sku_before_write
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_product_sku();
