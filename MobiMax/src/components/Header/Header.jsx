import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">


      {/* Middle Bar */}
      <div className="middle-bar">
        <div className="middle-bar-inner">
          <div className="logo-container">
            <span className="logo-text">
              Mobi<span className="logo-highlight">Max</span>
            </span>
          </div>

          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for products..." 
            />
            <button className="search-button">SEARCH</button>
          </div>

          <div className="actions-container">
            <button className="action-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div className="cart-container">
              <div className="action-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div className="cart-info">
                <span className="cart-title">My cart</span>
                <span className="cart-price">£135.99 | 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bottom-bar-inner">
          <button className="departments-btn">
            <span>SHOP DEPARTMENTS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <nav className="nav-links">
            <a href="#" className="nav-link active" style={{textDecoration: 'underline', textUnderlineOffset: '8px', textDecorationThickness: '2px'}}>Home</a>
            <a href="#" className="nav-link">Pages</a>
            <a href="#" className="nav-link">Blog</a>
            <a href="#" className="nav-link">Shop</a>
            <a href="#" className="nav-link">Elements</a>
          </nav>

          <button className="vehicles-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
            My vehicles
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
