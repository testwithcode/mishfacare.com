import type { Product } from '../types';
import { productCatalog } from '../data/products';
import { supabase } from './supabase';

type ProductRow = Partial<Product> & {
  id: string;
  category: Product['category'];
  name: string;
  price: number;
  created_at?: string;
  features?: string[] | null;
  is_featured?: boolean | null;
  is_active?: boolean | string | number | null;
  stock_count?: number | null;
  description?: string | null;
  image_url?: string | null;
  original_price?: number | null;
  cost_price?: number | null;
  sku?: string | null;
};

function normalizeBoolean(value: boolean | string | number | null | undefined, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'active'].includes(value.trim().toLowerCase());
  }

  return fallback;
}

function normalizeOptionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return undefined;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

export const CATEGORY_LABELS: Record<Product['category'], string> = {
  sanitary_pads: 'Sanitary Pads',
  baby_diapers: 'Baby Diapers',
  women_care: 'Women Care',
  baby_care: 'Baby Care',
};

export function normalizeProduct(row: ProductRow): Product {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    original_price: normalizeOptionalNumber(row.original_price),
    image_url: row.image_url ?? '',
    features: Array.isArray(row.features) ? row.features.filter(Boolean) : [],
    is_featured: normalizeBoolean(row.is_featured),
    is_active: normalizeBoolean(row.is_active, true),
    stock_count: Number(row.stock_count ?? 0),
    created_at: row.created_at ?? new Date().toISOString(),
    cost_price: normalizeOptionalNumber(row.cost_price),
    sku: row.sku ?? undefined,
  };
}

type FetchProductsOptions = {
  activeOnly?: boolean;
  featuredOnly?: boolean;
  ids?: string[];
};

function hasMissingColumnError(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      ((error as { code?: string }).code === '42703' || (error as { code?: string }).code === 'PGRST204')
  );
}

function applyClientFilters(products: Product[], options: FetchProductsOptions) {
  let filtered = products;

  if (options.ids?.length) {
    filtered = filtered.filter((product) => options.ids?.includes(product.id));
  }

  if (options.activeOnly) {
    filtered = filtered.filter((product) => product.is_active === true);
  }

  if (options.featuredOnly) {
    const featuredProducts = filtered.filter((product) => product.is_featured);

    if (featuredProducts.length > 0) {
      return featuredProducts;
    }

    const fallbackFeaturedProducts = productCatalog.filter((product) => product.is_featured);
    return fallbackFeaturedProducts.length > 0 ? fallbackFeaturedProducts : filtered.slice(0, 2);
  }

  return filtered;
}

export async function fetchProducts(options: FetchProductsOptions = {}) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (options.activeOnly) {
    query = query.eq('is_active', true);
  }

  if (options.featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (options.ids?.length) {
    query = query.in('id', options.ids);
  }

  const { data, error } = await query;

  if (!error) {
    return applyClientFilters(((data ?? []) as ProductRow[]).map(normalizeProduct), options);
  }

  if (!hasMissingColumnError(error)) {
    throw error;
  }

  console.warn('Retrying product fetch without optional Supabase filters:', error);

  let fallbackQuery = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (options.ids?.length) {
    fallbackQuery = fallbackQuery.in('id', options.ids);
  }

  const { data: fallbackData, error: fallbackError } = await fallbackQuery;

  if (fallbackError) {
    console.warn('Falling back to local product catalog:', fallbackError);
    return applyClientFilters(productCatalog, options);
  }

  const normalizedFallbackProducts = ((fallbackData ?? []) as ProductRow[]).map(normalizeProduct);
  return applyClientFilters(normalizedFallbackProducts, options);
}
