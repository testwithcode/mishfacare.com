import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Distributor() {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    city: '',
    state: '',
    business_name: '',
    current_business_type: '',
    monthly_expected_order: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('distributor_applications')
        .insert([formData]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        full_name: '',
        mobile_number: '',
        email: '',
        city: '',
        state: '',
        business_name: '',
        current_business_type: '',
        monthly_expected_order: '',
        message: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-8 leading-tight">
            Become a Mishfa Care Distributor
          </h1>
          <p className="text-xl text-center text-gray-300 leading-relaxed">
            Join our growing network and grow your business with our premium hygiene products
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-amber-600 relative">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why Partner With Mishfa Care?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Premium Brand',
                description: 'Established brand with growing market presence',
              },
              {
                title: 'High Margins',
                description: 'Competitive profit margins for distributors',
              },
              {
                title: 'Marketing Support',
                description: 'Complete marketing materials and support',
              },
              {
                title: 'Dedicated Team',
                description: '24/7 customer and distributor support',
              },
              {
                title: 'Quality Products',
                description: 'Certified and trusted by millions',
              },
              {
                title: 'Training Programs',
                description: 'Comprehensive training for your team',
              },
              {
                title: 'Flexible Orders',
                description: 'No minimum order requirements',
              },
              {
                title: 'Fast Delivery',
                description: 'Reliable and timely order fulfillment',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-amber-600 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all"
              >
                <CheckCircle className="w-6 h-6 text-amber-500 mb-3" />
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Apply Now</h2>

          {success && (
            <div className="mb-8 bg-green-900 bg-opacity-20 border border-green-600 rounded-lg p-4 text-green-400">
              Your application has been submitted successfully! We'll contact you shortly.
            </div>
          )}

          {error && (
            <div className="mb-8 bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Business Name *</label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Current Business Type *</label>
              <input
                type="text"
                name="current_business_type"
                value={formData.current_business_type}
                onChange={handleChange}
                placeholder="e.g., Retail, Wholesale, FMCG, etc."
                required
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Monthly Expected Order *</label>
              <select
                name="monthly_expected_order"
                value={formData.monthly_expected_order}
                onChange={handleChange}
                required
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select range</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000+">₹1,00,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your business and why you want to partner with Mishfa Care..."
                rows={4}
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? 'Submitting...' : (
                <>
                  Submit Application <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Prefer Direct Contact?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Reach out to our distributor relations team directly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/917990507301"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              WhatsApp Us
            </a>
            <a
              href="mailto:mishfacare@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Email Us
            </a>
          </div>
          <p className="text-gray-400 mt-8">
            Phone: +91 79905 07301 | Email: mishfacare@gmail.com
          </p>
        </div>
      </section>
    </div>
  );
}
