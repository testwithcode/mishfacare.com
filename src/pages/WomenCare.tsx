import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WomenCare() {
  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-slideInLeft">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Women Care Excellence
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Designed with understanding. Crafted with care. Trusted by millions of women across India.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative animate-slideInRight">
            <img
              src="/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg"
              alt="Women Care"
              className="rounded-2xl shadow-2xl border border-amber-600"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-amber-600 relative">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why Women Love Mishfa Care</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Ultra Soft Cotton',
                description: 'Made from premium cotton that feels soft and gentle on sensitive skin',
              },
              {
                title: '12-Hour Protection',
                description: 'Reliable protection throughout your day and night with leak lock technology',
              },
              {
                title: 'Anion Chip Technology',
                description: 'Naturally neutralizes odor and keeps you feeling fresh all day',
              },
              {
                title: 'Mint Cool Freshness',
                description: 'Experience cooling freshness with our mint cool technology variant',
              },
              {
                title: 'Dermatologist Tested',
                description: 'Hypoallergenic and safe for all skin types, including sensitive skin',
              },
              {
                title: 'Eco-Friendly Packaging',
                description: 'Discreet and sustainable packaging for easy disposal and environment care',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-amber-600 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all"
              >
                <CheckCircle className="w-8 h-8 text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Variants */}
      <section className="py-20 border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Our Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Bubbly'z Mint Cool",
                image: '/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg',
                description: 'Fresh minty coolness for all-day confidence',
                highlight: 'Mint Cool Freshness',
              },
              {
                name: "Bubbly'z Anion Chip",
                image: '/WhatsApp_Image_2026-05-17_at_1.23.08_PM.jpeg',
                description: 'Advanced odor neutralization technology',
                highlight: 'Anion Technology',
              },
              {
                name: "Bubbly'z Extra Long",
                image: '/WhatsApp_Image_2026-05-17_at_1.17.55_PM.jpeg',
                description: '320mm extra protection for heavy flow',
                highlight: 'Overnight Protection',
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden border border-amber-600 hover:shadow-2xl hover:shadow-amber-600/50 transition-all"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-10 group-hover:translate-y-0 transition-transform">
                  <p className="text-amber-400 text-sm font-semibold mb-2">{product.highlight}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    Shop <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Period Care Guide */}
      <section className="py-20 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Period Care Guide</h2>

          <div className="space-y-6">
            {[
              {
                title: 'Before Your Period',
                tips: [
                  'Keep a supply of pads ready',
                  'Stay hydrated and eat nutritious meals',
                  'Get adequate rest',
                  'Stay active with light exercises',
                ],
              },
              {
                title: 'During Your Period',
                tips: [
                  'Change pads every 4-6 hours or more if needed',
                  'Maintain proper hygiene by washing with water',
                  'Wear loose, comfortable clothing',
                  'Stay hydrated and take care of your nutrition',
                ],
              },
              {
                title: 'After Your Period',
                tips: [
                  'Maintain overall hygiene',
                  'Use gentle cleansers',
                  'Restore your body with iron-rich foods',
                  'Relax and rejuvenate',
                ],
              },
            ].map((section, idx) => (
              <div key={idx} className="bg-gray-900 border border-amber-600 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-amber-600 bg-opacity-20 border border-amber-600 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Health Note</h3>
            <p className="text-gray-300 mb-4">
              If you experience severe pain, heavy bleeding, or any health concerns during your period, please consult a qualified healthcare professional immediately.
            </p>
            <p className="text-gray-400 text-sm">
              Mishfa Care products provide general hygiene and comfort. For medical concerns, always seek professional medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-amber-600 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Trusted by Women</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I love how soft and comfortable these pads are. Finally found a product that works for me!",
                author: 'Priya M.',
              },
              {
                quote: 'The 12-hour protection is amazing. I feel confident wearing these all day and night.',
                author: 'Ananya K.',
              },
              {
                quote: 'Great quality at an affordable price. Definitely recommend Mishfa Care to all my friends.',
                author: 'Reema S.',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-black border border-amber-600 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all">
                <p className="text-amber-400 text-2xl mb-3">"</p>
                <p className="text-gray-300 mb-4 italic">{testimonial.quote}</p>
                <p className="text-amber-500 font-semibold">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Mishfa Care?</h2>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Shop Women Care <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
