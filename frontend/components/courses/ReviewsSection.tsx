"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsSectionProps {
  courseId: string;
  isEnrolled: boolean;
  onReviewAdded?: () => void;
}

export default function ReviewsSection({ courseId, isEnrolled, onReviewAdded }: ReviewsSectionProps) {
  const { isAuthenticated, token, user } = useAuth();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/reviews`);
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
          // Check if current user has reviewed
          if (user) {
            const userReview = data.reviews.find((r: Review) => r.user_name === user.name);
            setHasReviewed(!!userReview);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId, user]);

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Review submitted successfully!");
        setUserRating(0);
        setUserComment("");
        setHasReviewed(true);
        // Refresh reviews
        const refreshResponse = await fetch(`${API_URL}/courses/${courseId}/reviews`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setReviews(refreshData.reviews);
        }
        if (onReviewAdded) onReviewAdded();
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to render stars
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => setUserRating(star) : undefined}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
            disabled={!interactive}
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Review Form - Only shown if enrolled and not reviewed */}
      {isAuthenticated && isEnrolled && !hasReviewed && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              {renderStars(userRating, true)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience with this course..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Already Reviewed Message */}
      {isAuthenticated && isEnrolled && hasReviewed && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-green-700">✅ You've already reviewed this course. Thank you for your feedback!</p>
        </div>
      )}

      {/* Not Enrolled Message */}
      {isAuthenticated && !isEnrolled && (
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-yellow-700">📚 Enroll in this course to leave a review.</p>
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-blue-700">🔐 <a href="/login" className="underline">Log in</a> to leave a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Student Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.user_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}