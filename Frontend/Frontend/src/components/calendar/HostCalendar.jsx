import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import axios from 'axios';

export default function HostCalendar({ roomId }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);
    const [priceOverrides, setPriceOverrides] = useState({});
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [overridePrice, setOverridePrice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        setOverridePrice(priceOverrides[dateStr] || '');
        setShowPriceModal(true);
    };

    const handleBlockDate = async () => {
        if (!selectedDate) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const dateStr = selectedDate.toISOString().split('T')[0];

            await axios.post(
                'http://localhost:8000/api/availability',
                {
                    room_id: roomId,
                    date: dateStr,
                    is_available: false
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setBlockedDates([...blockedDates, dateStr]);
            setShowPriceModal(false);
        } catch (error) {
            console.error('Failed to block date:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrice = async () => {
        if (!selectedDate || !overridePrice) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const dateStr = selectedDate.toISOString().split('T')[0];

            await axios.post(
                'http://localhost:8000/api/availability',
                {
                    room_id: roomId,
                    date: dateStr,
                    is_available: true,
                    price_override: parseFloat(overridePrice)
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setPriceOverrides({ ...priceOverrides, [dateStr]: overridePrice });
            setShowPriceModal(false);
        } catch (error) {
            console.error('Failed to set price:', error);
        } finally {
            setLoading(false);
        }
    };

    const tileClassName = ({ date }) => {
        const dateStr = date.toISOString().split('T')[0];
        if (blockedDates.includes(dateStr)) {
            return 'blocked-date';
        }
        if (priceOverrides[dateStr]) {
            return 'price-override-date';
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <style>{`
        .react-calendar {
          border: none;
          background: var(--color-bone);
          border-radius: 0.75rem;
          padding: 1.5rem;
          font-family: inherit;
        }
        .react-calendar__tile {
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.875rem;
          font-weight: 300;
        }
        .react-calendar__tile:enabled:hover {
          background-color: var(--color-neutral-100);
        }
        .react-calendar__tile--active {
          background-color: var(--color-accent-slate) !important;
          color: var(--color-ivory);
        }
        .blocked-date {
          background-color: var(--color-neutral-200) !important;
          text-decoration: line-through;
          color: var(--color-neutral);
        }
        .price-override-date {
          background-color: var(--color-accent-moss-lighter) !important;
          font-weight: 500;
        }
      `}</style>

            <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                tileClassName={tileClassName}
                minDate={new Date()}
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-neutral-200"></div>
                    <span className="text-sm font-light text-neutral">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-accent-moss-lighter"></div>
                    <span className="text-sm font-light text-neutral">Custom Price</span>
                </div>
            </div>

            {showPriceModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setShowPriceModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-ivory-bone dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">
                            {selectedDate && selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-light text-neutral mb-2">
                                    Custom Price (₹)
                                </label>
                                <input
                                    type="number"
                                    value={overridePrice}
                                    onChange={(e) => setOverridePrice(e.target.value)}
                                    placeholder="Enter custom price"
                                    className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSetPrice}
                                    disabled={!overridePrice || loading}
                                    className="flex-1"
                                >
                                    Set Price
                                </Button>
                                <Button
                                    onClick={handleBlockDate}
                                    disabled={loading}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Block Date
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
