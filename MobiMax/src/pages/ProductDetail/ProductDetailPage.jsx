import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Package, X, Heart, Star, ChevronRight, Check, Search } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bulkOrderForm, setBulkOrderForm] = useState({ name: '', email: '', phone: '', quantity: '', message: '' });
  const [reviewForm, setReviewForm] = useState({ user_name: '', rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState(null);
  
  const [formStatus, setFormStatus] = useState(null); 

  // Cart & Wishlist hooks
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productRes, relatedRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:5001/api/public/product/${id}`),
          fetch(`http://localhost:5001/api/public/product/${id}/related`),
          fetch(`http://localhost:5001/api/public/product/${id}/reviews`)
        ]);

        const productData = await productRes.json();
        const relatedData = await relatedRes.json();
        const reviewsData = await reviewsRes.json();

        if (productData.status === 'success') {
          setProduct(productData.data);
          if (relatedData.status === 'success') setRelatedProducts(relatedData.data);
          if (reviewsData.status === 'success') setReviews(reviewsData.data);
        } else {
          setError(productData.message || 'Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.in_stock) return;
    
    // Add product to cart with quantity
    addToCart({ ...product, quantity: parseInt(quantity, 10) });
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewStatus(null);
    try {
      const response = await fetch(`http://localhost:5001/api/public/product/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setReviewStatus({ type: 'success', message: 'Review submitted successfully!' });
        
        const newReview = {
          id: result.data.id,
          user_name: reviewForm.user_name,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          created_at: new Date().toISOString()
        };
        setReviews([newReview, ...reviews]);
        
        setReviewForm({ user_name: '', rating: 5, comment: '' });
        setTimeout(() => setReviewStatus(null), 3000);
      } else {
        setReviewStatus({ type: 'error', message: result.message || 'Failed to submit review' });
      }
    } catch (err) {
      setReviewStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ffd000] border-r-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center py-20 px-4">
        <div className="bg-red-50 text-red-500 p-8 rounded text-center max-w-md w-full border border-red-100">
          <p className="text-xl mb-4">{error || 'Product not found'}</p>
          <Link to="/" className="bg-[#1e272e] text-white px-6 py-2 uppercase text-sm font-bold">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="bg-white min-h-screen font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-12 pb-24">
        
        {/* Main Product Section */}
        <div className="flex flex-col md:flex-row gap-10 mb-16">
          
          {/* Left Column: Image */}
          <div className="md:w-1/2 relative flex justify-center items-center p-8 bg-white group">
            <div className="absolute top-4 right-4 z-10 bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            
            <img 
              src={product.image_url} 
              alt={product.title} 
              className={`max-w-full max-h-[450px] object-contain ${!product.in_stock ? 'grayscale opacity-60' : ''}`}
            />
          </div>

          {/* Right Column: Details */}
          <div className="md:w-1/2">
            <div className="border border-gray-100 p-8 md:p-10 shadow-sm h-full flex flex-col bg-white">
              <h1 className="text-2xl font-bold text-[#1e272e] leading-snug mb-4">
                {product.title}
              </h1>
              
              <div className="text-2xl font-bold text-[#e26a1b] mb-4">
                £{Number(product.price).toFixed(2)}
              </div>
              
              <div className="mb-6 flex items-center gap-2">
                <div className="inline-flex items-center gap-1 border border-gray-200 px-3 py-1.5 text-xs text-gray-600 cursor-pointer">
                  🇬🇧 £ GBP <ChevronRight className="w-3 h-3 rotate-90 ml-1" />
                </div>
              </div>

              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 flex-1">
                {product.description ? 
                  product.description.length > 150 ? product.description.substring(0, 150) + '...' : product.description 
                  : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore."
                }
              </p>

              {/* Add to Cart Actions */}
              <div className="flex items-center gap-3 mb-4">
                <input 
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-16 h-12 border border-gray-200 text-center text-gray-600 focus:outline-none focus:border-gray-400"
                />
                <button 
                  disabled={!product.in_stock}
                  onClick={handleAddToCart}
                  className={`h-12 px-8 font-bold uppercase text-[13px] tracking-wider transition-colors flex items-center gap-2 ${
                    !product.in_stock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                    addedToCart ? 'bg-green-500 text-white' : 
                    'bg-[#ffd000] text-[#1e272e] hover:bg-[#e6bb00]'
                  }`}
                >
                  {addedToCart ? <><Check className="w-4 h-4" /> Added</> : 'Add to cart'}
                </button>
              </div>

              <div className="mb-8">
                <button 
                  onClick={() => setShowBulkOrderModal(true)}
                  className="bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Check className="w-3 h-3" /> Compare
                </button>
              </div>

              {/* Wishlist Link */}
              <div className="flex items-center justify-center border-b border-gray-100 pb-6 mb-6">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-[13px]"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-gray-800 text-gray-800' : ''}`} /> 
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </button>
              </div>

              {/* Metadata */}
              <div className="text-[13px] text-gray-500 mb-6 space-y-1">
                <div>Category: <span className="text-gray-800">{product.category}</span></div>
                <div>Tag: <span className="text-gray-800">Universal</span></div>
                {product.store_name && (
                  <div>Store: <button onClick={() => setShowContactModal(true)} className="text-[#e26a1b] hover:underline cursor-pointer">{product.store_name}</button></div>
                )}
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center cursor-pointer hover:opacity-80">
                  <span className="font-bold text-sm">f</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00aced] text-white flex items-center justify-center cursor-pointer hover:opacity-80">
                  <span className="font-bold text-sm">t</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#cb2027] text-white flex items-center justify-center cursor-pointer hover:opacity-80">
                  <div className="font-serif font-bold italic text-sm">P</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#007bb6] text-white flex items-center justify-center cursor-pointer hover:opacity-80">
                  <span className="font-bold text-sm">in</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Tabbed Section */}
        <div className="mb-20">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 py-3 text-[13px] font-bold uppercase tracking-wider ${activeTab === 'description' ? 'bg-[#e26a1b] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('additional')}
              className={`px-8 py-3 text-[13px] font-bold uppercase tracking-wider ${activeTab === 'additional' ? 'bg-[#e26a1b] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'} mx-1`}
            >
              Additional Information
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-3 text-[13px] font-bold uppercase tracking-wider ${activeTab === 'reviews' ? 'bg-[#e26a1b] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Reviews ({reviews.length})
            </button>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="text-gray-500 text-[15px] leading-relaxed max-w-4xl">
                <p>
                  {product.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id."}
                </p>
              </div>
            )}
            
            {activeTab === 'additional' && (
              <div className="text-gray-500 text-[15px]">
                <table className="w-full max-w-md border-collapse border border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-bold bg-gray-50 w-1/3">Weight</td>
                      <td className="p-3">2.5 kg</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-bold bg-gray-50">Dimensions</td>
                      <td className="p-3">20 × 15 × 10 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-gray-50">Brand</td>
                      <td className="p-3">Mobimax</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-bold text-[#1e272e] mb-6">{reviews.length} review{reviews.length !== 1 ? 's' : ''} for {product.title}</h3>
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {reviews.length > 0 ? reviews.map(review => (
                      <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                           <Star className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[#1e272e] text-sm">{review.user_name}</span>
                            <span className="text-gray-400 text-xs">– {new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex text-[#ffd000] mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 italic">There are no reviews yet.</p>
                    )}
                  </div>
                </div>

                {/* Add Review Form */}
                <div>
                  <h3 className="text-lg font-bold text-[#1e272e] mb-2">Add a review</h3>
                  <p className="text-sm text-gray-500 mb-6">Your email address will not be published. Required fields are marked *</p>
                  
                  {reviewStatus && (
                    <div className={`mb-4 p-3 text-sm border ${reviewStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {reviewStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Your rating *</span>
                      <div className="flex text-[#ffd000]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                            className={`w-4 h-4 cursor-pointer ${star <= reviewForm.rating ? 'fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Your review *</label>
                      <textarea required rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-400 resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Name *</label>
                        <input type="text" required value={reviewForm.user_name} onChange={(e) => setReviewForm({...reviewForm, user_name: e.target.value})} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email *</label>
                        <input type="email" required className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-400" />
                      </div>
                    </div>
                    
                    <button type="submit" className="bg-[#1e272e] text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#e26a1b] transition-colors mt-2">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1e272e] mb-8 pb-4 border-b border-gray-100">
              Related products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(item => (
                <Link to={`/product/${item.id}`} key={item.id} className="group flex flex-col">
                  <div className="relative mb-3 overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                    {/* Hover Actions Overlay placeholder */}
                  </div>
                  <h3 className="text-[#e26a1b] text-[13px] mb-1 truncate">{item.category}</h3>
                  <h4 className="text-[#1e272e] font-bold text-sm mb-2 line-clamp-2 hover:text-[#e26a1b] transition-colors">{item.title}</h4>
                  <div className="mt-auto">
                    <span className="text-[#1e272e] font-bold">£{Number(item.price).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modals remain the same */}
      {/* Contact Store Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#1e272e]/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#f8f9fa] border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#1e272e]">Contact Store</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {formStatus && (
                <div className={`mb-4 p-3 text-sm border ${formStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Message</label>
                  <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-[#1e272e] text-white font-bold uppercase text-sm hover:bg-[#e26a1b] transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Modal */}
      {showBulkOrderModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#1e272e]/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden my-auto border border-gray-200">
            <div className="bg-[#f8f9fa] border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#1e272e]">Request Bulk Order</h3>
              <button onClick={() => setShowBulkOrderModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {formStatus && (
                <div className={`mb-4 p-3 text-sm border ${formStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleBulkOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                    <input type="text" required value={bulkOrderForm.name} onChange={(e) => setBulkOrderForm({...bulkOrderForm, name: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Required Quantity</label>
                    <input type="number" min="5" required value={bulkOrderForm.quantity} onChange={(e) => setBulkOrderForm({...bulkOrderForm, quantity: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input type="email" required value={bulkOrderForm.email} onChange={(e) => setBulkOrderForm({...bulkOrderForm, email: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input type="tel" required value={bulkOrderForm.phone} onChange={(e) => setBulkOrderForm({...bulkOrderForm, phone: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Message</label>
                  <textarea rows={3} value={bulkOrderForm.message} onChange={(e) => setBulkOrderForm({...bulkOrderForm, message: e.target.value})} className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-[#1e272e] text-white font-bold uppercase text-sm hover:bg-[#e26a1b] transition-colors">
                  Submit Request
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
