import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, LogOut, Menu, Package, RefreshCw, X } from 'lucide-react';

type AdminLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
};

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/admin/products', label: 'Products & Coupons', icon: Package },
];

export default function AdminLayout({
  title,
  description,
  children,
  onRefresh,
  refreshing = false,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('mishfa_admin_token');
    localStorage.removeItem('mishfa_admin_email');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-40 border-b border-amber-600 bg-gradient-to-r from-gray-900 to-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-white sm:text-4xl">{title}</h1>
            <p className="mt-1 hidden text-gray-400 sm:block">{description}</p>
          </div>
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="focus-ring touch-button hidden items-center gap-2 rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-50 sm:inline-flex"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              className="focus-ring touch-button inline-flex min-w-11 items-center gap-2 rounded-lg border border-amber-600 bg-black px-3 py-3 font-semibold text-white transition-all hover:bg-gray-900 sm:px-4 lg:hidden"
              aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              Menu
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-12">
        <aside
          id="admin-sidebar"
          className={`fixed bottom-0 left-0 top-[73px] z-30 w-[min(18rem,85vw)] overflow-y-auto border-r border-amber-600 bg-gray-950 p-4 transition-transform lg:sticky lg:top-[105px] lg:z-auto lg:h-[calc(100dvh-129px)] lg:w-auto lg:translate-x-0 lg:rounded-xl lg:border ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-6">
            <Link to="/admin/dashboard" className="focus-ring block rounded text-xl font-bold text-white">
              Mishfa Admin
            </Link>
            <p className="mt-1 text-sm text-gray-400">Operations panel</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `focus-ring flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-all ${
                    isActive ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0 break-words">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 space-y-3 border-t border-amber-600 pt-6">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="focus-ring touch-button w-full gap-2 rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-50 sm:hidden"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
            <button
              onClick={handleLogout}
              className="focus-ring touch-button w-full gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-all hover:bg-red-700"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
