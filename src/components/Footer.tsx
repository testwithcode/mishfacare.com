import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-amber-400 font-bold text-lg mb-4">Mishfa Care</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Gentle Care for Women & Babies. Trusted hygiene products for Indian families.
            </p>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/women-care" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Women Care
                </Link>
              </li>
              <li>
                <Link to="/baby-care" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Baby Care
                </Link>
              </li>
              <li>
                <Link to="/distributor" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Become Distributor
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-gray-400 hover:text-amber-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <a href="tel:+919990507301" className="text-gray-400 hover:text-amber-400 transition-colors">
                  +91 79905 07301
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <a href="mailto:mishfacare@gmail.com" className="text-gray-400 hover:text-amber-400 transition-colors">
                  mishfacare@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <a
                  href="https://www.instagram.com/mishfacare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  @mishfacare
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; 2026 Mishfa Care. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
