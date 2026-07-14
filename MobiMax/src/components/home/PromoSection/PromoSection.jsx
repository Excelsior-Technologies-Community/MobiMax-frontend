import React, { useState } from 'react';
import './PromoSection.css';

const products = [
  {
    id: 1,
    title: 'ValuePower Lead Acid Automotive Battery, Group 24F',
    price: 49.77,
    image: 'https://enovathemes.com/mobimax/wp-content/uploads/o-5-600x600.jpg',
    rating: 0,
  },
  {
    id: 2,
    title: 'CCK01783 FRONT + REAR Powder Coated Black [4] Calipers + [4] Black DS Rotors + Low Dust [8] Ceramic Pads',
    price: 56.40,
    oldPrice: 77.80,
    sale: '-28%',
    image: 'https://enovathemes.com/mobimax/wp-content/uploads/b-p-10-600x600.jpg',
    rating: 0,
  },
  {
    id: 3,
    title: 'For 04-08 Ford F150 11th Gen Chrome Housing Amber Corner Headlight Headlamp 05 06 07 Left+Right',
    price: 183.44,
    oldPrice: 210.75,
    sale: '-13%',
    image: 'https://enovathemes.com/mobimax/wp-content/uploads/el-p-6-600x600.jpg',
    rating: 0,
  },
  {
    id: 4,
    title: '20x25x1 Pleated MERV 14 AC Furnace Air Filters Qty 6',
    price: 11.14,
    image: 'https://enovathemes.com/mobimax/wp-content/uploads/sk-p-11-1-600x600.jpg',
    rating: 0,
  },
  {
    id: 5,
    title: 'Castrol EDGE 0W-40 A3B4 Advanced Full Synthetic Motor Oil, 5 QT',
    price: 33.55,
    image: 'https://enovathemes.com/mobimax/wp-content/uploads/oil-p-10-1-600x600.jpg',
    rating: 0,
  },
  {
    id: 6,
    title: '2V 55Ah Power Boat Pontoon Electric Trolling Motor Deep Cycle Battery - 2 Pack',
    price: 72.44,
    oldPrice: 97.44,
    sale: '-26%',
    image: 'https://enovathemes.com/mobimax/wp-content/uploads/o-2-600x600.jpg',
    rating: 0,
  }
];

const PromoSection = () => {
  const [activeTab, setActiveTab] = useState('POPULAR');
  
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
          {products.map(product => (
            <div key={product.id} className="promo-product-card">
              {product.sale && <div className="promo-badge">{product.sale}</div>}
              <img src={product.image} alt={product.title} className="promo-product-image" />
              
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
                {product.oldPrice && <span className="promo-product-old-price">£{product.oldPrice.toFixed(2)}</span>}
                <span className="promo-product-price">£{product.price.toFixed(2)}</span>
              </div>
              
              <button className="promo-add-to-cart">{product.id === 5 ? 'SELECT OPTIONS' : 'ADD TO CART'}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
