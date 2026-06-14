import { CheckCircle, Heart, Target, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-8 leading-tight">
            Our Brand Story
          </h1>
          <p className="text-xl text-center text-gray-300 leading-relaxed">
            Mishfa Care is created with a vision to provide reliable, comfortable, and caring hygiene products for women and babies across India.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 border-t border-amber-600 relative">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-900 border border-amber-600 rounded-xl p-8">
              <Target className="w-12 h-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                To become the most trusted hygiene brand in India, known for our commitment to quality, care, and the dignity of every woman and baby. We envision a society where premium hygiene products are accessible to all families.
              </p>
            </div>

            <div className="bg-gray-900 border border-amber-600 rounded-xl p-8">
              <Heart className="w-12 h-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To deliver premium, safe, and comfortable hygiene products that empower women and ensure the best care for babies. We're committed to innovation, sustainability, and creating positive impact in every family we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 border-t border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Softness',
                description: 'Gentle on skin, comfortable all day',
              },
              {
                title: 'Safety',
                description: 'Dermatologist tested, zero harmful chemicals',
              },
              {
                title: 'Dignity',
                description: 'Empowering women with confidence',
              },
              {
                title: 'Reliability',
                description: '12+ hours protection you can trust',
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900 to-black border border-amber-600 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-600/30 transition-all text-center"
              >
                <h3 className="text-xl font-bold text-amber-400 mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 border-t border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Meet the Founders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                name: 'Saad Memon',
                role: 'Co-Founder & CEO',
                description:
                  'Saad brings over 15 years of experience in consumer goods and brand development. His vision for accessible premium hygiene products drives Mishfa Care forward.',
              },
              {
                name: 'Hami Memon',
                role: 'Co-Founder & Operations',
                description:
                  'Hami is passionate about quality and customer satisfaction. Leading operations and supply chain, Hami ensures every product meets our highest standards.',
              },
            ].map((founder, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-amber-600 rounded-xl p-8 text-center hover:shadow-xl hover:shadow-amber-600/30 transition-all"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
                <p className="text-amber-400 font-semibold mb-4">{founder.role}</p>
                <p className="text-gray-300">{founder.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Started */}
      <section className="py-20 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why We Started Mishfa Care</h2>

          <div className="space-y-6">
            {[
              {
                title: 'Gap in the Market',
                description:
                  'We identified a significant gap for premium, trustworthy hygiene products that prioritize comfort, safety, and dignity.',
              },
              {
                title: 'Empowering Women',
                description:
                  'Women deserve products that enable them to feel confident, comfortable, and cared for in every situation.',
              },
              {
                title: 'Baby Care Excellence',
                description:
                  'Parents deserve premium quality baby care products that prioritize comfort and protection for their precious ones.',
              },
              {
                title: 'Made in India',
                description:
                  'We wanted to create world-class products manufactured in India that compete globally while supporting local economy.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 border-t border-amber-600 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Quality Assurance</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              'Dermatologically Tested',
              'ISO Certified Manufacturing',
              'Government Approved',
            ].map((cert, idx) => (
              <div key={idx} className="bg-black border border-amber-600 rounded-lg p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl font-semibold text-amber-400">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 border-t border-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Want to Learn More?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get in touch with our team for any questions about Mishfa Care
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
        </div>
      </section>
    </div>
  );
}
