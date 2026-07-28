import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Package, ArrowLeft } from 'lucide-react';

const CategoryStoresPage = () => {
  const { categoryName } = useParams();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/public/stores/category/${encodeURIComponent(categoryName)}`);
        const result = await response.json();
        if (result.status === 'success') {
          setStores(result.data);
        } else {
          setError(result.message || 'Failed to fetch stores');
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('An error occurred while fetching stores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [categoryName]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Premium Header Banner */}
      <div className="bg-[#1e272e] relative overflow-hidden pt-20 pb-16 px-4 mb-12 shadow-lg">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#e26a1b] blur-[120px]"></div>
          <div className="absolute top-1/2 -left-20 w-[300px] h-[300px] rounded-full bg-white blur-[90px]"></div>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Back Navigation */}
          <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white font-bold text-sm transition-colors mb-8 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Shop Departments
          </Link>

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-lg">
              Stores selling <span className="text-[#e26a1b] inline-block mt-2 md:mt-0">{categoryName}</span>
            </h1>
            <p className="text-gray-300 font-medium max-w-2xl text-lg opacity-90">
              Choose a partner store below to view their available products in this category.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-xl text-center font-bold shadow-sm">
            {error}
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-[#1e272e] uppercase mb-3 tracking-tight">No Stores Found</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
              Currently, there are no partner stores offering products in the <span className="font-bold text-gray-700">"{categoryName}"</span> category. Please check back later.
            </p>
            <Link to="/" className="bg-[#1e272e] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-[#e26a1b] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map(store => (
              <Link 
                to={`/store/${store.id}/category/${encodeURIComponent(categoryName)}`} 
                key={store.id}
                className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(226,106,27,0.1)] border border-gray-100 hover:border-[#e26a1b]/30 p-8 flex flex-col items-center cursor-pointer transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Decorative background accent on hover */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#e26a1b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-[#e26a1b]/20 transition-all duration-500 mb-6 bg-white shadow-inner flex items-center justify-center p-3 relative z-10 group-hover:scale-105">
                  {store.store_logo ? (
                    <img src={store.store_logo} alt={store.store_name} className="w-full h-full object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all" />
                  ) : (
                    <Store className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                
                <h3 className="text-2xl font-black text-[#1e272e] text-center mb-1.5 group-hover:text-[#e26a1b] transition-colors duration-300 tracking-tight">{store.store_name}</h3>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 text-center">{store.company}</p>
                
                <div className="flex items-center justify-center text-gray-600 text-sm font-medium bg-gray-50 group-hover:bg-[#e26a1b]/5 px-5 py-4 rounded-2xl w-full transition-colors duration-300 mt-auto border border-gray-100/50 group-hover:border-[#e26a1b]/20">
                  <MapPin className="w-4.5 h-4.5 mr-2 shrink-0 text-gray-400 group-hover:text-[#e26a1b] transition-colors duration-300" />
                  <span className="leading-snug line-clamp-1">{store.store_address ? `${store.store_address}, ${store.city || ''}` : store.city || 'Location unavailable'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryStoresPage;
