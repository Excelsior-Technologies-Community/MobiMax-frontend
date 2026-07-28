import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1e272e]/60 backdrop-blur-sm z-[999] transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[1000] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 to-white">
          <h2 className="text-xl font-black text-[#1e272e] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e26a1b]" /> Your Cart
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1e272e] hover:border-[#1e272e] transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-[#1e272e]">Your cart is empty</h3>
              <p className="text-sm text-gray-500 font-medium">Looks like you haven't added any parts yet.</p>
              <button onClick={onClose} className="mt-4 bg-white border border-gray-200 text-[#1e272e] font-bold text-sm px-6 py-3 rounded-xl hover:border-[#1e272e] shadow-sm transition-all">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 relative group">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-bold text-sm text-[#1e272e] line-clamp-2 leading-snug">{item.title}</h4>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mt-1">{item.category}</p>
                    </div>
                    
                    <div className="flex items-end justify-between mt-3">
                      <span className="font-black text-[#e26a1b]">£{(Number(item.price) * item.quantity).toFixed(2)}</span>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#1e272e] rounded-md transition-colors shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1e272e]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#1e272e] rounded-md transition-colors shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10 hover:border-red-100 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="bg-white border-t border-gray-100 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] relative z-10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-[#1e272e]">£{getCartTotal().toFixed(2)}</span>
            </div>
            
            <button className="w-full bg-[#e26a1b] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#c95d17] transition-colors shadow-lg shadow-[#e26a1b]/30 hover:shadow-[#e26a1b]/50 hover:-translate-y-0.5">
              Proceed to Checkout
            </button>
          </div>
        )}
        
      </div>
    </>
  );
};

export default CartDrawer;
