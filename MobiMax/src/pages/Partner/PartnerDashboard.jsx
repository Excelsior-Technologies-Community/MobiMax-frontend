import React, { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Star, TrendingUp, ArrowUpRight, Activity, Clock, CheckCircle } from 'lucide-react';

const PartnerDashboard = () => {
  const [partnerUser, setPartnerUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('partnerData') || sessionStorage.getItem('partnerData');
    const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
    
    if (userStr) {
      setPartnerUser(JSON.parse(userStr));
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/partners/dashboard-stats', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('partnerToken');
          sessionStorage.removeItem('partnerToken');
          window.location.href = '/partner/login';
          return;
        }

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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1200px] mx-auto text-[#1e272e]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Hero Box (Styled like a promotional banner) */}
      <div className="md:col-span-8 bg-[#e55039] rounded-2xl p-8 md:p-12 flex flex-col justify-center shadow-xl relative overflow-hidden group">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay transition-opacity duration-700"
          style={{
            backgroundImage: `url("https://enovathemes.com/mobimax/wp-content/uploads/slider_pattern_white-1.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center'
          }}
        ></div>
        <div className="relative z-10">
          <h2 className="text-white font-black text-2xl uppercase tracking-wider mb-2">
            Ready for action,
          </h2>
          <h1 className="text-[#ffd32a] font-black text-5xl md:text-6xl uppercase tracking-tight leading-none drop-shadow-md mb-6">
            {partnerUser?.name?.split(' ')[0] || 'Partner'}!
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded shadow-sm inline-block">
              <span className="text-[#e55039] font-black text-2xl mr-2">{displayStats.activeOrders}</span>
              <span className="text-gray-500 font-bold text-xs uppercase tracking-wider leading-tight inline-block align-middle">Active<br/>Orders</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-8 flex flex-wrap gap-4">
          <button className="bg-[#ffd32a] text-[#1e272e] px-8 py-4 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-[#e26a1b] hover:text-white transition-all duration-300 shadow-lg transform hover:-translate-y-1">
            View Live Orders
          </button>
          <button className="bg-white text-[#1e272e] border-2 border-white px-8 py-4 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-all duration-300">
            Pause Store
          </button>
        </div>
        
        {/* Decorative Image */}
        <img src="https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset4.png" alt="Promo" className="absolute right-[-40px] top-[10%] h-[120%] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none opacity-50 md:opacity-100" />
      </div>

      {/* Metric: Today's Earnings (Yellow Banner Style) */}
      <div className="md:col-span-4 bg-[#ffd800] rounded-2xl p-8 text-[#1e272e] shadow-xl flex flex-col justify-between relative overflow-hidden group border border-[#ffd800]/50">
        <div 
          className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: 'url("https://enovathemes.com/mobimax/wp-content/uploads/banner_img_1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
          }}
        ></div>
        
        <div className="relative z-10">
          <h4 className="font-extrabold text-sm tracking-widest uppercase mb-1 text-gray-900 bg-white/50 inline-block px-3 py-1 rounded backdrop-blur-sm">
            Today's Earnings
          </h4>
        </div>
        
        <div className="relative z-10 mt-12">
          <div className="text-[#d52b27] font-black text-[54px] md:text-[64px] leading-none uppercase drop-shadow-sm mb-4">
            £{displayStats.todayEarnings.split('.')[0]}<span className="text-4xl text-[#d52b27]/80">.{displayStats.todayEarnings.split('.')[1] || '00'}</span>
          </div>
          <div className="flex items-center text-[#d52b27] font-black text-sm bg-white px-4 py-2 rounded shadow-sm inline-flex uppercase tracking-wider">
            <TrendingUp className="w-5 h-5 mr-2" /> +{displayStats.earningsGrowth}%
          </div>
        </div>
      </div>

      {/* Metric: Active Orders */}
      <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div className="h-16 w-16 rounded-xl bg-[#e26a1b] flex items-center justify-center text-white shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <ShoppingBag className="h-8 w-8" />
          </div>
          {displayStats.newOrdersCount > 0 && (
            <span className="bg-[#e55039] text-white px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider shadow-sm animate-bounce">+{displayStats.newOrdersCount} New</span>
          )}
        </div>
        <div className="mt-8">
          <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">Active Orders</p>
          <p className="text-5xl font-black text-[#1e272e] tracking-tighter drop-shadow-sm">{displayStats.activeOrders}</p>
        </div>
      </div>

      {/* Metric: Customer Rating */}
      <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div className="h-16 w-16 rounded-xl bg-[#2ed573] flex items-center justify-center text-white shadow-md transform group-hover:rotate-[24deg] transition-transform duration-300">
            <Star className="h-8 w-8 fill-white" />
          </div>
        </div>
        <div className="mt-8">
          <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">Rating</p>
          <p className="text-5xl font-black text-[#1e272e] tracking-tighter drop-shadow-sm">{displayStats.rating}</p>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="md:col-span-6 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-100">
        <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-black text-[#1e272e] uppercase tracking-wide flex items-center">
            <Activity className="w-6 h-6 mr-3 text-[#e26a1b]" />
            Recent Activity
          </h2>
          <button className="text-white bg-[#1e272e] font-bold text-xs uppercase tracking-widest hover:bg-[#e26a1b] px-6 py-2.5 rounded shadow-sm transition-colors">View all</button>
        </div>
        <div className="flex-1 p-8 pt-6 overflow-y-auto bg-white">
          <div className="space-y-6">
            {displayStats.recentActivity && displayStats.recentActivity.length > 0 ? (
              displayStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                    activity.type === 'completed' ? 'bg-[#2ed573] text-white' : 'bg-[#e26a1b] text-white'
                  }`}>
                    {activity.type === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div className="flex flex-col justify-center border-b border-gray-50 pb-4 w-full">
                    <p className="text-sm font-black text-[#1e272e] uppercase tracking-wide">{activity.title}</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">{activity.description}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center"><Clock className="w-3 h-3 mr-1"/> {activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 opacity-50">
                <Clock className="w-10 h-10 mb-3 text-gray-400" />
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PartnerDashboard;
