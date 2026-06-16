import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ShoppingCart, Users, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminLayout from '../components/AdminLayout';

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

type StatColor = 'amber' | 'green' | 'blue' | 'purple';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: StatColor;
};

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

  const statColorClasses = {
    amber: {
      value: 'text-amber-400',
      icon: 'text-amber-500',
    },
    green: {
      value: 'text-green-400',
      icon: 'text-green-500',
    },
    blue: {
      value: 'text-blue-400',
      icon: 'text-blue-500',
    },
    purple: {
      value: 'text-purple-400',
      icon: 'text-purple-500',
    },
  } as const;

  const adminSections = [
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.length },
    { id: 'distributor', label: 'Distributor Apps', icon: Users, count: distributorApps.length },
    { id: 'messages', label: 'Contact Messages', icon: Users, count: contactMessages.length },
  ] as const;

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

  const StatCard = ({ icon: Icon, label, value, color = 'amber' }: StatCardProps) => (
    <div className="bg-gray-900 border border-amber-600 rounded-lg p-6 hover:border-amber-500 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2 font-semibold">{label}</p>
          <p className={`text-3xl font-bold ${statColorClasses[color].value}`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${statColorClasses[color].icon} opacity-30`} />
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
    <AdminLayout
      title="Admin Dashboard"
      description="Manage orders, products, distributors & inquiries"
      onRefresh={fetchAllData}
      refreshing={loading}
    >
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                    activeTab === section.id
                      ? 'border-amber-500 bg-amber-600 text-white'
                      : 'border-amber-600 bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <section.icon className="h-5 w-5" />
                    {section.label}
                  </span>
                  <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-bold text-inherit">
                    {section.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-12">
              <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} color="amber" />
              <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="green" />
              <StatCard icon={BarChart3} label="Avg Order Value" value={`₹${stats.avgOrderValue.toLocaleString()}`} color="blue" />
              <StatCard icon={TrendingUp} label="Completed Orders" value={stats.completedOrders} color="purple" />
            </div>

            <div className="rounded-xl border border-amber-600 bg-gray-900">
              <div className="border-b border-amber-600 px-6 py-5">
                <h2 className="text-2xl font-bold text-white">
                  {adminSections.find((section) => section.id === activeTab)?.label}
                </h2>
                <p className="mt-1 text-gray-400">
                  {activeTab === 'orders'
                    ? 'Track incoming orders and update fulfillment status.'
                    : activeTab === 'distributor'
                      ? 'Review new distributor interest and business details.'
                      : 'Respond to inbound customer messages.'}
                </p>
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
    </AdminLayout>
  );
}
