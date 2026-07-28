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
    <div className="bg-[#f8f9fa] min-h-screen pb-16" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e26a1b]"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-12">
          <div className="bg-red-50 text-red-500 p-6 rounded-xl text-center font-bold">
            {error}
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Premium Store Banner */}
          {store && (
            <div className="bg-[#1e272e] relative overflow-hidden text-white pt-16 pb-12 px-4 mb-10 shadow-lg">
              {/* Abstract Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#e26a1b] blur-[100px]"></div>
                <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-white blur-[100px]"></div>
              </div>

              <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Store Logo */}
                <div className="w-32 h-32 bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center shrink-0 border-4 border-white/10">
                  {store.store_logo ? (
                    <img src={store.store_logo} alt={store.store_name} className="w-full h-full object-contain" />
                  ) : (
                    <Store className="w-16 h-16 text-gray-300" />
                  )}
                </div>
                
                {/* Store Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
                    <Package className="w-3.5 h-3.5 text-[#e26a1b]" /> {categoryName}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-3 drop-shadow-md">{store.store_name}</h1>
                  <p className="text-gray-300 font-medium flex items-center justify-center md:justify-start gap-2.5 text-sm md:text-base">
                    <span className="opacity-90">{store.company}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e26a1b] shadow-[0_0_8px_#e26a1b]"></span>
                    <span className="opacity-90 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {store.city}
                    </span>
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-2 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <Link to={`/category/${encodeURIComponent(categoryName)}/stores`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white hover:text-[#1e272e] border border-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Stores
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Package className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-[#1e272e] uppercase mb-3">No Products Available</h3>
                <p className="text-gray-500 max-w-md mx-auto text-lg">
                  This store doesn't currently have any active products in the <span className="font-bold text-gray-700">"{categoryName}"</span> category.
                </p>
                <Link to={`/category/${encodeURIComponent(categoryName)}/stores`} className="mt-8 bg-[#e26a1b] hover:bg-[#d05c14] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg">
                  Browse Other Stores
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Sidebar (Filters) - Sticky */}
                <div className="lg:w-1/4 shrink-0 space-y-6 lg:sticky lg:top-28 z-10 lg:max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-4">
                  {/* Filter Sidebar */}
                  {/* Filter Sidebar */}
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e26a1b] to-[#ff9f43]"></div>
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/80 to-white">
                      <h3 className="text-lg font-black text-[#1e272e] flex items-center gap-2.5">
                        <Filter className="w-5 h-5 text-[#e26a1b]" /> Filters
                      </h3>
                      <button 
                        onClick={clearFilters}
                        className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1.5 transition-all duration-300 bg-white hover:bg-[#1e272e] px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#1e272e] shadow-sm hover:shadow-md group"
                      >
                        <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" /> Clear
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-8">
                      {/* Price Filter */}
                      <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-gray-300" /> Price Range
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1 group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e26a1b] transition-colors text-sm font-bold">£</span>
                            <input 
                              type="number" 
                              placeholder="Min" 
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              className="w-full pl-8 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] outline-none transition-all shadow-sm placeholder:font-medium placeholder:text-gray-400"
                            />
                          </div>
                          <span className="text-gray-300 font-bold">-</span>
                          <div className="relative flex-1 group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e26a1b] transition-colors text-sm font-bold">£</span>
                            <input 
                              type="number" 
                              placeholder="Max" 
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              className="w-full pl-8 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] outline-none transition-all shadow-sm placeholder:font-medium placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Availability Filter - Toggle Switch */}
                      <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Availability</h4>
                        <label className="flex items-center justify-between cursor-pointer group p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 -ml-3">
                          <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                          <div className="relative inline-flex items-center">
                            <input 
                              type="checkbox" 
                              checked={inStockOnly}
                              onChange={(e) => setInStockOnly(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e26a1b] shadow-inner transition-colors duration-300"></div>
                          </div>
                        </label>
                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="lg:w-3/4">
                  {/* Grid Header */}
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="border-l-4 border-[#e26a1b] pl-4">
                      <h3 className="text-xl font-black text-[#1e272e] uppercase tracking-tight mb-1">Store Products</h3>
                      <p className="text-sm text-gray-500 font-medium">Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                        <Filter className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">No matching products</h3>
                      <p className="text-gray-500 max-w-sm mb-8">We couldn't find any products matching your current filters. Try adjusting your price range or availability.</p>
                      <button onClick={clearFilters} className="text-sm font-bold text-white bg-[#1e272e] hover:bg-[#e26a1b] px-6 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" /> Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredProducts.map(product => (
                        <Link to={`/product/${product.id}`} key={product.id} className={`group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#e26a1b]/40 block ${!product.in_stock ? 'opacity-80 grayscale-[40%]' : ''}`}>
                          
                          {/* Badges */}
                          {product.oldPrice && product.in_stock && (
                            <div className="absolute top-4 right-4 bg-[#e26a1b] text-white text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider z-10 shadow-md">
                              -{(100 - (product.price / product.oldPrice) * 100).toFixed(0)}%
                            </div>
                          )}
                          {!product.in_stock && (
                            <div className="absolute top-4 left-4 z-10 bg-[#e55039] text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-md shadow-md">
                              Out of Stock
                            </div>
                          )}
                          
                          {/* Product Image */}
                          <div className="w-full aspect-square bg-gray-50 rounded-xl mb-5 overflow-hidden relative group-hover:bg-gray-100 transition-colors duration-300">
                            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          
                          {/* Product Details */}
                          <h3 className="text-[#1e272e] font-black text-[15px] mb-1.5 line-clamp-2 min-h-[44px] leading-tight group-hover:text-[#e26a1b] transition-colors duration-300">{product.title}</h3>
                          <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                          
                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                            <div className="flex flex-col">
                              {product.oldPrice && <span className="text-gray-400 text-xs font-bold line-through mb-0.5">£{Number(product.oldPrice).toFixed(2)}</span>}
                              <span className="text-[#e26a1b] font-black text-xl">£{Number(product.price).toFixed(2)}</span>
                            </div>
                            
                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm ${!product.in_stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#1e272e] text-white group-hover:bg-[#e26a1b] group-hover:shadow-[0_4px_12px_rgba(226,106,27,0.3)] group-hover:-translate-y-0.5'}`}>
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
        </>
      )}
    </div>
  );
};

export default StoreProductsPage;
