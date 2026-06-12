import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { CATEGORY_LABELS, fetchProducts } from '../lib/products';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem } = useCart();
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts({ activeOnly: true });
        setProducts(data);
        setError('');
      } catch (loadError) {
        console.error('Failed to load products:', loadError);
        setError('Products are unavailable right now.');
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const categories = Array.from(new Set(products.map((product) => product.category)));

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <motion.div
      className="bg-black min-h-screen"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-xl text-gray-300">
            Premium sanitary pads curated for everyday comfort and freshness
          </p>
        </motion.div>

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
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="rounded-xl border border-amber-600 bg-gray-900 px-6 py-12 text-center text-gray-300">
            Loading products...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-600 bg-red-950/40 px-6 py-12 text-center text-red-200">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-amber-600 bg-gray-900 px-6 py-12 text-center text-gray-300">
            No products match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                className="group bg-gray-900 border border-amber-600 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-amber-600/50 transition-all transform hover:scale-105 animate-fadeIn"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Image unavailable
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-6">
                  <p className="text-amber-500 text-sm font-semibold mb-2">
                    {CATEGORY_LABELS[product.category]}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-3 leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                  {product.features.length > 0 && (
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
                  )}

                  <div className="flex items-end justify-between mb-3 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-amber-400">₹{product.price}/- INR</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                        )}
                      </div>
                      <p className="text-xs uppercase tracking-[0.24em] text-green-400 mt-1">Discount Price</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center"
                      aria-label={`Add ${product.name} to cart`}
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
              </motion.div>
            ))}
          </div>
        )}

        {/* Bulk Order CTA */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-amber-900 to-black border border-amber-600 rounded-xl p-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
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
        </motion.div>
      </div>
    </motion.div>
  );
}
