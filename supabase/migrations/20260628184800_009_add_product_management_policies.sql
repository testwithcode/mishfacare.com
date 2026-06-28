/*
  # Add product management policies

  The admin UI uses the public Supabase client, so products need explicit RLS
  policies for write operations. Without these policies, updates affect zero rows
  and the UI appears to change until the next refresh.
*/

CREATE POLICY IF NOT EXISTS "Admin can create products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can update products"
  ON public.products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can delete products"
  ON public.products FOR DELETE
  USING (true);
