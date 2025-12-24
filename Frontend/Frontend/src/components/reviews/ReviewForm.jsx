import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import axios from 'axios';

export default function ReviewForm({ bookingId, roomId, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/api/reviews',
                {
                    booking_id: bookingId,
                    room_id: roomId,
                    rating,
                    comment
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (onSubmit) {
                onSubmit(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-3">
                    Your Rating
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(value)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                size={32}
                                className={`transition-colors ${value <= (hoverRating || rating)
                                        ? 'fill-accent-slate text-accent-slate'
                                        : 'text-neutral-300 dark:text-neutral-600'
                                    }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-3 text-lg font-medium text-graphite dark:text-ivory">
                            {rating}.0
                        </span>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                    Your Review (Optional)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 rounded-lg bg-ivory-bone dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate transition-all duration-300 font-light resize-none"
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-status-failure font-light"
                >
                    {error}
                </motion.p>
            )}

            <Button
                type="submit"
                disabled={submitting || rating === 0}
                fullWidth
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    );
}
