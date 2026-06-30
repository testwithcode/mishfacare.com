import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Trash2, CreditCard as Edit, Plus, X, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { CATEGORY_LABELS, normalizeProduct } from '../lib/products';
import AdminLayout from '../components/AdminLayout';

function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;

  if (err && typeof err === 'object') {
    const supabaseError = err as { message?: string; details?: string; hint?: string; code?: string };
    return [supabaseError.message, supabaseError.details, supabaseError.hint, supabaseError.code]
      .filter(Boolean)
      .join(' ') || fallback;
  }

  return fallback;
}

function isMissingColumnError(err: unknown) {
  return Boolean(
    err &&
      typeof err === 'object' &&
      'code' in err &&
      ((err as { code?: string }).code === '42703' || (err as { code?: string }).code === 'PGRST204')
  );
}

function getMissingSchemaColumn(err: unknown) {
  const message = getErrorMessage(err, '');
  return message.match(/'([^']+)' column/)?.[1];
}

function omitProductColumn<T extends Record<string, unknown>>(payload: T, column: string) {
  const { [column]: _omitted, ...remainingPayload } = payload;
  return remainingPayload;
}

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
  const [supportsProductStatus, setSupportsProductStatus] = useState(true);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [updatingProductStatusId, setUpdatingProductStatusId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const emptyProductForm: Partial<Product> = {
    name: '',
    category: 'sanitary_pads',
    price: 0,
    original_price: undefined,
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
      const errorMsg = getErrorMessage(err, 'Failed to load products');
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
      const price = Number(formData.price);
      const originalPrice =
        formData.original_price === undefined || formData.original_price === null
          ? undefined
          : Number(formData.original_price);
      const costPrice =
        formData.cost_price === undefined || formData.cost_price === null
          ? undefined
          : Number(formData.cost_price);

      if (!formData.name || formData.price === undefined || !formData.category) {
        setError('Please fill in all required fields (Name, Price, Category)');
        return;
      }

      if (!Number.isFinite(price) || price < 0) {
        setError('Please enter a valid selling price.');
        return;
      }

      if (originalPrice !== undefined && (!Number.isFinite(originalPrice) || originalPrice < 0)) {
        setError('Please enter a valid original price or leave it empty.');
        return;
      }

      if (costPrice !== undefined && (!Number.isFinite(costPrice) || costPrice < 0)) {
        setError('Please enter a valid cost price or leave it empty.');
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
        price,
        original_price: originalPrice ?? null,
        cost_price: costPrice ?? null,
        description: formData.description || '',
        sku: formData.sku || '',
        stock_count: parseInt(formData.stock_count?.toString() || '0'),
        image_url: imageUrl || '',
      };

      const productPayload = supportsProductStatus
        ? { ...productData, is_active: formData.is_active ?? true }
        : productData;

      const saveProduct = async (payload: typeof productPayload) => {
        let currentPayload = payload;

        for (let attempt = 0; attempt < 4; attempt += 1) {
          const result = editingProduct
            ? await supabase.from('products').update(currentPayload).eq('id', editingProduct.id)
            : await supabase.from('products').insert([currentPayload]);

          if (!result.error || !isMissingColumnError(result.error)) return result.error;

          const missingColumn = getMissingSchemaColumn(result.error);
          if (!missingColumn || !(missingColumn in currentPayload)) return result.error;

          if (missingColumn === 'is_active') {
            setSupportsProductStatus(false);
            setStatusFilter('all');
          }

          currentPayload = omitProductColumn(currentPayload, missingColumn) as typeof productPayload;
        }

        return new Error('Product could not be saved because required database columns are missing.');
      };

      if (editingProduct) {
        const updateError = await saveProduct(productPayload);

        if (updateError) throw updateError;
        setSuccess('Product updated successfully!');
      } else {
        const insertError = await saveProduct(productPayload);

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
      const errorMsg = getErrorMessage(err, 'Failed to save product');
      setError(errorMsg);
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productPendingDelete) return;

    const productToDelete = productPendingDelete;

    try {
      setError('');
      setSuccess('');
      setDeletingProductId(productToDelete.id);

      const { data: deletedProducts, error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id)
        .select('id');

      if (deleteError) throw deleteError;

      if (!deletedProducts || deletedProducts.length === 0) {
        throw new Error('Product was not found or could not be deleted.');
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productToDelete.id)
      );
      setProductPendingDelete(null);
      setSuccess('Product deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Failed to delete product');
      setError(errorMsg);
      console.error('Error deleting product:', err);
    } finally {
      setDeletingProductId(null);
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

      const couponPayload = {
        code: couponData.code.toUpperCase(),
        discount_type: couponData.discount_type,
        discount_value: parseFloat(couponData.discount_value.toString()),
        min_order_amount: parseFloat(couponData.min_order_amount.toString()),
        valid_until: couponData.valid_until || null,
      };

      let { error: insertError } = await supabase.from('coupons').insert([
        { ...couponPayload, is_active: true },
      ]);

      if (insertError && isMissingColumnError(insertError)) {
        const retryResult = await supabase.from('coupons').insert([couponPayload]);
        insertError = retryResult.error;
      }

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
      const errorMsg = getErrorMessage(err, 'Failed to save coupon');
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
      const errorMsg = getErrorMessage(err, 'Failed to delete coupon');
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
    const nextStatus = !product.is_active;

    try {
      setError('');
      setSuccess('');
      setUpdatingProductStatusId(product.id);

      const { data: updatedProducts, error: updateError } = await supabase
        .from('products')
        .update({ is_active: nextStatus })
        .eq('id', product.id)
        .select('id');

      if (updateError) {
        if (isMissingColumnError(updateError)) {
          setSupportsProductStatus(false);
          setStatusFilter('all');
          setError('Product status is not enabled in Supabase yet. Run the is_active column migration, then refresh this page.');
          return;
        }

        throw updateError;
      }

      if (!updatedProducts || updatedProducts.length === 0) {
        throw new Error('Product status could not be saved. Check Supabase product update policies, then try again.');
      }

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? normalizeProduct({ ...currentProduct, is_active: nextStatus })
            : currentProduct
        )
      );
      setSuccess(`Product marked as ${nextStatus ? 'active' : 'inactive'}.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Failed to update product status');
      setError(errorMsg);
      console.error('Error updating product status:', err);
    } finally {
      setUpdatingProductStatusId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus =
      !supportsProductStatus ||
      statusFilter === 'all' ||
      (statusFilter === 'active' ? product.is_active : !product.is_active);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <AdminLayout
      title="Product & Coupon Management"
      description="Manage all your products and promotional codes"
      onRefresh={fetchAllData}
      refreshing={loading}
    >
        {/* Header */}
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

            <div className={`mb-8 grid gap-4 rounded-xl border border-amber-600 bg-gray-900 p-4 ${supportsProductStatus ? 'lg:grid-cols-[minmax(0,1fr)_180px_220px]' : 'lg:grid-cols-[minmax(0,1fr)_220px]'}`}>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by name, SKU, or description"
                className="w-full rounded-lg border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {supportsProductStatus && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full rounded-lg border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active only</option>
                  <option value="inactive">Inactive only</option>
                </select>
              )}
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
              <div className={`text-sm text-gray-400 ${supportsProductStatus ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          value={formData.price ?? ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: e.target.value === '' ? undefined : Number(e.target.value),
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

                    {/* Original Price and Cost Price Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Original Price / MRP (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.original_price ?? ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              original_price: e.target.value === '' ? undefined : Number(e.target.value),
                            })
                          }
                          placeholder="Optional"
                          step="0.01"
                          min="0"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Cost Price (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.cost_price ?? ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cost_price: e.target.value === '' ? undefined : Number(e.target.value),
                            })
                          }
                          placeholder="Optional"
                          step="0.01"
                          min="0"
                          className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                    </div>

                    {/* SKU and Stock Count */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                    </div>

                    {/* Product Status */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      {supportsProductStatus && <div>
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
                      </div>}
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
                    <div className="flex flex-col gap-4 border-t border-amber-600 pt-6 sm:flex-row">
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

            {productPendingDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
                <div className="w-full max-w-md rounded-lg border border-red-600 bg-gray-900 p-6 shadow-xl">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Delete product?</h2>
                      <p className="mt-2 text-gray-400">
                        This will permanently delete{' '}
                        <span className="font-semibold text-white">{productPendingDelete.name}</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => setProductPendingDelete(null)}
                      disabled={deletingProductId === productPendingDelete.id}
                      className="text-gray-400 transition-colors hover:text-white disabled:opacity-50"
                      aria-label="Close delete confirmation"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="rounded-lg border border-red-700 bg-red-950/30 p-4 text-sm text-red-200">
                    Delete cannot be undone. If this product is referenced by existing orders, Supabase may block deletion.
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setProductPendingDelete(null)}
                      disabled={deletingProductId === productPendingDelete.id}
                      className="flex-1 rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteProduct}
                      disabled={deletingProductId === productPendingDelete.id}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-5 w-5" />
                      {deletingProductId === productPendingDelete.id ? 'Deleting...' : 'Delete Product'}
                    </button>
                  </div>
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
                      {supportsProductStatus && (
                        <span
                          className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold ${
                            product.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white font-semibold">{CATEGORY_LABELS[product.category]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Selling Price:</span>
                        <span className="text-amber-400 font-bold">₹{product.price.toFixed(2)}</span>
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Original/MRP:</span>
                          <span className="text-gray-300 line-through">₹{product.original_price.toFixed(2)}</span>
                        </div>
                      )}
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

                    <div className={`grid gap-2 ${supportsProductStatus ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-all text-sm font-semibold"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      {supportsProductStatus && (
                        <button
                          onClick={() => handleToggleProductStatus(product)}
                          disabled={updatingProductStatusId === product.id}
                          className={`inline-flex items-center justify-center px-3 py-2 rounded transition-all text-sm font-semibold text-white ${
                            product.is_active
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-green-600 hover:bg-green-700'
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {updatingProductStatusId === product.id
                            ? 'Saving...'
                            : product.is_active
                              ? 'Deactivate'
                              : 'Activate'}
                        </button>
                      )}
                      <button
                        onClick={() => setProductPendingDelete(product)}
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
    </AdminLayout>
  );
}
