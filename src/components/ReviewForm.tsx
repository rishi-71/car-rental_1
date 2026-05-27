"use client";

import React, {useState} from "react";

interface ReviewFormProps {
    carId : string,
    onSuccess? :()=> void;
}

export default function ReviewForm({ carId, onSuccess} : ReviewFormProps){
    const [rating,setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message,setMessage] = useState<{type : "success" | 'error', text : string} |null>(null);

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        if(rating === 0){
          setMessage({ type: 'error', text: 'Please select a star rating.' });
      return;  
        }
        setIsSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch('/api/reviews',{
                method:'POST',
                headers:{ 'Content-Type':'application/json'},
                body:JSON.stringify({carId, rating, comment}),
            });
            const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Thank you for your review!' });
        setRating(0);
        setComment("");
        if (onSuccess) {
          setTimeout(onSuccess, 2000); // Optional callback to close the form after 2 seconds
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit review.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };
    return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4">
      <h4 className="text-lg font-bold text-slate-900 mb-4">Leave a Review</h4>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating System */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <svg 
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-300'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comment Text Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your Experience</label>
          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the car? Did the host communicate well?"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 resize-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting...' : 'Post Review'}
        </button>
      </form>
    </div>
  );   
    }