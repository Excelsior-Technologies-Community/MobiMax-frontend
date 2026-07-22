import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Package } from 'lucide-react';

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
    <div className="bg-[#f8f9fa] min-h-screen py-12" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e272e] uppercase tracking-tight mb-4">
            Stores selling <span className="text-[#e26a1b]">{categoryName}</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Choose a partner store below to view their available products in this category.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-xl text-center font-bold">
            {error}
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-[#1e272e] uppercase mb-2">No Stores Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Currently, there are no partner stores offering products in the "{categoryName}" category. Please check back later.
            </p>
            <Link to="/" className="mt-6 bg-[#1e272e] text-white px-6 py-3 rounded-lg font-black uppercase text-sm tracking-widest hover:bg-[#e26a1b] transition-colors inline-block">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <Link 
                to={`/store/${store.id}/category/${encodeURIComponent(categoryName)}`} 
                key={store.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 flex flex-col items-center cursor-pointer group transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-[#e26a1b]/20 transition-all mb-4 bg-white shadow-inner flex items-center justify-center p-2">
                  {store.store_logo ? (
                    <img src={store.store_logo} alt={store.store_name} className="w-full h-full object-contain" />
                  ) : (
                    <Store className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                
                <h3 className="text-xl font-black text-[#1e272e] text-center mb-1 group-hover:text-[#e26a1b] transition-colors">{store.store_name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">{store.company}</p>
                
                <div className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 px-4 py-2 rounded-full w-full justify-center group-hover:bg-[#e26a1b]/5 transition-colors">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-[#e26a1b] transition-colors" />
                  {store.city || 'Location unavailable'}
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
