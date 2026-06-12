import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  email: 'admin@mishfacare.com',
  password: 'mishfa2026secure',
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('mishfa_admin_token', 'authorized');
      localStorage.setItem('mishfa_admin_email', email);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-amber-600 rounded-xl p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Lock className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">Mishfa Admin</h1>
          </div>

          <p className="text-gray-400 text-center mb-8">
            Secure admin panel for managing orders and products
          </p>

          {error && (
            <div className="mb-6 bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mishfacare.com"
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-black border border-amber-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : 'Login'} {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 p-4 bg-amber-600 bg-opacity-20 border border-amber-600 rounded-lg text-sm">
            <p className="text-amber-400 font-semibold mb-2">Demo Credentials:</p>
            <p className="text-amber-300">Email: admin@mishfacare.com</p>
            <p className="text-amber-300">Password: mishfa2026secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
