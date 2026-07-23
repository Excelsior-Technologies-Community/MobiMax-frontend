import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Package, ArrowLeft, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';

const StoreProductsPage = () => {
  const { storeId, categoryName } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  };

  const filteredProducts = products.filter(product => {
    if (inStockOnly && !product.in_stock) return false;
    if (minPrice !== '' && parseFloat(product.price) < parseFloat(minPrice)) return false;
    if (maxPrice !== '' && parseFloat(product.price) > parseFloat(maxPrice)) return false;
    return true;
  });

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
        
        {/* Content Layout */}
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
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar (Store Info + Filters) - Sticky */}
            <div className="lg:w-1/4 shrink-0 space-y-6 lg:sticky lg:top-28 z-10 lg:max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-4">
              
              {/* Back Link */}
              <Link to={`/category/${encodeURIComponent(categoryName)}/stores`} className="inline-flex items-center text-gray-500 hover:text-[#e26a1b] font-bold text-sm transition-colors bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 w-full justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {categoryName} Stores
              </Link>

              {/* Store Info Card */}
              {store && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-2 bg-white mb-4 shadow-inner">
                    {store.store_logo ? (
                      <img src={store.store_logo} alt={store.store_name} className="w-full h-full object-contain" />
                    ) : (
                      <Store className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <h1 className="text-xl font-black text-[#1e272e] uppercase tracking-tight mb-1">{store.store_name}</h1>
                  <p className="text-gray-500 font-medium text-xs mb-3">{store.company} • {store.city}</p>
                  <div className="inline-block bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                    {categoryName}
                  </div>
                </div>
              )}

              {/* Filter Sidebar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#e26a1b]" /> Filters
                  </h3>
                  <button 
                    onClick={clearFilters}
                    className="text-xs font-semibold text-gray-500 hover:text-[#e26a1b] flex items-center gap-1 transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
                
                <div className="p-5 space-y-6">
                  {/* Price Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Price Range
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">£</span>
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                        />
                      </div>
                      <span className="text-gray-400 font-medium">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">£</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Availability</h4>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#e26a1b] peer-checked:border-[#e26a1b] transition-colors"></div>
                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                    </label>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              <div className="mb-4 flex items-center justify-between text-sm text-gray-500 font-medium">
                <p>Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center">
                  <Filter className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No matching products</h3>
                  <p className="text-gray-500 max-w-sm mb-6">We couldn't find any products matching your current filters. Try adjusting your price range or availability.</p>
                  <button onClick={clearFilters} className="text-sm font-bold text-[#e26a1b] bg-[#e26a1b]/10 hover:bg-[#e26a1b]/20 px-6 py-2.5 rounded-lg transition-colors">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <Link to={`/product/${product.id}`} key={product.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative transition-all duration-300 hover:shadow-xl hover:border-[#e26a1b]/30 block ${!product.in_stock ? 'opacity-75 grayscale-[30%]' : ''}`}>
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
                        
                        <div 
                          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${!product.in_stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1e272e] text-white group-hover:bg-[#e26a1b]'}`}
                        >
                          {product.in_stock ? 'View' : 'Out'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StoreProductsPage;
