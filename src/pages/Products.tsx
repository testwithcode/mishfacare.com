import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { CATEGORY_LABELS, fetchProducts } from '../lib/products';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearchTerm) ||
      product.description.toLowerCase().includes(normalizedSearchTerm) ||
      product.sku?.toLowerCase().includes(normalizedSearchTerm);

    return matchesCategory && matchesSearch;
  });

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
      <div className="site-container section-y">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="heading-section mb-4 font-bold text-white">Shop All Products</h1>
          <p className="text-lg text-gray-300 sm:text-xl">
            Search and filter every live Mishfa Care product in one place
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-12 rounded-xl border border-amber-600 bg-gray-900 p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, description, or SKU"
              className="form-control border border-amber-600 bg-black px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <select
              value={selectedCategory ?? 'all'}
              onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
              className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`focus-ring touch-button rounded-lg px-5 py-2 font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-amber-600 text-white'
                  : 'bg-black text-gray-300 border border-amber-600 hover:border-amber-400'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`focus-ring touch-button rounded-lg px-5 py-2 font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-black text-gray-300 border border-amber-600 hover:border-amber-400'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          {!loading && !error && (
            <p className="mt-4 text-sm text-gray-400">
              Showing {filteredProducts.length} of {products.length} active products
            </p>
          )}
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
            No active products match your search or selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                className="group responsive-card overflow-hidden border border-amber-600 bg-gray-900 transition-all hover:shadow-2xl hover:shadow-amber-600/50 motion-safe:hover:scale-[1.02] animate-fadeIn"
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
                      className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Image unavailable
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-4 sm:p-6">
                  <p className="text-amber-500 text-sm font-semibold mb-2">
                    {CATEGORY_LABELS[product.category]}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-3 leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                   <p className="mb-4 break-words text-sm text-gray-400">{product.description}</p>

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

                   <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="break-words text-xl font-bold text-amber-400 sm:text-2xl">₹{product.price}/- INR</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                        )}
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <p className="text-xs uppercase tracking-[0.24em] text-green-400 mt-1">Sale Price</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                       className="focus-ring touch-button min-w-11 rounded-lg bg-amber-600 p-3 text-white transition-all hover:bg-amber-700 motion-safe:hover:scale-105"
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
                    className="focus-ring touch-button mt-2 w-full gap-2 rounded-lg border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-400 transition-all hover:bg-amber-600 hover:text-black"
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
          className="mt-12 rounded-xl border border-amber-600 bg-gradient-to-r from-amber-900 to-black p-6 text-center sm:mt-16 sm:p-8 lg:mt-20 lg:p-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Interested in Bulk Orders?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get special pricing and dedicated support for wholesale and distributor orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/917990507301"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring touch-button gap-2 rounded-lg bg-green-600 px-8 py-4 font-semibold text-white transition-all hover:bg-green-700"
            >
              WhatsApp for Bulk Orders
            </a>
            <a
              href="mailto:mishfacare@gmail.com"
              className="focus-ring touch-button gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-black transition-all hover:bg-gray-100"
            >
              Email Sales Team
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
