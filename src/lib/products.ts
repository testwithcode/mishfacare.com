import type { Product } from '../types';
import { supabase } from './supabase';

type ProductRow = Partial<Product> & {
  id: string;
  category: Product['category'];
  name: string;
  price: number;
  created_at?: string;
  features?: string[] | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
  stock_count?: number | null;
  description?: string | null;
  image_url?: string | null;
  original_price?: number | null;
  cost_price?: number | null;
  sku?: string | null;
};

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
    original_price:
      typeof row.original_price === 'number' ? row.original_price : undefined,
    image_url: row.image_url ?? '',
    features: Array.isArray(row.features) ? row.features.filter(Boolean) : [],
    is_featured: Boolean(row.is_featured),
    is_active: row.is_active ?? true,
    stock_count: Number(row.stock_count ?? 0),
    created_at: row.created_at ?? new Date().toISOString(),
    cost_price: typeof row.cost_price === 'number' ? row.cost_price : undefined,
    sku: row.sku ?? undefined,
  };
}

type FetchProductsOptions = {
  activeOnly?: boolean;
  featuredOnly?: boolean;
  ids?: string[];
};

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

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProductRow[]).map(normalizeProduct);
}
