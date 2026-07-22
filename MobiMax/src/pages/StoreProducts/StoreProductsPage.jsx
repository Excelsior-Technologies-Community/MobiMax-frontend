import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Package, ArrowLeft } from 'lucide-react';

const StoreProductsPage = () => {
  const { storeId, categoryName } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/public/store/${storeId}/products/${encodeURIComponent(categoryName)}`);
        const result = await response.json();
        if (result.status === 'success') {
          setStore(result.data.store);
          setProducts(result.data.products);
        } else {
          setError(result.message || 'Failed to fetch store products');
        }
      } catch (err) {
        console.error('Error fetching store products:', err);
        setError('An error occurred while fetching store products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreProducts();
  }, [storeId, categoryName]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Navigation & Store Info */}
        <div className="mb-10">
          <Link to={`/category/${encodeURIComponent(categoryName)}/stores`} className="inline-flex items-center text-gray-500 hover:text-[#e26a1b] font-bold text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryName} Stores
          </Link>

          {store && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-2 bg-white shrink-0">
                {store.store_logo ? (
                  <img src={store.store_logo} alt={store.store_name} className="w-full h-full object-contain" />
                ) : (
                  <Store className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#1e272e] uppercase tracking-tight mb-1">{store.store_name}</h1>
                <p className="text-gray-500 font-medium text-sm mb-1">{store.company} • {store.city}</p>
                <div className="inline-block bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                  {categoryName}
                </div>
              </div>
            </div>
          )}
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
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-[#1e272e] uppercase mb-2">No Products Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This store doesn't currently have any active products in the "{categoryName}" category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative transition-all duration-300 hover:shadow-xl hover:border-[#e26a1b]/30 ${!product.in_stock ? 'opacity-75 grayscale-[30%]' : ''}`}>
                {product.oldPrice && product.in_stock && <div className="absolute top-4 right-4 bg-[#1e272e] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider z-10">-{(100 - (product.price / product.oldPrice) * 100).toFixed(0)}%</div>}
                
                {!product.in_stock && (
                  <div className="absolute top-4 left-4 z-10 bg-[#e55039] text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-sm shadow-md">
                    Out of Stock
                  </div>
                )}
                
                <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                <h3 className="text-[#1e272e] font-black text-sm mb-1 line-clamp-2 min-h-[40px] leading-tight">{product.title}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-1">{product.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                  <div className="flex flex-col">
                    {product.oldPrice && <span className="text-gray-400 text-xs line-through mb-0.5">£{Number(product.oldPrice).toFixed(2)}</span>}
                    <span className="text-[#e26a1b] font-black text-lg">£{Number(product.price).toFixed(2)}</span>
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${!product.in_stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1e272e] text-white hover:bg-[#e26a1b]'}`}
                    disabled={!product.in_stock}
                  >
                    {product.in_stock ? 'Add' : 'Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StoreProductsPage;
