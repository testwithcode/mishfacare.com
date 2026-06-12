import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CreditCard as Edit, Plus, X, AlertCircle, CheckCircle, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { CATEGORY_LABELS, normalizeProduct } from '../lib/products';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_until?: string;
  min_order_amount: number;
  is_active: boolean;
  max_uses?: number;
  used_count?: number;
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Product['category']>('all');

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const emptyProductForm: Partial<Product> = {
    name: '',
    category: 'sanitary_pads',
    price: 0,
    cost_price: 0,
    description: '',
    sku: '',
    stock_count: 0,
    image_url: '',
    is_active: true,
  };

  const [formData, setFormData] = useState<Partial<Product>>(emptyProductForm);

  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponData, setCouponData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    valid_until: '',
    min_order_amount: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('mishfa_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchAllData();

    // Real-time subscriptions
    const productsSubscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchProducts()
      )
      .subscribe();

    const couponsSubscription = supabase
      .channel('coupons-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'coupons' },
        () => fetchCoupons()
      )
      .subscribe();

    return () => {
      productsSubscription.unsubscribe();
      couponsSubscription.unsubscribe();
    };
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCoupons()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(((data ?? []) as Product[]).map(normalizeProduct));
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMsg);
      console.error('Error fetching products:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCoupons(data || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!formData.name || formData.price === undefined || !formData.category) {
        setError('Please fill in all required fields (Name, Price, Category)');
        return;
      }

      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        setImageFile(null);
        setImagePreview('');
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price.toString()),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price.toString()) : null,
        description: formData.description || '',
        sku: formData.sku || '',
        stock_count: parseInt(formData.stock_count?.toString() || '0'),
        image_url: imageUrl || '',
        is_active: formData.is_active ?? true,
      };

      if (editingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (updateError) throw updateError;
        setSuccess('Product updated successfully!');
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);

        if (insertError) throw insertError;
        setSuccess('Product added successfully!');
      }

      setFormData(emptyProductForm);
      setEditingProduct(null);
      setShowAddProduct(false);
      setImagePreview('');
      fetchProducts();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save product';
      setError(errorMsg);
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setError('');
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) throw deleteError;
      setSuccess('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMsg);
      console.error('Error deleting product:', err);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!couponData.code || !couponData.discount_value) {
        setError('Please fill in all required fields (Code, Discount Value)');
        return;
      }

      const { error: insertError } = await supabase.from('coupons').insert([
        {
          code: couponData.code.toUpperCase(),
          discount_type: couponData.discount_type,
          discount_value: parseFloat(couponData.discount_value.toString()),
          min_order_amount: parseFloat(couponData.min_order_amount.toString()),
          valid_until: couponData.valid_until || null,
          is_active: true,
        },
      ]);

      if (insertError) throw insertError;
      setSuccess('Coupon added successfully!');
      setCouponData({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        valid_until: '',
        min_order_amount: 0,
      });
      setShowAddCoupon(false);
      fetchCoupons();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save coupon';
      setError(errorMsg);
      console.error('Error saving coupon:', err);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      setError('');
      const { error: deleteError } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (deleteError) throw deleteError;
      setSuccess('Coupon deleted successfully!');
      fetchCoupons();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete coupon';
      setError(errorMsg);
      console.error('Error deleting coupon:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData(product);
    setEditingProduct(product);
    setShowAddProduct(true);
    if (product.image_url) {
      setImagePreview(product.image_url);
    }
  };

  const handleCancelEdit = () => {
    setFormData(emptyProductForm);
    setEditingProduct(null);
    setShowAddProduct(false);
    setImagePreview('');
    setImageFile(null);
  };

  const handleToggleProductStatus = async (product: Product) => {
    try {
      setError('');
      setSuccess('');

      const { error: updateError } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (updateError) throw updateError;

      setSuccess(`Product marked as ${product.is_active ? 'inactive' : 'active'}.`);
      await fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update product status';
      setError(errorMsg);
      console.error('Error updating product status:', err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? product.is_active : !product.is_active);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Product & Coupon Management</h1>
            <p className="text-gray-400 mt-2">Manage all your products and promotional codes</p>
          </div>
          <button
            onClick={fetchAllData}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-amber-600 flex gap-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'coupons'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
            <p className="text-gray-400 mt-4">Loading data...</p>
          </div>
        ) : activeTab === 'products' ? (
          <div>
            {/* Add Product Button */}
            <button
              onClick={() => {
                setShowAddProduct(true);
                setEditingProduct(null);
                setFormData(emptyProductForm);
                setImagePreview('');
                setImageFile(null);
              }}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold mb-8 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>

            <div className="mb-8 grid gap-4 rounded-xl border border-amber-600 bg-gray-900 p-4 lg:grid-cols-[minmax(0,1fr)_180px_220px]">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by name, SKU, or description"
                className="w-full rounded-lg border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full rounded-lg border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
                className="w-full rounded-lg border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All categories</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-400 lg:col-span-3">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Product Form Modal */}
            {showAddProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-amber-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gray-900 border-b border-amber-600 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Sanitary Pads Pack of 10"
                        className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    {/* Category and Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Category *
                        </label>
                        <select
                          value={formData.category || 'sanitary_pads'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value as Product['category'],
                            })
                          }
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        >
                          <option value="sanitary_pads">Sanitary Pads</option>
                          <option value="baby_diapers">Baby Diapers</option>
                          <option value="women_care">Women Care</option>
                          <option value="baby_care">Baby Care</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          step="0.01"
                          min="0"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Cost Price and SKU Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Cost Price (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.cost_price || ''}
                          onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          step="0.01"
                          min="0"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={formData.sku || ''}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="e.g., SKU-001"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Stock Count */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Stock Count
                        </label>
                        <input
                          type="number"
                          value={formData.stock_count || ''}
                          onChange={(e) => setFormData({ ...formData, stock_count: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          min="0"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Product Status
                        </label>
                        <select
                          value={formData.is_active ? 'active' : 'inactive'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_active: e.target.value === 'active',
                            })
                          }
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Product details..."
                        rows={4}
                        className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Product Image
                      </label>
                      <div className="border-2 border-dashed border-amber-600 rounded-lg p-6 text-center">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-40 mx-auto mb-4 rounded"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={uploading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold transition-all"
                        >
                          <Upload className="w-5 h-5" />
                          {uploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6 border-t border-amber-600">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-900 border border-amber-600 rounded-lg overflow-hidden hover:border-amber-500 transition-all group"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-40 object-cover group-hover:opacity-75 transition-opacity"
                    />
                  )}

                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                      <span
                        className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold ${
                          product.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white font-semibold">{CATEGORY_LABELS[product.category]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-amber-400 font-bold">₹{product.price.toFixed(2)}</span>
                      </div>
                      {product.cost_price && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cost:</span>
                          <span className="text-gray-300">₹{product.cost_price.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stock:</span>
                        <span className={product.stock_count > 0 ? 'text-green-400' : 'text-red-400'}>
                          {product.stock_count} units
                        </span>
                      </div>
                      {product.sku && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">SKU:</span>
                          <span className="text-gray-300 font-mono text-xs">{product.sku}</span>
                        </div>
                      )}
                    </div>

                    {product.description && (
                      <p className="text-gray-400 text-xs mb-4 line-clamp-2">{product.description}</p>
                    )}

                    <div className="grid gap-2 sm:grid-cols-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-all text-sm font-semibold"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleProductStatus(product)}
                        className={`inline-flex items-center justify-center px-3 py-2 rounded transition-all text-sm font-semibold text-white ${
                          product.is_active
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {product.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-all text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {products.length === 0
                    ? 'No products yet. Click "Add New Product" to get started.'
                    : 'No products match the current filters.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Add Coupon Button */}
            <button
              onClick={() => {
                setShowAddCoupon(true);
                setCouponData({
                  code: '',
                  discount_type: 'percentage',
                  discount_value: 0,
                  valid_until: '',
                  min_order_amount: 0,
                });
              }}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold mb-8 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Coupon
            </button>

            {/* Coupon Form Modal */}
            {showAddCoupon && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-amber-600 rounded-lg max-w-lg w-full">
                  <div className="bg-gray-900 border-b border-amber-600 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Add New Coupon</h2>
                    <button
                      onClick={() => setShowAddCoupon(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCoupon} className="p-6 space-y-6">
                    {/* Coupon Code */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        value={couponData.code}
                        onChange={(e) => setCouponData({ ...couponData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g., SAVE10"
                        className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                        required
                      />
                    </div>

                    {/* Discount Type and Value Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Discount Type *
                        </label>
                        <select
                          value={couponData.discount_type}
                          onChange={(e) =>
                            setCouponData({
                              ...couponData,
                              discount_type: e.target.value as 'percentage' | 'fixed',
                            })
                          }
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed (₹)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Discount Value *
                        </label>
                        <input
                          type="number"
                          value={couponData.discount_value || ''}
                          onChange={(e) =>
                            setCouponData({
                              ...couponData,
                              discount_value: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                          step="0.01"
                          min="0"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Minimum Order Amount */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Minimum Order Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={couponData.min_order_amount || ''}
                        onChange={(e) =>
                          setCouponData({
                            ...couponData,
                            min_order_amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Valid Until */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Valid Until
                      </label>
                      <input
                        type="datetime-local"
                        value={couponData.valid_until}
                        onChange={(e) =>
                          setCouponData({ ...couponData, valid_until: e.target.value })
                        }
                        className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6 border-t border-amber-600">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Add Coupon
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCoupon(false)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Coupons List */}
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-gray-900 border border-amber-600 rounded-lg p-6 hover:border-amber-500 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Code</p>
                      <p className="text-white font-bold text-lg font-mono">{coupon.code}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Discount</p>
                      <p className="text-amber-400 font-bold">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}%`
                          : `₹${coupon.discount_value.toFixed(2)}`}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Min Order</p>
                      <p className="text-white">₹{coupon.min_order_amount.toFixed(2)}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          coupon.is_active
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {coupon.valid_until && (
                    <div className="mt-3 pt-3 border-t border-amber-600">
                      <p className="text-gray-400 text-xs">
                        Valid Until: {new Date(coupon.valid_until).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {coupons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No coupons yet. Click "Add New Coupon" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
