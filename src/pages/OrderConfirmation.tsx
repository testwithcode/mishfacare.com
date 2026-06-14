import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Phone } from 'lucide-react';

export default function OrderConfirmation() {
  const { sessionId } = useParams();

  return (
    <div className="bg-black min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600 bg-opacity-20 border border-green-600 mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-300 text-lg">
            Thank you for your order. We're excited to deliver your Mishfa Care products.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-900 border border-amber-600 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">#{sessionId?.slice(0, 8).toUpperCase()}</div>
              <p className="text-gray-400">Order ID</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Confirmed</div>
              <p className="text-gray-400">Status</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">1-2 Days</div>
              <p className="text-gray-400">Processing</p>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-900 border border-amber-600 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>

          <div className="space-y-6">
            {[
              {
                icon: Package,
                title: 'Order Processing',
                description: 'Your order is being processed and will be packed carefully.',
                time: 'Within 24 hours',
              },
              {
                icon: Truck,
                title: 'Shipping',
                description: 'Your package will be shipped with tracking information.',
                time: 'Within 2-3 days',
              },
              {
                icon: CheckCircle,
                title: 'Delivery',
                description: 'Your order arrives at your doorstep with care.',
                time: 'Within 5-7 days',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-600 bg-opacity-20 border border-amber-600">
                    <step.icon className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                  <p className="text-amber-500 text-xs font-semibold">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-amber-900 to-black border border-amber-600 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Check your email for order confirmation and tracking details
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Save your Order ID: <span className="font-bold text-amber-400">#{sessionId?.slice(0, 8).toUpperCase()}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              You'll receive shipping updates via SMS and email
            </li>
            <li className="flex items items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Contact us if you have any questions
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 border border-amber-600 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Phone className="w-6 h-6 text-amber-500" />
            Need Help?
          </h2>

          <p className="text-gray-300 mb-6">
            Our customer support team is here to assist you with any questions about your order.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/917990507301"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              WhatsApp Support
            </a>
            <a
              href="mailto:mishfacare@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex-1"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 border border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black px-8 py-4 rounded-lg font-semibold transition-all flex-1"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
