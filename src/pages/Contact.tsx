import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        .from('contact_messages')
        .insert([formData]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
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
            Get In Touch
          </h1>
          <p className="text-xl text-center text-gray-300 leading-relaxed">
            We're here to help and answer any questions you might have
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 border-t border-amber-600 relative">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Phone,
                title: 'Call Us',
                content: '+91 79905 07301',
                link: 'tel:+919990507301',
              },
              {
                icon: Mail,
                title: 'Email Us',
                content: 'mishfacare@gmail.com',
                link: 'mailto:mishfacare@gmail.com',
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp',
                content: 'Chat with us',
                link: 'https://wa.me/919990507301',
              },
            ].map((contact, idx) => (
              <a
                key={idx}
                href={contact.link}
                target={contact.title === 'WhatsApp' ? '_blank' : undefined}
                rel={contact.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                className="bg-gray-900 border border-amber-600 rounded-xl p-8 hover:shadow-lg hover:shadow-amber-600/30 transition-all text-center cursor-pointer group"
              >
                <contact.icon className="w-12 h-12 text-amber-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                <p className="text-gray-300">{contact.content}</p>
              </a>
            ))}
          </div>

          {/* Address */}
          <div className="bg-gray-900 border border-amber-600 rounded-xl p-8 text-center">
            <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Headquarters</h3>
            <p className="text-gray-300 mb-2">Office No. 10, Nr. Hakim Residency</p>
            <p className="text-gray-300">Sabhool Pura, Nandni, Gujarat 385205</p>
            <p className="text-gray-400 text-sm mt-4">India</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Send Us a Message</h2>

          {success && (
            <div className="mb-8 bg-green-900 bg-opacity-20 border border-green-600 rounded-lg p-4 text-green-400">
              Thank you! Your message has been sent successfully. We'll get back to you soon.
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
                <label className="block text-white font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

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
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Product Inquiry, Distributor Question, Feedback"
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? 'Sending...' : (
                <>
                  Send Message <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-16 border-t border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Response Time',
                description: 'We typically respond within 24 hours',
              },
              {
                title: 'Business Hours',
                description: '9 AM - 6 PM IST, Monday to Saturday',
              },
              {
                title: 'Customer Support',
                description: '24/7 WhatsApp support available',
              },
            ].map((info, idx) => (
              <div key={idx} className="bg-gray-900 border border-amber-600 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-amber-400 mb-2">{info.title}</h3>
                <p className="text-gray-300">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow Us */}
      <section className="py-16 border-t border-amber-600 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Follow Us On Social Media</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/mishfacare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Instagram @mishfacare
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
