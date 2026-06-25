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
        <div className="flex h-20 items-center justify-between gap-3">
          <Link to="/" className="focus-ring flex min-h-11 min-w-0 items-center gap-2 rounded-lg">
            <div className="truncate text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Mishfa
            </div>
            <div className="text-sm text-amber-500 font-semibold">CARE</div>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="focus-ring rounded-md px-1 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              to="/cart"
              aria-label={`Shopping cart with ${itemCount} item${itemCount === 1 ? '' : 's'}`}
              className="focus-ring touch-button relative min-w-11 rounded-lg text-gray-300 transition-colors hover:text-amber-400"
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
              className="focus-ring touch-button hidden items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 sm:flex"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>

            <button
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="focus-ring touch-button min-w-11 rounded-lg text-gray-300 hover:text-amber-400 lg:hidden"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav id="mobile-navigation" className="border-t border-amber-600 pb-4 lg:hidden">
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="focus-ring block min-h-11 rounded-lg px-3 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-amber-400"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/+917990507301"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring touch-button mt-2 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700"
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
