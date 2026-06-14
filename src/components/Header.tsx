import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import WhatsAppIcon from './WhatsAppIcon';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Shop', to: '/products' },
    { label: 'Women Care', to: '/women-care' },
    { label: 'Baby Care', to: '/baby-care' },
    { label: 'Distributor', to: '/distributor' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-95 backdrop-blur-sm border-b border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Mishfa
            </div>
            <div className="text-sm text-amber-500 font-semibold">CARE</div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative text-gray-300 hover:text-amber-400 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <a
              href="https://wa.me/+917990507301"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>

            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-300 hover:text-amber-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-amber-600">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/+917990507301"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors justify-center"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
