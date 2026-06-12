import { useState } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const products = [
  {
    id: '1',
    name: "Bubbly'z Sanitary Pads - Mint Cool (35 Pcs, XXL/XXXL)",
    category: 'Women Care',
    price: 399,
    image_url: '/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg',
    features: ['Mint cool freshness', 'Extra soft', 'Leak lock', '12h protection'],
    description: 'Premium sanitary pads with mint cool freshness technology',
  },
  {
    id: '2',
    name: "Bubbly'z Sanitary Pads - Anion Chip (35 Pcs, XXL)",
    category: 'Women Care',
    price: 399,
    image_url: '/WhatsApp_Image_2026-05-17_at_1.23.08_PM.jpeg',
    features: ['Anion chip technology', 'Ultra soft', 'Leak lock', '12h protection'],
    description: 'Advanced anion pads for odor neutralization and freshness',
  },
  {
    id: '3',
    name: 'Bubbly\'z Premium Baby Diapers (Newborn)',
    category: 'Baby Care',
    price: 299,
    image_url: '/WhatsApp_Image_2026-05-11_at_4.29.57_PM.jpeg',
    features: ['Hypoallergenic', 'High absorbency', 'Soft layers', 'Flexible fit'],
    description: 'Gentle and protective baby diapers for newborns',
  },
  {
    id: '4',
    name: 'Mishfa Care Feminine Hygiene Kit',
    category: 'Women Care',
    price: 599,
    image_url: '/WhatsApp_Image_2026-05-11_at_4.29.58_PM.jpeg',
    features: ['Complete solution', 'Travel friendly', 'Premium quality', 'Value pack'],
    description: 'Complete feminine hygiene essentials in one premium kit',
  },
  {
    id: '5',
    name: "Bubbly'z Sanitary Pads - Extra Long (320mm)",
    category: 'Women Care',
    price: 449,
    image_url: '/WhatsApp_Image_2026-05-17_at_1.17.55_PM.jpeg',
    features: ['Extra long protection', 'Super absorbent', 'Anion strip', 'Overnight protection'],
    description: 'Extra long pads for maximum coverage and overnight protection',
  },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem, items } = useCart();
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({});

  const categories = ['Women Care', 'Baby Care'];

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleAddToCart = (product: (typeof products)[0]) => {
    const fullProduct = {
      id: product.id,
      category: product.category as 'sanitary_pads' | 'baby_diapers' | 'women_care' | 'baby_care',
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      features: product.features,
      is_featured: false,
      stock_count: 100,
      created_at: new Date().toISOString(),
    };
    addItem(fullProduct, 1);
    setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-xl text-gray-300">
            Premium hygiene products for women and babies
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-amber-600 text-white'
                : 'bg-gray-900 text-gray-300 border border-amber-600 hover:border-amber-400'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-900 text-gray-300 border border-amber-600 hover:border-amber-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className="group bg-gray-900 border border-amber-600 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-amber-600/50 transition-all transform hover:scale-105 animate-fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-6">
                <p className="text-amber-500 text-sm font-semibold mb-2">{product.category}</p>
                <h3 className="text-lg font-bold text-white mb-3 leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-800 text-amber-400 px-2 py-1 rounded border border-amber-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-amber-400">₹{product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>

                {addedProducts[product.id] && (
                  <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded px-3 py-2 text-center animate-pulse">
                    <p className="text-green-400 text-sm font-semibold">
                      Added to cart ✓
                    </p>
                  </div>
                )}

                <Link
                  to="/cart"
                  className="w-full inline-flex items-center justify-center gap-2 border border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black px-4 py-2 rounded-lg font-semibold transition-all text-sm mt-2"
                >
                  View Cart
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Order CTA */}
        <div className="mt-20 bg-gradient-to-r from-amber-900 to-black border border-amber-600 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in Bulk Orders?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get special pricing and dedicated support for wholesale and distributor orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919990507301"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              WhatsApp for Bulk Orders
            </a>
            <a
              href="mailto:mishfacare@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Email Sales Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
