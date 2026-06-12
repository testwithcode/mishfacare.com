import { ArrowRight, CheckCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BabyCare() {
  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-slideInLeft order-2 md:order-1">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Gentle Baby Care
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Premium comfort for your precious little ones. Safe, soft, and trusted by parents across India.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative animate-slideInRight order-1 md:order-2">
            <img
              src="/WhatsApp_Image_2026-05-11_at_4.29.57_PM.jpeg"
              alt="Baby Care"
              className="rounded-2xl shadow-2xl border border-amber-600"
            />
          </div>
        </div>
      </section>

      {/* Baby Features */}
      <section className="py-20 border-t border-amber-600 relative">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Mishfa Care Baby Diapers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Ultra-Soft Layers',
                description: 'Gentle on delicate baby skin with premium soft material',
              },
              {
                title: 'High Absorbency',
                description: 'Quick absorption keeps your baby dry and comfortable',
              },
              {
                title: 'Hypoallergenic',
                description: 'Safe for sensitive skin with no harmful chemicals',
              },
              {
                title: 'Wetness Indicator',
                description: 'Visual indicator helps you know when to change diaper',
              },
              {
                title: 'Flexible Fit',
                description: 'Comfortable fit for all body sizes and movements',
              },
              {
                title: 'Breathable Design',
                description: 'Promotes airflow to reduce diaper rash',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-amber-600 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all"
              >
                <Heart className="w-8 h-8 text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Baby Development */}
      <section className="py-20 border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Diapers for Every Stage</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stage: 'Newborn',
                months: '0-3 months',
                description: 'Extra soft and gentle for sensitive newborn skin',
              },
              {
                stage: 'Infant',
                months: '3-6 months',
                description: 'Growing baby needs increased absorbency',
              },
              {
                stage: 'Toddler',
                months: '6-12 months',
                description: 'Active movement requires flexible fit',
              },
              {
                stage: 'Crawler',
                months: '12+ months',
                description: 'Heavy duty for crawling and active play',
              },
            ].map((stage, idx) => (
              <div
                key={idx}
                className="bg-black border border-amber-600 rounded-lg p-6 text-center hover:shadow-lg hover:shadow-amber-600/30 transition-all"
              >
                <h3 className="text-2xl font-bold text-amber-400 mb-2">{stage.stage}</h3>
                <p className="text-sm text-gray-400 mb-3">{stage.months}</p>
                <p className="text-gray-300">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Baby Care Tips */}
      <section className="py-20 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Baby Care Guide</h2>

          <div className="space-y-8">
            {[
              {
                title: 'Diaper Changing Tips',
                tips: [
                  'Change diaper every 2-3 hours or when wet/soiled',
                  'Use gentle wipes and warm water',
                  'Dry the area completely before putting new diaper',
                  'Ensure diaper is snug but not too tight',
                  'Apply diaper cream if needed to prevent rash',
                ],
              },
              {
                title: 'Preventing Diaper Rash',
                tips: [
                  'Change diapers frequently and promptly',
                  'Keep the area clean and dry',
                  'Use breathable diapers like Mishfa Care',
                  'Give your baby diaper-free time daily',
                  'Apply protective cream during nappy changes',
                ],
              },
              {
                title: 'When to Seek Medical Help',
                tips: [
                  'If baby develops severe or persistent rash',
                  'If there are signs of infection or bleeding',
                  'If baby has fever or unusual symptoms',
                  'If rash worsens despite treatment',
                  'Always consult pediatrician for concerns',
                ],
              },
            ].map((section, idx) => (
              <div key={idx} className="bg-gray-900 border border-amber-600 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-amber-500" />
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-red-900 bg-opacity-20 border border-red-600 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Important Health Notice</h3>
            <p className="text-gray-300 mb-4">
              If your baby develops fever, severe diaper rash, signs of infection, or any concerning symptoms, consult a qualified pediatrician immediately.
            </p>
            <p className="text-gray-400 text-sm">
              Mishfa Care products are designed for hygiene and comfort. For any medical concerns, always seek professional medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 border-t border-amber-600 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Our Baby Diaper Range</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Bubbly\'z Newborn Diapers',
                image: '/WhatsApp_Image_2026-05-11_at_4.29.57_PM.jpeg',
                features: ['Extra soft', 'Hypoallergenic', 'Wetness indicator', 'Flexible fit'],
              },
              {
                name: 'Mishfa Care Baby Care Kit',
                image: '/WhatsApp_Image_2026-05-11_at_4.29.58_PM.jpeg',
                features: ['Complete solution', 'Premium quality', 'Value pack', 'Travel friendly'],
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="group bg-black border border-amber-600 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-amber-600/50 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-sm bg-amber-600 bg-opacity-20 text-amber-400 px-3 py-1 rounded border border-amber-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Shop <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Give Your Baby the Best Care</h2>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Shop Baby Care <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
