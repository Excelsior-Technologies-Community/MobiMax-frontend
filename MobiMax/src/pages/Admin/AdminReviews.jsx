import React, { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/reviews');
        const json = await res.json();
        if (json.status === 'success') {
          setReviews(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor all product reviews submitted by users.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100/80 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e26a1b]"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No reviews have been submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(r => (
              <div key={r.id} className="p-6 hover:bg-[#F8F9FB] transition-colors duration-150">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{r.user_name || 'Anonymous User'}</h4>
                    <p className="text-xs text-gray-500 mt-1">on <span className="font-semibold">{r.product_title || 'Unknown Product'}</span></p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-600">{r.rating}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-3">
                  "{r.comment}"
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
