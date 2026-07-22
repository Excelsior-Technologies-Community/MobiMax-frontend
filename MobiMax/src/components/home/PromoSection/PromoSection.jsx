import React, { useState, useEffect } from 'react';
import './PromoSection.css';

const PromoSection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('POPULAR');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/public/products');
        const result = await response.json();
        if (result.status === 'success') {
          setProducts(result.data.slice(0, 8)); // Get up to 8 latest products
        }
      } catch (error) {
        console.error('Error fetching public products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <section className="promo-section-container">
      {/* Left Sidebar Banners */}
      <div className="promo-banners">
        <div className="promo-banner gear">
          <div className="promo-banner-content">
            <p className="banner-subtitle">We've got you covered</p>
            <h2 className="banner-title">GEAR</h2>
            <p className="banner-desc">ESSENTIALS</p>
            <a href="#" className="banner-btn">SHOP NOW</a>
          </div>
          <img src="https://enovathemes.com/mobimax/wp-content/uploads/banner_img_1.png" alt="Gear Essentials" className="promo-banner-img" />
        </div>
        
        <div className="promo-banner tires">
          <div className="promo-banner-content">
            <p className="banner-subtitle">Save 25%</p>
            <h2 className="banner-title">BUY 3</h2>
            <p className="banner-desc">GET THE 4TH FREE</p>
            <a href="#" className="banner-btn">SHOP NOW</a>
          </div>
          <img src="https://enovathemes.com/mobimax/wp-content/uploads/banner_img_2.png" alt="Tires Offer" className="promo-banner-img" />
        </div>
      </div>

      {/* Right Products Area */}
      <div className="promo-products-area">
        <div className="promo-tabs">
          <div 
            className={`promo-tab ${activeTab === 'POPULAR' ? 'active' : ''}`}
            onClick={() => setActiveTab('POPULAR')}
          >
            POPULAR
          </div>
          <div 
            className={`promo-tab ${activeTab === 'FEATURED' ? 'active' : ''}`}
            onClick={() => setActiveTab('FEATURED')}
          >
            FEATURED
          </div>
          <div 
            className={`promo-tab ${activeTab === 'NEW ARRIVALS' ? 'active' : ''}`}
            onClick={() => setActiveTab('NEW ARRIVALS')}
          >
            NEW ARRIVALS
          </div>
          
          <div className="promo-controls">
            <button className="promo-control-btn">&lt;</button>
            <button className="promo-control-btn">&gt;</button>
          </div>
        </div>

        <div className="promo-grid">
          {isLoading ? (
            <div className="w-full flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e26a1b]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <p className="font-bold text-lg mb-2">No products available</p>
              <p className="text-sm">Check back later for new arrivals.</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className={`promo-product-card relative ${!product.in_stock ? 'opacity-75 grayscale-[30%]' : ''}`}>
                {product.oldPrice && product.in_stock && <div className="promo-badge">-{(100 - (product.price / product.oldPrice) * 100).toFixed(0)}%</div>}
                
                {!product.in_stock && (
                  <div className="absolute top-4 left-4 z-10 bg-[#e55039] text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-sm shadow-md">
                    Out of Stock
                  </div>
                )}
                
                <img src={product.image_url} alt={product.title} className="promo-product-image" />
                
                <h3 className="promo-product-title">{product.title}</h3>
                
                <div className="promo-product-rating">
                  {product.rating > 0 ? (
                    <>
                      {'★'.repeat(product.rating)}
                      <span className="promo-product-rating-empty">{'★'.repeat(5 - product.rating)}</span>
                    </>
                  ) : (
                    <span className="promo-product-rating-empty">{'★★★★★'}</span>
                  )}
                </div>
                
                <div className="promo-product-price-container">
                  {product.oldPrice && <span className="promo-product-old-price">£{Number(product.oldPrice).toFixed(2)}</span>}
                  <span className="promo-product-price">£{Number(product.price).toFixed(2)}</span>
                </div>
                
                <button 
                  className={`promo-add-to-cart ${!product.in_stock ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300' : ''}`}
                  disabled={!product.in_stock}
                  style={!product.in_stock ? { backgroundColor: '#e2e8f0', color: '#94a3b8', borderColor: '#e2e8f0' } : {}}
                >
                  {product.in_stock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
