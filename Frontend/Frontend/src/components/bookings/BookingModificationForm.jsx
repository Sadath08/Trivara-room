import { useState } from 'react';
import { Calendar, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import axios from 'axios';

export default function BookingModificationForm({ booking, onSuccess }) {
    const [newStartDate, setNewStartDate] = useState(booking.start_date.split('T')[0]);
    const [newEndDate, setNewEndDate] = useState(booking.end_date.split('T')[0]);
    const [newGuests, setNewGuests] = useState(booking.guests);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const handleModify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8000/api/bookings/${booking.id}/modify`,
                {
                    new_start_date: new Date(newStartDate).toISOString(),
                    new_end_date: new Date(newEndDate).toISOString(),
                    new_guests: newGuests,
                    modification_reason: reason
                },
                {
                    headers: { 'Author': `Bearer ${token}` }
                }
            );

            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to modify booking');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:8000/api/bookings/${booking.id}/cancel`,
                {
                    cancellation_reason: reason
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to cancel booking');
        } finally {
            setLoading(false);
            setShowCancelConfirm(false);
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-xl font-medium text-graphite dark:text-ivory mb-6">
                Modify Booking
            </h3>

            <form onSubmit={handleModify} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                            Check-in Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                            <input
                                type="date"
                                value={newStartDate}
                                onChange={(e) => setNewStartDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                            Check-out Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                            <input
                                type="date"
                                value={newEndDate}
                                onChange={(e) => setNewEndDate(e.target.value)}
                                min={newStartDate}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                        Number of Guests
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                        <input
                            type="number"
                            value={newGuests}
                            onChange={(e) => setNewGuests(parseInt(e.target.value))}
                            min={1}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                        Reason (Optional)
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        placeholder="Why are you modifying this booking?"
                        className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate resize-none font-light"
                    />
                </div>

                {error && (
                    <p className="text-sm text-status-failure font-light">{error}</p>
                )}

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setShowCancelConfirm(true)}
                        variant="secondary"
                        className="flex-1"
                    >
                        Cancel Booking
                    </Button>
                </div>
            </form>

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setShowCancelConfirm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-ivory-bone dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-graphite dark:text-ivory">
                                Cancel Booking?
                            </h3>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="text-neutral hover:text-graphite"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-neutral font-light mb-6">
                            Cancellation policy: <span className="font-medium">{booking.cancellation_policy}</span>
                        </p>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Processing...' : 'Confirm Cancellation'}
                            </Button>
                            <Button
                                onClick={() => setShowCancelConfirm(false)}
                                variant="secondary"
                                className="flex-1"
                            >
                                Keep Booking
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </Card>
    );
}
