import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, ShoppingCart, Users, DollarSign, BarChart3, Settings, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
}

interface DistributorApp {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  business_name: string;
  business_type: string;
  monthly_expected_order: string;
  message?: string;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [distributorApps, setDistributorApps] = useState<DistributorApp[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalDistributors: 0,
  });
  const [activeTab, setActiveTab] = useState<'orders' | 'distributor' | 'messages'>('orders');

  useEffect(() => {
    const token = localStorage.getItem('mishfa_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
    fetchAllData();

    // Real-time subscriptions
    const ordersSubscription = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    const distributorSubscription = supabase
      .channel('distributor-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'distributor_applications' },
        () => fetchDistributorApplications()
      )
      .subscribe();

    const contactSubscription = supabase
      .channel('contact-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => fetchContactMessages()
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
      distributorSubscription.unsubscribe();
      contactSubscription.unsubscribe();
    };
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchOrders(),
      fetchDistributorApplications(),
      fetchContactMessages(),
    ]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersData = (data || []) as Order[];
      setOrders(ordersData);

      const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + (order.total_amount || 0), 0);
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter((o: Order) => o.status === 'pending').length;
      const completedOrders = ordersData.filter((o: Order) => o.status === 'delivered').length;

      setStats((prev) => ({
        ...prev,
        totalOrders,
        totalRevenue,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        pendingOrders,
        completedOrders,
      }));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchDistributorApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('distributor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const apps = (data || []) as DistributorApp[];
      setDistributorApps(apps);
      setStats((prev) => ({
        ...prev,
        totalDistributors: apps.length,
      }));
    } catch (err) {
      console.error('Failed to fetch distributor apps:', err);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactMessages((data || []) as ContactMessage[]);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mishfa_admin_token');
    localStorage.removeItem('mishfa_admin_email');
    navigate('/admin/login');
  };

  const StatCard = ({ icon: Icon, label, value, color = 'amber' }: any) => (
    <div className="bg-gray-900 border border-amber-600 rounded-lg p-6 hover:border-amber-500 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2 font-semibold">{label}</p>
          <p className={`text-3xl font-bold text-${color}-400`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 text-${color}-500 opacity-30`} />
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'confirmed':
        return 'bg-blue-600';
      case 'shipped':
        return 'bg-purple-600';
      case 'delivered':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage orders, products, distributors & inquiries</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              <Settings className="w-5 h-5" />
              Manage Products
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} />
          <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} />
          <StatCard icon={BarChart3} label="Avg Order Value" value={`₹${stats.avgOrderValue.toLocaleString()}`} />
          <StatCard icon={TrendingUp} label="Completed Orders" value={stats.completedOrders} />
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-amber-600 rounded-t-lg">
          <div className="flex border-b border-amber-600">
            {[
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'distributor', label: 'Distributor Apps', icon: Users },
              { id: 'messages', label: 'Contact Messages', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-amber-600'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-gray-400 text-center py-8">Loading...</p>
            ) : activeTab === 'orders' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-amber-600">
                      <th className="text-left px-4 py-3 text-amber-400 font-semibold">Order ID</th>
                      <th className="text-left px-4 py-3 text-amber-400 font-semibold">Customer</th>
                      <th className="text-left px-4 py-3 text-amber-400 font-semibold">Amount</th>
                      <th className="text-left px-4 py-3 text-amber-400 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 text-amber-400 font-semibold">Date</th>
                      <th className="text-left px-4 py-3 text-amber-400 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800">
                        <td className="px-4 py-3 text-white font-mono text-sm">{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-gray-300">{order.customer_name}</td>
                        <td className="px-4 py-3 text-amber-400 font-bold">₹{order.total_amount}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.status)}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-black border border-amber-600 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'distributor' ? (
              <div className="space-y-4">
                {distributorApps.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No distributor applications yet</p>
                ) : (
                  distributorApps.map((app: any) => (
                    <div key={app.id} className="border border-amber-600 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Name</p>
                          <p className="text-white font-semibold">{app.full_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white">{app.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">City</p>
                          <p className="text-white">{app.city}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Business</p>
                          <p className="text-white">{app.business_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Expected Order</p>
                          <p className="text-amber-400 font-semibold">{app.monthly_expected_order}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Status</p>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
                            {app.status}
                          </span>
                        </div>
                      </div>
                      {app.message && (
                        <div className="mt-4 pt-4 border-t border-amber-600">
                          <p className="text-gray-400 text-sm mb-2">Message:</p>
                          <p className="text-gray-300">{app.message}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No contact messages yet</p>
                ) : (
                  contactMessages.map((msg: any) => (
                    <div key={msg.id} className="border border-amber-600 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-gray-400 text-sm">Name</p>
                          <p className="text-white font-semibold">{msg.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white">{msg.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Subject</p>
                          <p className="text-amber-400 font-semibold">{msg.subject}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Message:</p>
                        <p className="text-gray-300">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
