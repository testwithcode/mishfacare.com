import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const handleRemoveItem = (productId: string) => {
    try {
      removeItem(productId);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        handleRemoveItem(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleClearCart = () => {
    try {
      if (confirm('Are you sure you want to clear your entire cart?')) {
        clearCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Add some premium Mishfa Care products to get started
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  return (
    <div className="bg-black min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-gray-900 border border-amber-600 rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.product.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-2xl font-bold text-amber-400">₹{item.product.price}/- INR</p>
                    {item.product.original_price && item.product.original_price > item.product.price && (
                      <span className="text-sm text-gray-500 line-through">₹{item.product.original_price}</span>
                    )}
                    {item.product.original_price && item.product.original_price > item.product.price && (
                      <span className="text-xs uppercase tracking-[0.24em] text-green-400">Sale Price</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4">
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-600 hover:bg-opacity-20 rounded-lg"
                    title="Remove item from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 border border-amber-600 rounded-lg bg-black">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-2 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-4 text-white font-semibold min-w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-2 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-lg font-bold text-white">
                    ₹{(item.product.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-amber-600 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-amber-600">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping:</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (18%):</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-amber-400">
                  ₹{finalTotal.toFixed(0)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 mb-3"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={handleClearCart}
                className="w-full border border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-2 rounded-lg font-semibold transition-all mb-3"
              >
                Clear Cart
              </button>

              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 hover:bg-amber-600 hover:bg-opacity-10 px-8 py-2 rounded-lg font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
