import React from 'react';
import { Heart, ShoppingBag, Trash2, ChevronRight, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header Banner */}
      <div className="bg-[#1e272e] pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e26a1b] via-transparent to-transparent"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <Heart className="w-12 h-12 text-[#e55039] mx-auto mb-4 fill-[#e55039]" />
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">My Wishlist</h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto">Keep track of the parts you love. Add them to your cart when you're ready to buy.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 -mt-10">
        
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <PackageOpen className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-[#1e272e] uppercase mb-3 tracking-tight">Your Wishlist is Empty</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg mb-8">
              You haven't saved any items yet. Start browsing to find the perfect parts for your vehicle!
            </p>
            <Link to="/" className="bg-[#e26a1b] hover:bg-[#c95d17] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-[#e26a1b]/30 hover:-translate-y-0.5">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map(product => (
              <div key={product.id} className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl border border-gray-100 hover:border-[#e26a1b]/30 flex flex-col relative transition-all duration-300 transform hover:-translate-y-1">
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 bg-white border border-gray-100 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Badges */}
                {product.oldPrice && product.in_stock && (
                  <div className="absolute top-4 left-4 z-10 bg-[#e26a1b] text-white px-2 py-1 font-black text-[10px] uppercase tracking-widest rounded shadow-sm">
                    Sale
                  </div>
                )}
                {!product.in_stock && (
                  <div className="absolute top-4 left-4 z-10 bg-[#1e272e] text-white px-2 py-1 font-black text-[10px] uppercase tracking-widest rounded shadow-sm">
                    Out of Stock
                  </div>
                )}

                <Link to={`/product/${product.id}`} className="p-5 block h-full flex flex-col">
                  <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-5 overflow-hidden relative group-hover:bg-gray-100 transition-colors p-4">
                    <img src={product.image_url} alt={product.title} className={`w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500 ${!product.in_stock ? 'grayscale opacity-70' : ''}`} />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{product.category}</span>
                    <h3 className="text-[#1e272e] font-black text-lg mb-2 line-clamp-2 leading-tight group-hover:text-[#e26a1b] transition-colors">{product.title}</h3>
                    
                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
                      <div className="flex flex-col">
                        {product.oldPrice && <span className="text-gray-400 text-xs font-bold line-through mb-0.5">£{Number(product.oldPrice).toFixed(2)}</span>}
                        <span className="text-[#e26a1b] font-black text-xl">£{Number(product.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-5 pt-0 mt-auto">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.in_stock}
                    className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                      !product.in_stock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1e272e] text-white hover:bg-[#e26a1b] shadow-lg hover:shadow-[#e26a1b]/30 hover:-translate-y-0.5'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" /> {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
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

export default WishlistPage;
