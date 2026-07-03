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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {adminUser?.name || 'Admin'}. Here's what's happening today.
          </p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center shadow-sm">
          Generate Report
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-[#e26a1b]" />
              </div>
              <span className={`text-sm font-medium ${stat.trendColor} bg-opacity-10 px-2.5 py-0.5 rounded-full flex items-center`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-4 border border-gray-50 rounded-lg bg-gray-50/50">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">New partner registration</p>
                <p className="text-xs text-gray-500">TechStore Ltd. applied for partnership.</p>
              </div>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
