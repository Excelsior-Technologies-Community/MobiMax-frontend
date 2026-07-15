import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Simple auth check
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const userStr = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    if (userStr) {
      setAdminUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const stats = [
    { title: 'Total Revenue', value: '£45,231.89', icon: DollarSign, trend: '+20.1%', trendColor: 'text-green-500' },
    { title: 'Active Partners', value: '124', icon: Users, trend: '+12.5%', trendColor: 'text-green-500' },
    { title: 'New Orders', value: '854', icon: ShoppingCart, trend: '-2.4%', trendColor: 'text-red-500' },
    { title: 'System Health', value: '99.9%', icon: Activity, trend: '+0.1%', trendColor: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {adminUser?.name || 'Admin'}. Here's what's happening today.
          </p>
        </div>
        <button className="bg-[#e26a1b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#c95a14] transition-all duration-200 flex items-center justify-center w-full sm:w-auto shadow-[0_4px_12px_rgba(226,106,27,0.2)]">
          Generate Report
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80 p-6 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-[#e26a1b]" />
              </div>
              <span className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full flex items-center ${
                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start group">
              <div className="relative flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#f8f9fb] border border-gray-100 group-hover:bg-[#e26a1b]/10 transition-colors">
                <Activity className="h-4 w-4 text-gray-400 group-hover:text-[#e26a1b]" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-900">New partner registration</p>
                <p className="text-sm text-gray-500 mt-0.5">TechStore Ltd. applied for partnership.</p>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
