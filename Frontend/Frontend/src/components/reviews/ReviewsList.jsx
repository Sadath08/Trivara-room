import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ReviewsList({ roomId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [roomId]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reviews/room/${roomId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="text-neutral font-light">Loading reviews...</div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral font-light">No reviews yet</p>
                <p className="text-sm text-neutral font-light mt-2">Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review, index) => (
                <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="pb-6 border-b border-neutral-200 dark:border-neutral-700 last:border-none last:pb-0"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h4 className="font-medium text-graphite dark:text-ivory">
                                {review.user_name || 'Anonymous'}
                            </h4>
                            <p className="text-sm text-neutral font-light mt-0.5">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-accent-slate/10 px-3 py-1 rounded-full">
                            <span className="text-lg font-medium text-accent-slate">
                                {review.rating}.0
                            </span>
                        </div>
                    </div>

                    {review.comment && (
                        <p className="text-graphite dark:text-neutral-300 font-light leading-relaxed">
                            {review.comment}
                        </p>
                    )}

                    {review.is_verified && (
                        <div className="mt-3 inline-flex items-center gap-1 text-xs text-neutral font-light">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified booking
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
