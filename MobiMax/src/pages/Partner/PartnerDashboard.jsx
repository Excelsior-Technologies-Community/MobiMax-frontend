import React, { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Star, TrendingUp, ArrowUpRight, Activity, Clock, CheckCircle } from 'lucide-react';

const PartnerDashboard = () => {
  const [partnerUser, setPartnerUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('partnerData');
    const token = localStorage.getItem('partnerToken'); // Assuming token is stored here or similar
    
    if (userStr) {
      setPartnerUser(JSON.parse(userStr));
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/partner/dashboard-stats', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        const result = await response.json();
        if (result.status === 'success') {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
      </div>
    );
  }

  // Fallback defaults if fetch fails
  const displayStats = stats || {
    todayEarnings: '0.00',
    earningsGrowth: 0,
    activeOrders: 0,
    newOrdersCount: 0,
    rating: '0.0',
    recentActivity: []
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
      
      {/* Hero Bento Box */}
      <div className="md:col-span-8 bg-white rounded-[32px] p-10 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFF2EB] to-white rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Ready for a busy day, <br/><span className="text-[#e26a1b]">{partnerUser?.name?.split(' ')[0] || 'Partner'}</span>?
          </h2>
          <p className="text-gray-500 mt-4 text-base font-medium max-w-md">
            Your kitchen is online. You have <strong className="text-gray-900">{displayStats.activeOrders} active orders</strong> right now. Keep up the great work!
          </p>
        </div>
        <div className="relative z-10 mt-8 flex flex-wrap gap-4">
          <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-black transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] hover:-translate-y-0.5">
            View Live Orders
          </button>
          <button className="bg-white text-gray-900 border border-gray-200 px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all duration-300">
            Pause Store
          </button>
        </div>
      </div>

      {/* Metric: Today's Earnings */}
      <div className="md:col-span-4 bg-gradient-to-br from-[#e26a1b] to-[#d65a11] rounded-[32px] p-8 text-white shadow-[0_12px_30px_rgba(226,106,27,0.3)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
          <DollarSign className="w-24 h-24 -mr-4 -mt-4" />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
            Today's Earnings
          </span>
        </div>
        <div className="relative z-10 mt-12">
          <p className="text-5xl font-black tracking-tighter">
            £{displayStats.todayEarnings.split('.')[0]}<span className="text-3xl text-white/70">.{displayStats.todayEarnings.split('.')[1] || '00'}</span>
          </p>
          <div className="flex items-center mt-3 text-emerald-100 font-bold text-sm bg-black/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <TrendingUp className="w-4 h-4 mr-1.5" /> +{displayStats.earningsGrowth}% vs yesterday
          </div>
        </div>
      </div>

      {/* Metric: Active Orders */}
      <div className="md:col-span-3 bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 rounded-[18px] bg-[#FFF2EB] flex items-center justify-center text-[#e26a1b]">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <span className="bg-orange-50 text-[#e26a1b] px-2.5 py-1 rounded-full text-xs font-bold">+{displayStats.newOrdersCount} New</span>
        </div>
        <div className="mt-8">
          <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Active Orders</p>
          <p className="text-5xl font-black text-gray-900 tracking-tighter">{displayStats.activeOrders}</p>
        </div>
      </div>

      {/* Metric: Customer Rating */}
      <div className="md:col-span-3 bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 rounded-[18px] bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Star className="h-6 w-6 fill-emerald-600" />
          </div>
        </div>
        <div className="mt-8">
          <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Rating</p>
          <p className="text-5xl font-black text-gray-900 tracking-tighter">{displayStats.rating}</p>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="md:col-span-6 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-[#e26a1b] font-bold text-sm hover:bg-[#FFF2EB] px-4 py-2 rounded-xl transition-colors">View all</button>
        </div>
        <div className="flex-1 p-8 pt-2 overflow-y-auto">
          <div className="space-y-6">
            {displayStats.recentActivity && displayStats.recentActivity.length > 0 ? (
              displayStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    activity.type === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-[#e26a1b]'
                  }`}>
                    {activity.type === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500 font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PartnerDashboard;
