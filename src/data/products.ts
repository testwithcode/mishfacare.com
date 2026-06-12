import type { Product } from '../types';

export const productCatalog: Product[] = [
  {
    id: '1',
    category: 'sanitary_pads',
    name: "Bubbly'z Sanitary Pads - Mint Cool (35 Pcs, XXL/XXXL)",
    description: 'Premium sanitary pads with mint cool freshness technology',
    price: 249,
    original_price: 399,
    image_url: '/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg',
    features: ['Mint cool freshness', 'Extra soft', 'Leak lock', '12h protection'],
    is_featured: true,
    is_active: true,
    stock_count: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    category: 'sanitary_pads',
    name: "Bubbly'z Sanitary Pads - Anion Chip (35 Pcs, XXL)",
    description: 'Advanced anion pads for odor neutralization and freshness',
    price: 249,
    original_price: 399,
    image_url: '/WhatsApp_Image_2026-05-17_at_1.23.08_PM.jpeg',
    features: ['Anion chip technology', 'Ultra soft', 'Leak lock', '12h protection'],
    is_featured: true,
    is_active: true,
    stock_count: 100,
    created_at: new Date().toISOString(),
  },
];

export const productCatalogById = Object.fromEntries(
  productCatalog.map((product) => [product.id, product])
);
