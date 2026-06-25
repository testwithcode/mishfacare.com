import { useState } from 'react';
import { ArrowRight, CheckCircle, Lock, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { buildWhatsAppOrderMessage, getWhatsAppUrl } from '../lib/whatsapp';
import WhatsAppIcon from '../components/WhatsAppIcon';

function isSchemaCacheColumnError(err: unknown) {
  return Boolean(
    err &&
      typeof err === 'object' &&
      'code' in err &&
      ((err as { code?: string }).code === 'PGRST204' || (err as { code?: string }).code === '42703')
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cod',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === 'percentage') {
      return Math.round(total * (appliedCoupon.discount_value / 100));
    }
    return appliedCoupon.discount_value;
  };

  const discountAmount = calculateDiscount();
  const subtotalAfterDiscount = total - discountAmount;
  const tax = Math.round(subtotalAfterDiscount * 0.18);
  const finalTotal = subtotalAfterDiscount + tax;
  const whatsappOrderUrl = getWhatsAppUrl(
    buildWhatsAppOrderMessage(items, finalTotal, formData, {
      subtotal: total,
      discountAmount,
      tax,
      finalTotal,
      appliedCouponCode: appliedCoupon?.code || null,
    })
  );

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError && !isSchemaCacheColumnError(fetchError)) throw fetchError;

      let coupon = data;

      if (fetchError && isSchemaCacheColumnError(fetchError)) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase())
          .maybeSingle();

        if (fallbackError) throw fallbackError;
        coupon = fallbackData;
      }

      if (!coupon) {
        setCouponError('Invalid coupon code');
        return;
      }

      if ('is_active' in coupon && coupon.is_active === false) {
        setCouponError('Coupon is inactive');
        return;
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        setCouponError('Coupon has expired');
        return;
      }

      if (coupon.min_order_amount && total < coupon.min_order_amount) {
        setCouponError(`Minimum order amount is ₹${coupon.min_order_amount}`);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode('');
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const sessionId = Math.random().toString(36).substring(2, 15);

      const baseOrderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        total_amount: finalTotal,
        status: 'confirmed',
      };

      const orderData = {
        ...baseOrderData,
        discount_amount: discountAmount,
        applied_coupon: appliedCoupon?.code || null,
        customer_session_id: sessionId,
      };

      const { error: insertError } = await supabase.from('orders').insert([orderData]);

      if (insertError) {
        if (!isSchemaCacheColumnError(insertError)) throw insertError;

        const fallbackOrderData = {
          ...baseOrderData,
          items: [
            ...baseOrderData.items,
            {
              type: 'order_metadata',
              customer_session_id: sessionId,
              discount_amount: discountAmount,
              applied_coupon: appliedCoupon?.code || null,
              subtotal: total,
              tax,
            },
          ],
        };

        const { error: fallbackInsertError } = await supabase.from('orders').insert([fallbackOrderData]);
        if (fallbackInsertError) throw fallbackInsertError;
      }

      setSuccess(true);
      clearCart();

      setTimeout(() => {
        navigate(`/order-confirmation/${sessionId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-black min-h-screen pt-20"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="site-container py-8 sm:py-12">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Checkout</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 sm:gap-4">
            <Link to="/cart" className="focus-ring rounded hover:text-amber-400">
              Cart
            </Link>
            <span className="text-gray-600">›</span>
            <span className="text-amber-400">Checkout</span>
            <span className="text-gray-600">›</span>
            <span>Confirmation</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {success && (
              <div className="mb-8 bg-green-900 bg-opacity-20 border border-green-600 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <p className="text-green-400">Order placed successfully! Redirecting...</p>
              </div>
            )}

            {error && (
              <div className="mb-8 bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Coupon Section */}
             <div className="mb-8 rounded-lg border border-amber-600 bg-gradient-to-r from-amber-900 to-black p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-white">Apply Coupon Code</h3>
              </div>

              {appliedCoupon ? (
                 <div className="flex flex-col gap-4 rounded-lg border border-green-600 bg-green-600 bg-opacity-20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 break-words">
                    <p className="text-white font-bold">Coupon Applied!</p>
                    <p className="text-green-300">Code: {appliedCoupon.code}</p>
                    <p className="text-green-300">
                      Save: ₹{discountAmount} ({appliedCoupon.discount_type === 'percentage' ? appliedCoupon.discount_value + '%' : '₹' + appliedCoupon.discount_value})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponError('');
                    }}
                    className="focus-ring touch-button self-start rounded px-3 py-2 font-semibold text-red-400 hover:text-red-300 sm:self-auto"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Enter coupon code"
                    className="form-control flex-1 border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="focus-ring touch-button rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition-all hover:bg-amber-700 disabled:bg-gray-600"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
              )}

              {couponError && <p className="text-red-400 text-sm mt-2">{couponError}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="rounded-lg border border-amber-600 bg-gray-900 p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                         className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        required
                         className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      required
                       className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-lg border border-amber-600 bg-gray-900 p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Delivery Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address"
                      required
                       className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                         className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                         className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                         className="form-control border border-amber-600 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-lg border border-amber-600 bg-gray-900 p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-amber-500" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery (COD)' },
                    { value: 'upi', label: 'UPI Payment' },
                    { value: 'card', label: 'Credit/Debit Card' },
                  ].map((method) => (
                    <label key={method.value} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-amber-600 bg-black p-4 transition-colors hover:border-amber-400">
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={formData.payment_method === method.value}
                        onChange={handleChange}
                        className="w-5 h-5 accent-amber-500"
                      />
                       <span className="break-words font-semibold text-white">{method.label}</span>
                    </label>
                  ))}
                </div>

                {formData.payment_method === 'cod' && (
                  <div className="mt-4 bg-amber-600 bg-opacity-20 border border-amber-600 rounded-lg p-4 text-amber-400 text-sm">
                    You'll pay ₹{finalTotal.toFixed(0)} when your order is delivered.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="focus-ring touch-button w-full gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 motion-safe:hover:scale-105"
                >
                  {loading ? 'Processing Order...' : 'Place Order'} {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring touch-button w-full gap-3 rounded-lg bg-green-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-green-700"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Order on WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
             <div className="rounded-lg border border-amber-600 bg-gray-900 p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-amber-600 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex min-w-0 justify-between gap-3 text-sm text-gray-300">
                    <span className="min-w-0 break-words">{item.product.name} x {item.quantity}</span>
                    <span className="shrink-0">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-amber-600">
                <div className="flex justify-between gap-3 text-gray-300">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between gap-3 font-semibold text-green-400">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-3 text-gray-300">
                  <span>Subtotal after discount:</span>
                  <span>₹{subtotalAfterDiscount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between gap-3 text-gray-300">
                  <span>Shipping:</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between gap-3 text-gray-300">
                  <span>Tax (18%):</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-amber-400">₹{finalTotal.toFixed(0)}</span>
              </div>

              <Link
                to="/cart"
                className="focus-ring touch-button mt-6 w-full gap-2 rounded-lg px-4 py-3 font-semibold text-amber-400 transition-colors hover:text-amber-300"
              >
                Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
