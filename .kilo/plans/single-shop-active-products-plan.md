# Product Visibility and Single Shop Page Plan

## Current State
- Storefront product fetching already goes through `src/lib/products.ts` and uses Supabase first, with `activeOnly` filtering available.
- Home, Products, Cart sync, and ChatBot already consume `fetchProducts(...)`.
- Admin product status toggle already exists in `src/pages/AdminProducts.tsx` and updates `products.is_active`.
- Supabase migrations already add `products.is_active` and `products.original_price`.
- Admin product create/edit currently saves `price`, but does not persist `original_price`, so discount pricing cannot be fully managed from admin.
- The site still has multiple product-related entry points (`/products`, `/women-care`, `/baby-care`) even though the requested UX is one main shop page with search and filters.

## Goals
1. Only active products should appear on the public website.
2. Admin should be able to activate/deactivate any individual product.
3. Admin should be able to edit selling price and discount/original price, and the website should display them.
4. The public shopping experience should be centered on a single shop page with search and filters.

## Implementation Plan

### 1. Stabilize the shared product data model
- Keep `src/lib/products.ts` as the single product-fetching layer.
- Extend normalization only if needed for numeric safety around `original_price` so storefront/admin always receive a proper number or `undefined`.
- Keep `activeOnly` filtering at the shared data layer so all storefront consumers respect active status automatically.
- Review any remaining direct `supabase.from('products')` reads and prefer `fetchProducts(...)` for storefront-facing usage.

### 2. Finish admin support for pricing and visibility management
- Update the admin product form in `src/pages/AdminProducts.tsx` to include both:
  - `price`: current selling/discount price
  - `original_price`: old/MRP price shown as strike-through
- Persist `original_price` in both create and update payloads.
- Show `original_price` alongside `price` in admin product cards so the saved pricing is visible immediately.
- Keep the existing activate/deactivate action and status filter, since that already matches the requested per-product control.
- Validate pricing inputs so empty or invalid values do not save incorrect numbers.

### 3. Make the storefront depend on database-backed active products only
- Ensure the main shop page (`src/pages/Products.tsx`) continues to load with `fetchProducts({ activeOnly: true })`.
- Check other storefront surfaces that expose products:
  - `src/pages/Home.tsx`
  - `src/context/CartContext.tsx`
  - `src/components/ChatBot.tsx`
- Preserve active-only behavior there so inactive products disappear from featured sections, cart refresh, and assistant recommendations.
- Keep the local `src/data/products.ts` catalog only as an emergency fallback unless the implementation phase decides to remove that fallback entirely.

### 4. Convert the public shop into the single product discovery page
- Enhance `src/pages/Products.tsx` with in-page controls only:
  - text search by product name and optionally description/SKU
  - category filter
  - optional price/status badges if useful, but no separate listing pages
- Keep all public product browsing on `/products`.
- Treat `/women-care` and `/baby-care` as informational brand pages only, or simplify their CTAs to route users back to `/products` instead of acting like separate shop sections.
- Update navigation text/links only if needed so users clearly understand `/products` is the single shop page.

### 5. Display discount pricing consistently on the website
- Standardize the pricing presentation across:
  - `src/pages/Products.tsx`
  - `src/pages/Home.tsx`
  - `src/pages/Cart.tsx`
- Display `price` as the live selling price.
- Display `original_price` only when it is greater than `price`.
- Avoid showing a misleading “Discount Price” label if there is no actual original/MRP value.

### 6. Verification during implementation
- Confirm active products appear on `/products` and inactive ones do not.
- Confirm toggling product status in admin updates the public shop after refresh/reload.
- Confirm editing `price` and `original_price` in admin changes the storefront display.
- Confirm search and category filtering work on the single shop page.
- Run project validation after code changes:
  - `npm run build`
  - `npm run typecheck`
  - optionally `npm run lint` if the repo is currently lint-clean enough for signal.

## Expected Files to Change
- `src/pages/AdminProducts.tsx`
- `src/pages/Products.tsx`
- `src/pages/Home.tsx`
- `src/pages/Cart.tsx`
- `src/lib/products.ts`
- Possibly `src/components/Header.tsx`, `src/pages/WomenCare.tsx`, and `src/pages/BabyCare.tsx` depending on how strictly the single-shop UX is enforced.

## Notes
- The database migrations for `is_active` and `original_price` already exist, so implementation should first verify the connected Supabase project has those migrations applied.
- Existing admin activate/deactivate support is already close to the requested behavior; the main missing piece is admin editing/persisting of `original_price` plus tightening the storefront UX around one shop page.
- Assumption for implementation: `/products` remains the only shopping/listing page, while other category routes remain informational unless explicitly removed.
