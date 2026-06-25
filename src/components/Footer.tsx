import { Mail, Phone, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-amber-600">
      <div className="site-container py-12 sm:py-16">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
                 <Link to="/" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  Home
                </Link>
              </li>
              <li>
                 <Link to="/about" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  About Us
                </Link>
              </li>
              <li>
                 <Link to="/products" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  Shop
                </Link>
              </li>
              <li>
                 <Link to="/contact" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                 <Link to="/women-care" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  Women Care
                </Link>
              </li>
              <li>
                 <Link to="/baby-care" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  Baby Care
                </Link>
              </li>
              <li>
                 <Link to="/distributor" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  Become Distributor
                </Link>
              </li>
              <li>
                 <Link to="/#faq" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
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
                <a href="tel:+917990507301" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                  +91 79905 07301
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <a href="mailto:mishfacare@gmail.com" className="focus-ring inline-flex min-h-11 items-center break-all rounded text-gray-400 transition-colors hover:text-amber-400">
                  mishfacare@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <a
                  href="https://www.instagram.com/mishfacare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400"
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
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm md:mt-0">
              <a href="#" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                Privacy Policy
              </a>
              <a href="#" className="focus-ring inline-flex min-h-11 items-center rounded text-gray-400 transition-colors hover:text-amber-400">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
