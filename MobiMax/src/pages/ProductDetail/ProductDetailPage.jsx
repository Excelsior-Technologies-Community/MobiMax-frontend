import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, Package, Mail, MessageSquare, ShoppingBag, X, Heart, Star, ChevronRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const MOCK_REVIEWS = [
  { id: 1, user: "Alex T.", rating: 5, date: "2 days ago", comment: "Excellent quality product! Fits perfectly and works exactly as described. The delivery was also very fast." },
  { id: 2, user: "Sarah M.", rating: 4, date: "1 week ago", comment: "Good value for money. The packaging was a bit damaged but the product itself is solid." },
  { id: 3, user: "James R.", rating: 5, date: "2 weeks ago", comment: "Highly recommend this partner store. The customer service was great when I had a question." }
];

const MOCK_RELATED = [
  { id: 'r1', title: 'Premium Brake Fluid DOT 4', price: '12.99', oldPrice: '15.99', image_url: 'https://images.unsplash.com/photo-1635830625698-3b9bd74671ca?auto=format&fit=crop&q=80&w=400', in_stock: true, category: 'Brake Discs & Pads' },
  { id: 'r2', title: 'Performance Caliper Paint', price: '18.50', image_url: 'https://images.unsplash.com/photo-1621644782299-d59048a609d6?auto=format&fit=crop&q=80&w=400', in_stock: true, category: 'Brake Discs & Pads' },
  { id: 'r3', title: 'Heavy Duty Jack Stands', price: '45.00', oldPrice: '55.00', image_url: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=400', in_stock: false, category: 'Accessories' },
  { id: 'r4', title: 'Ceramic Brake Paste', price: '8.99', image_url: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400', in_stock: true, category: 'Brake Discs & Pads' },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bulkOrderForm, setBulkOrderForm] = useState({ name: '', email: '', phone: '', quantity: '', message: '' });
  
  const [formStatus, setFormStatus] = useState(null); 

  // Cart & Wishlist hooks
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/public/product/${id}`);
        const result = await response.json();
        if (result.status === 'success') {
          setProduct(result.data);
        } else {
          setError(result.message || 'Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.in_stock) return;
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    try {
      const response = await fetch(`http://localhost:5001/api/public/store/${product.partner_id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setFormStatus({ type: 'success', message: 'Message sent successfully to the store!' });
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setShowContactModal(false), 2000);
      } else {
        setFormStatus({ type: 'error', message: result.message || 'Failed to send message' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  const handleBulkOrderSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    try {
      const response = await fetch(`http://localhost:5001/api/public/product/${product.id}/bulk-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkOrderForm)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setFormStatus({ type: 'success', message: 'Bulk order request submitted successfully! The store will contact you soon.' });
        setBulkOrderForm({ name: '', email: '', phone: '', quantity: '', message: '' });
        setTimeout(() => setShowBulkOrderModal(false), 2000);
      } else {
        setFormStatus({ type: 'error', message: result.message || 'Failed to submit bulk order request' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#e26a1b] border-r-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center py-20 px-4">
        <div className="bg-red-50 text-red-500 p-8 rounded-3xl text-center font-bold max-w-md w-full shadow-lg border border-red-100">
          <Package className="w-16 h-16 mx-auto mb-5 text-red-400" />
          <p className="text-xl">{error || 'Product not found'}</p>
          <Link to="/" className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl inline-block transition-colors shadow-md">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 pt-8">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/category/${encodeURIComponent(product.category)}/stores`} className="inline-flex items-center text-gray-500 hover:text-[#e26a1b] font-bold text-sm transition-colors group px-4 py-2 rounded-xl bg-white/50 border border-gray-100 hover:bg-white shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Category
          </Link>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-16 relative">
          
          {/* Wishlist Button */}
          <button 
            onClick={() => toggleWishlist(product)}
            className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform group"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-[#e55039] text-[#e55039]' : 'text-gray-400 group-hover:text-[#e55039]'}`} />
          </button>

          {/* Product Image Section */}
          <div className="md:w-1/2 bg-gray-50/50 p-10 flex flex-col items-center justify-center relative min-h-[450px] border-r border-gray-50">
            {product.oldPrice && product.in_stock && (
              <div className="absolute top-6 left-6 bg-[#e26a1b] text-white text-xs font-black px-4 py-1.5 rounded-lg uppercase tracking-wider z-10 shadow-[0_4px_12px_rgba(226,106,27,0.3)]">
                -{(100 - (product.price / product.oldPrice) * 100).toFixed(0)}% OFF
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute top-6 left-6 bg-[#1e272e] text-white text-xs font-black px-4 py-1.5 rounded-lg uppercase tracking-wider z-10 shadow-md">
                OUT OF STOCK
              </div>
            )}
            
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={product.image_url} 
                alt={product.title} 
                className={`max-w-full max-h-[400px] object-contain drop-shadow-2xl mix-blend-multiply hover:scale-105 transition-transform duration-500 ${!product.in_stock ? 'grayscale opacity-60' : ''}`}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-8 lg:p-14 flex flex-col">
            <div className="inline-flex items-center gap-1.5 bg-[#e26a1b]/10 text-[#e26a1b] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider w-max mb-5 border border-[#e26a1b]/20">
              <Package className="w-3.5 h-3.5" /> {product.category}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-black text-[#1e272e] leading-tight mb-3 tracking-tight">
              {product.title}
            </h1>
            
            {/* Mock Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-[#ff9f43]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current opacity-30" />
              </div>
              <span className="text-sm font-bold text-gray-500 hover:text-[#e26a1b] cursor-pointer transition-colors">(3 Reviews)</span>
            </div>

            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-4xl lg:text-5xl font-black text-[#e26a1b] tracking-tight">£{Number(product.price).toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through mb-1.5 font-bold">£{Number(product.oldPrice).toFixed(2)}</span>
              )}
            </div>

            <div className="mb-8 flex-1">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                {product.description || "No description provided for this product."}
              </p>
              
              {/* Trust Badges */}
              <div className="mt-6 flex gap-6">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Genuine Part
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                  <Truck className="w-5 h-5 text-[#e26a1b]" /> Fast Shipping
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <button 
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  !product.in_stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 
                  addedToCart ? 'bg-green-500 text-white shadow-green-500/30 hover:-translate-y-1' : 
                  'bg-[#1e272e] text-white hover:bg-[#e26a1b] hover:shadow-[#e26a1b]/30 hover:-translate-y-1'
                }`}
              >
                {addedToCart ? (
                  <><Check className="w-5 h-5" /> Added to Cart</>
                ) : (
                  <><ShoppingBag className="w-5 h-5" /> {product.in_stock ? 'Add to Cart' : 'Out of Stock'}</>
                )}
              </button>
              
              <button 
                onClick={() => setShowBulkOrderModal(true)}
                className="w-full py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-600 font-black uppercase tracking-widest text-sm hover:border-[#1e272e] hover:text-[#1e272e] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                 Request Bulk Order
              </button>
            </div>

            {/* Store Info Banner */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-[#e26a1b]/20 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 shadow-sm overflow-hidden shrink-0 group-hover:shadow-md transition-shadow">
                {product.store_logo ? (
                  <img src={product.store_logo} alt={product.store_name} className="w-full h-full object-contain" />
                ) : (
                  <Store className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Sold By Partner</p>
                <h4 className="font-black text-[#1e272e] text-sm truncate group-hover:text-[#e26a1b] transition-colors">{product.store_name}</h4>
              </div>
              <button 
                onClick={() => setShowContactModal(true)}
                className="shrink-0 bg-white border border-gray-200 hover:bg-[#e26a1b] hover:border-[#e26a1b] hover:text-white text-gray-500 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-[#e26a1b]/20"
                title="Contact Store"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Product Suggestions & Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Related Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-[#1e272e] uppercase tracking-tight mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#e26a1b]" /> Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_RELATED.map(item => (
                <Link to={`/product/${item.id}`} key={item.id} className={`group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#e26a1b]/30 p-5 flex flex-col relative transition-all duration-300 transform hover:-translate-y-1 block ${!item.in_stock ? 'opacity-80' : ''}`}>
                  {!item.in_stock && (
                    <div className="absolute top-4 left-4 z-10 bg-[#1e272e] text-white px-2 py-1 font-black text-[9px] uppercase tracking-widest rounded shadow-sm">
                      Out of Stock
                    </div>
                  )}
                  <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative group-hover:bg-gray-100 transition-colors">
                    <img src={item.image_url} alt={item.title} className={`w-full h-full object-cover mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500 ${!item.in_stock ? 'grayscale opacity-70' : ''}`} />
                  </div>
                  <h3 className="text-[#1e272e] font-black text-[15px] mb-1 line-clamp-2 leading-tight group-hover:text-[#e26a1b] transition-colors">{item.title}</h3>
                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div className="flex flex-col">
                      {item.oldPrice && <span className="text-gray-400 text-[10px] font-bold line-through mb-0.5">£{item.oldPrice}</span>}
                      <span className="text-[#e26a1b] font-black text-lg">£{item.price}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#1e272e] group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black text-[#1e272e] uppercase tracking-tight mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#ff9f43]" /> Customer Reviews
            </h2>
            
            {/* Reviews Summary */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-5xl font-black text-[#1e272e]">4.8</div>
                <div className="flex flex-col">
                  <div className="flex text-[#ff9f43] mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-50" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Based on 3 reviews</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 w-8 font-bold text-gray-600">
                      {star} <Star className="w-3 h-3 text-gray-400 fill-current" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff9f43] rounded-full" style={{ width: star === 5 ? '66%' : star === 4 ? '33%' : '0%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-sm text-[#1e272e]">{review.user}</span>
                    <span className="text-[10px] font-bold text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex text-[#ff9f43] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>

      {/* Contact Store Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#1e272e]/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <div className="bg-gradient-to-r from-[#1e272e] to-gray-800 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              <h3 className="font-black text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#e26a1b]" /> Contact {product.store_name}
              </h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-white transition-colors bg-white/10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              {formStatus && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Message</label>
                  <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all resize-none" placeholder={`I have a question about ${product.title}...`}></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-[#e26a1b] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#d05c14] transition-all shadow-lg shadow-[#e26a1b]/30 hover:shadow-[#e26a1b]/50 hover:-translate-y-0.5">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Modal */}
      {showBulkOrderModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#1e272e]/80 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto border border-white/20">
            <div className="bg-gradient-to-r from-[#1e272e] to-gray-800 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              <h3 className="font-black text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-[#e26a1b]" /> Request Bulk Order
              </h3>
              <button onClick={() => setShowBulkOrderModal(false)} className="text-gray-400 hover:text-white transition-colors bg-white/10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm z-10 relative">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-xl p-2 border border-gray-100 shrink-0 shadow-sm">
                   <img src={product.image_url} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-black text-[#1e272e] line-clamp-1">{product.title}</h4>
                  <p className="text-[#e26a1b] font-black text-sm">£{Number(product.price).toFixed(2)} / unit</p>
                </div>
              </div>

              {formStatus && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleBulkOrderSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
                    <input type="text" required value={bulkOrderForm.name} onChange={(e) => setBulkOrderForm({...bulkOrderForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Required Quantity</label>
                    <input type="number" min="5" required value={bulkOrderForm.quantity} onChange={(e) => setBulkOrderForm({...bulkOrderForm, quantity: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-[#e26a1b] focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all" placeholder="e.g. 50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" required value={bulkOrderForm.email} onChange={(e) => setBulkOrderForm({...bulkOrderForm, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                    <input type="tel" required value={bulkOrderForm.phone} onChange={(e) => setBulkOrderForm({...bulkOrderForm, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all" placeholder="+44 20 7123 4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Additional Details (Optional)</label>
                  <textarea rows={3} value={bulkOrderForm.message} onChange={(e) => setBulkOrderForm({...bulkOrderForm, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b] focus:bg-white outline-none transition-all resize-none" placeholder="Any specific requirements or timeline..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-[#1e272e] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#e26a1b] transition-all shadow-lg hover:shadow-[#e26a1b]/30 hover:-translate-y-0.5">
                  Submit Bulk Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
