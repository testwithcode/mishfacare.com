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
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Add some premium Mishfa Care products to get started
          </p>
          <Link
            to="/products"
            className="focus-ring touch-button gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-white transition-all hover:from-amber-600 hover:to-amber-700 motion-safe:hover:scale-105"
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
      <div className="site-container py-8 sm:py-12">
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
                 className="responsive-card flex flex-col gap-4 border border-amber-600 bg-gray-900 p-4 transition-all hover:shadow-lg hover:shadow-amber-600/30 sm:p-6 lg:flex-row lg:gap-6"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="h-24 w-24 flex-shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 break-words text-xl font-bold text-white">{item.product.name}</h3>
                  <p className="mb-4 break-words text-sm text-gray-400">{item.product.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="break-words text-xl font-bold text-amber-400 sm:text-2xl">₹{item.product.price}/- INR</p>
                    {item.product.original_price && item.product.original_price > item.product.price && (
                      <span className="text-sm text-gray-500 line-through">₹{item.product.original_price}</span>
                    )}
                    {item.product.original_price && item.product.original_price > item.product.price && (
                      <span className="text-xs uppercase tracking-[0.24em] text-green-400">Sale Price</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-stretch justify-between gap-4 sm:items-end">
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    aria-label={`Remove ${item.product.name} from cart`}
                    className="focus-ring touch-button min-w-11 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-600 hover:bg-opacity-20 hover:text-red-700 sm:self-end"
                    title="Remove item from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-600 bg-black sm:justify-start">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="focus-ring min-h-11 min-w-11 rounded-l-lg px-3 py-2 text-amber-400 transition-colors hover:bg-amber-600 hover:text-white"
                      aria-label={`Decrease quantity for ${item.product.name}`}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-4 text-white font-semibold min-w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="focus-ring min-h-11 min-w-11 rounded-r-lg px-3 py-2 text-amber-400 transition-colors hover:bg-amber-600 hover:text-white"
                      aria-label={`Increase quantity for ${item.product.name}`}
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
             <div className="rounded-lg border border-amber-600 bg-gray-900 p-4 sm:p-6 lg:sticky lg:top-24">
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
                className="focus-ring touch-button mb-3 w-full gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-white transition-all hover:from-amber-600 hover:to-amber-700 motion-safe:hover:scale-105"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={handleClearCart}
                className="focus-ring touch-button mb-3 w-full rounded-lg border border-red-600 px-8 py-3 font-semibold text-red-400 transition-all hover:bg-red-600 hover:text-white"
              >
                Clear Cart
              </button>

              <Link
                to="/products"
                className="focus-ring touch-button w-full gap-2 rounded-lg px-8 py-3 font-semibold text-amber-400 transition-colors hover:bg-amber-600 hover:bg-opacity-10 hover:text-amber-300"
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
