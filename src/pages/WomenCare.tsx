import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WomenCare() {
  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="page-hero relative flex items-center justify-center overflow-hidden pb-12">
        <div className="pointer-events-none absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-amber-600 opacity-20 blur-3xl sm:right-10 sm:h-96 sm:w-96"></div>
        </div>

        <div className="site-container relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
          <div className="animate-slideInLeft">
            <h1 className="heading-hero mb-6 font-bold leading-tight text-white">
              Women Care Excellence
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Designed with understanding. Crafted with care. Trusted by millions of women across India.
            </p>
            <Link
              to="/products"
              className="focus-ring touch-button gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-700 motion-safe:hover:scale-105"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative animate-slideInRight">
            <img
              src="/WhatsApp_Image_2026-05-17_at_1.17.15_PM.jpeg"
              alt="Women Care"
              className="w-full rounded-2xl border border-amber-600 object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-y relative border-t border-amber-600">
        <div className="pointer-events-none absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-amber-600 opacity-10 blur-3xl sm:h-96 sm:w-96"></div>
        </div>

        <div className="site-container relative z-10">
          <h2 className="heading-section mb-10 text-center font-bold text-white sm:mb-12">Why Women Love Mishfa Care</h2>

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
                className="responsive-card border border-amber-600 bg-gray-900 p-6 transition-all hover:shadow-lg hover:shadow-amber-600/30"
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
      <section className="section-y border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="site-container">
          <h2 className="heading-section mb-10 text-center font-bold text-white sm:mb-12">Our Collections</h2>

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
                 className="group responsive-card relative overflow-hidden border border-amber-600 transition-all hover:shadow-2xl hover:shadow-amber-600/50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105 sm:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"></div>

                <div className="absolute bottom-0 left-0 right-0 translate-y-0 p-4 transition-transform sm:p-6 md:translate-y-10 md:group-hover:translate-y-0">
                  <p className="text-amber-400 text-sm font-semibold mb-2">{product.highlight}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <Link
                    to="/products"
                    className="focus-ring touch-button gap-2 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white transition-all hover:bg-amber-700"
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
      <section className="section-y border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section mb-10 text-center font-bold text-white sm:mb-12">Period Care Guide</h2>

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
              <div key={idx} className="responsive-card border border-amber-600 bg-gray-900 p-5 sm:p-8">
                <div className="mb-4 flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500"></div>
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
      <section className="section-y border-t border-amber-600 bg-gray-900">
        <div className="site-container">
          <h2 className="heading-section mb-10 text-center font-bold text-white sm:mb-12">Trusted by Women</h2>

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
              <div key={idx} className="responsive-card border border-amber-600 bg-black p-6 transition-all hover:shadow-lg hover:shadow-amber-600/30">
                <p className="text-amber-400 text-2xl mb-3">"</p>
                <p className="text-gray-300 mb-4 italic">{testimonial.quote}</p>
                <p className="text-amber-500 font-semibold">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-amber-600 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Mishfa Care?</h2>
          <Link
            to="/products"
            className="focus-ring touch-button gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-white transition-all hover:from-amber-600 hover:to-amber-700 motion-safe:hover:scale-105"
          >
            Shop Women Care <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
