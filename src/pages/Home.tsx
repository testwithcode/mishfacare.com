import { ArrowRight, Heart, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productCatalog } from '../data/products';

const featuredProducts = productCatalog.map((product) => ({
  ...product,
  categoryLabel: 'Women Care',
}));

export default function Home() {
  const [imageIndex, setImageIndex] = useState(0);
  const heroImages = [
    '/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg',
    '/WhatsApp_Image_2026-05-17_at_1.17.55_PM.jpeg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 animate-pulse">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-800 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            className="animate-slideInLeft"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Gentle Care for Women & Babies
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Premium hygiene products crafted with love for Indian families. Soft, safe, and dignified care for every moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Our Story
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative animate-slideInRight"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-600 shadow-2xl">
              <img
                src={heroImages[imageIndex]}
                alt="Mishfa Care Products"
                className="w-full h-full object-cover transition-opacity duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <motion.section
        className="py-16 border-t border-amber-600 relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose Mishfa Care
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Premium Quality',
                description: 'Soft as cotton, crafted with care for maximum comfort',
              },
              {
                icon: Shield,
                title: 'Maximum Protection',
                description: '12+ hours protection with leak lock technology',
              },
              {
                icon: Sparkles,
                title: 'Confidence & Dignity',
                description: 'Empowering women and babies with trustworthy care',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-amber-600 rounded-xl p-8 hover:shadow-2xl hover:shadow-amber-600/50 transition-all transform hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <feature.icon className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        className="py-20 border-t border-amber-600"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-gray-400 text-lg">Our bestselling premium care products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                className="group bg-gray-900 border border-amber-600 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-amber-600/50 transition-all transform hover:scale-105 animate-fadeIn"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4">
                  <p className="text-amber-500 text-sm font-semibold mb-2">{product.categoryLabel}</p>
                  <h3 className="text-white font-bold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex justify-between items-end gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-amber-400">₹{product.price}/- INR</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                        )}
                      </div>
                      <p className="text-xs uppercase tracking-[0.24em] text-green-400 mt-1">Discount Price</p>
                    </div>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors" aria-label={`Open ${product.name}`}>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Women Care Section */}
      <motion.section
        className="py-20 border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-4xl font-bold text-white mb-6">Women Care Excellence</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Our women care range is designed with understanding and care for every woman's needs.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Ultra-soft cotton material',
                  '12-hour protection guarantee',
                  'Anion chip technology',
                  'Mint cool freshness',
                  '100% safe & dermatologically tested',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/women-care"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Explore Women Care <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative animate-slideInRight">
              <img
                src="/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg"
                alt="Women Care"
                className="rounded-xl shadow-2xl border border-amber-600"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Baby Care Section */}
      <section className="py-20 border-t border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative animate-slideInLeft order-2 md:order-1">
              <img
                src="/WhatsApp_Image_2026-05-11_at_4.29.57_PM.jpeg"
                alt="Baby Care"
                className="rounded-xl shadow-2xl border border-amber-600"
              />
            </div>
            <div className="animate-slideInRight order-1 md:order-2">
              <h2 className="text-4xl font-bold text-white mb-6">Gentle Baby Care</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Premium baby diapers that keep your little ones comfortable and protected all day and night.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Hypoallergenic & dermatologist tested',
                  'High absorbency capacity',
                  'Breathable layers for comfort',
                  'Wetness indicator technology',
                  'Flexible fit for all sizes',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/baby-care"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Explore Baby Care <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Distributor CTA */}
      <motion.section
        className="py-20 border-t border-amber-600 bg-gradient-to-r from-amber-900 to-black relative overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Become a Mishfa Care Distributor</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our growing network of distributors across India. Grow your business with our premium products and dedicated support.
          </p>
          <Link
            to="/distributor"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        className="py-20 border-t border-amber-600"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: 'Are Mishfa Care products made in India?',
                a: 'Yes, Mishfa Care products are proudly manufactured in India following international quality standards and safety certifications.',
              },
              {
                q: 'Do your products contain harmful chemicals?',
                a: 'No, our products are dermatologically tested and contain no harmful chemicals. They are made with soft, safe, and natural materials.',
              },
              {
                q: 'What is the anion chip technology?',
                a: 'Anion chip technology helps neutralize odor naturally and keeps you feeling fresh throughout the day.',
              },
              {
                q: 'Are these products suitable for sensitive skin?',
                a: 'Yes, our products are hypoallergenic and dermatologist tested, making them suitable for sensitive skin.',
              },
              {
                q: 'How can I become a distributor?',
                a: 'You can fill out our online distributor application form. Our team will review your application and contact you within 3-5 business days.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-900 border border-amber-600 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all">
                <h3 className="text-xl font-bold text-amber-400 mb-3">{item.q}</h3>
                <p className="text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        className="py-16 border-t border-amber-600 bg-black"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
          <p className="text-gray-300 mb-8">
            Our customer service team is ready to assist you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919990507301"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Chat on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
