import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';

export default function FiltersPanel({ isOpen, onClose, filters, onChange, onClear }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        onChange(localFilters);
        onClose();
    };

    const handleClear = () => {
        const clearedFilters = {
            property_type: [],
            min_price: null,
            max_price: null,
            bedrooms: null,
            beds: null,
            bathrooms: null,
            amenities: [],
            booking_options: [],
            is_guest_favourite: false,
            is_luxe: false,
        };
        setLocalFilters(clearedFilters);
        onClear();
        onClose();
    };

    const toggleArrayFilter = (category, value) => {
        const current = localFilters[category] || [];
        const newValue = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        setLocalFilters({ ...localFilters, [category]: newValue });
    };

    const updateCounter = (field, delta) => {
        const currentValue = localFilters[field] || 0;
        const newValue = Math.max(0, currentValue + delta);
        setLocalFilters({ ...localFilters, [field]: newValue || null });
    };

    const propertyTypes = [
        { value: 'house', label: 'House', icon: '🏠' },
        { value: 'apartment', label: 'Flat', icon: '🏢' },
        { value: 'room', label: 'Room', icon: '🚪' },
        { value: 'guest_house', label: 'Guest house', icon: '🏡' },
    ];

    const amenities = [
        { value: 'ac', label: 'Air conditioning', icon: '❄️' },
        { value: 'washing_machine', label: 'Washing machine', icon: '🧺' },
        { value: 'private_bathroom', label: 'Private attached bathroom', icon: '🚿' },
        { value: 'parking', label: 'Free parking', icon: '🅿️' },
        { value: 'wifi', label: 'Wifi', icon: '📶' },
        { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
        { value: 'pool', label: 'Pool', icon: '🏊' },
        { value: 'tv', label: 'TV', icon: '📺' },
        { value: 'fireplace', label: 'Fireplace', icon: '🔥' },
        { value: 'heating', label: 'Heating', icon: '🌡️' },
    ];

    const bookingOptions = [
        { value: 'instant_book', label: 'Instant Book', icon: '⚡' },
        { value: 'self_checkin', label: 'Self check-in', icon: '🔑' },
        { value: 'allows_pets', label: 'Allows pets', icon: '🐾' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-graphite/50 z-40"
                    />

                    {/* Filter Panel - Bone White background */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-ivory-bone dark:bg-neutral-900 z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-ivory-bone dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between">
                            <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                                <X size={24} className="text-graphite dark:text-ivory" />
                            </button>
                            <h2 className="text-xl font-medium text-graphite dark:text-ivory">Filters</h2>
                            <button onClick={handleClear} className="text-sm font-medium text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors underline">
                                Clear all
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Property Type - No chips with color fill, border/text only */}
                            <div className="pb-8 border-b border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">Property type</h3>
                                <div className="flex flex-wrap gap-3">
                                    {propertyTypes.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => toggleArrayFilter('property_type', type.value)}
                                            className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${(localFilters.property_type || []).includes(type.value)
                                                    ? 'bg-accent-slate/10 dark:bg-accent-slate/20 text-graphite dark:text-ivory border border-accent-slate'
                                                    : 'bg-transparent text-graphite dark:text-ivory border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                                }`}
                                        >
                                            <span className="text-2xl">{type.icon}</span>
                                            <span className="font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range - No green/red indicators */}
                            <div className="pb-8 border-b border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">Price range</h3>
                                <p className="text-sm text-neutral dark:text-neutral-400 font-light mb-4">Trip price, includes all fees</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-neutral dark:text-neutral-400 font-light mb-1">Minimum</label>
                                        <input
                                            type="number"
                                            placeholder="₹0"
                                            value={localFilters.min_price || ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, min_price: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="w-full px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:ring-1 focus:ring-accent-slate outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral dark:text-neutral-400 font-light mb-1">Maximum</label>
                                        <input
                                            type="number"
                                            placeholder="₹10000+"
                                            value={localFilters.max_price || ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, max_price: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="w-full px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:ring-1 focus:ring-accent-slate outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rooms and Beds */}
                            <div className="pb-8 border-b border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">Rooms and beds</h3>
                                <div className="space-y-4">
                                    {[
                                        { field: 'bedrooms', label: 'Bedrooms' },
                                        { field: 'beds', label: 'Beds' },
                                        { field: 'bathrooms', label: 'Bathrooms' },
                                    ].map(item => (
                                        <div key={item.field} className="flex items-center justify-between">
                                            <span className="text-graphite dark:text-ivory">{item.label}</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateCounter(item.field, -1)}
                                                    className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-full hover:border-neutral-500 transition-colors disabled:opacity-30 text-graphite dark:text-ivory"
                                                    disabled={!localFilters[item.field]}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-12 text-center text-graphite dark:text-ivory font-medium">
                                                    {localFilters[item.field] || 'Any'}
                                                </span>
                                                <button
                                                    onClick={() => updateCounter(item.field, 1)}
                                                    className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-full hover:border-neutral-500 transition-colors text-graphite dark:text-ivory"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="pb-8 border-b border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">Amenities</h3>
                                <div className="flex flex-wrap gap-3">
                                    {amenities.slice(0, 6).map(amenity => (
                                        <button
                                            key={amenity.value}
                                            onClick={() => toggleArrayFilter('amenities', amenity.value)}
                                            className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${(localFilters.amenities || []).includes(amenity.value)
                                                    ? 'bg-accent-slate/10 dark:bg-accent-slate/20 text-graphite dark:text-ivory border border-accent-slate'
                                                    : 'bg-transparent text-graphite dark:text-ivory border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                                }`}
                                        >
                                            <span className="text-xl">{amenity.icon}</span>
                                            <span className="text-sm font-medium">{amenity.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {amenities.length > 6 && (
                                    <button className="text-sm font-medium text-graphite dark:text-ivory mt-4 underline">
                                        Show more
                                    </button>
                                )}
                            </div>

                            {/* Booking Options */}
                            <div className="pb-8 border-b border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">Booking options</h3>
                                <div className="space-y-3">
                                    {bookingOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => toggleArrayFilter('booking_options', option.value)}
                                            className={`w-full px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${(localFilters.booking_options || []).includes(option.value)
                                                    ? 'bg-accent-slate/10 dark:bg-accent-slate/20 text-graphite dark:text-ivory border border-accent-slate'
                                                    : 'bg-transparent text-graphite dark:text-ivory border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                                }`}
                                        >
                                            <span className="text-2xl">{option.icon}</span>
                                            <span className="font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Standout Stays */}
                            <div className="pb-8">
                                <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">Standout stays</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setLocalFilters({ ...localFilters, is_guest_favourite: !localFilters.is_guest_favourite })}
                                        className={`p-4 rounded-xl transition-all ${localFilters.is_guest_favourite
                                                ? 'bg-accent-slate/10 dark:bg-accent-slate/20 text-graphite dark:text-ivory border border-accent-slate'
                                                : 'bg-transparent text-graphite dark:text-ivory border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">🏆</div>
                                        <div className="text-sm font-medium text-graphite dark:text-ivory mb-1">Guest favourite</div>
                                        <div className="text-xs text-neutral dark:text-neutral-400 font-light">The most loved homes on Trivara</div>
                                    </button>
                                    <button
                                        onClick={() => setLocalFilters({ ...localFilters, is_luxe: !localFilters.is_luxe })}
                                        className={`p-4 rounded-xl transition-all ${localFilters.is_luxe
                                                ? 'bg-accent-slate/10 dark:bg-accent-slate/20 text-graphite dark:text-ivory border border-accent-slate'
                                                : 'bg-transparent text-graphite dark:text-ivory border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">💎</div>
                                        <div className="text-sm font-medium text-graphite dark:text-ivory mb-1">Luxe</div>
                                        <div className="text-xs text-neutral dark:text-neutral-400 font-light">Luxury homes with elevated design</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-ivory-bone dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between">
                            <button
                                onClick={handleClear}
                                className="text-sm font-medium text-graphite dark:text-ivory hover:text-accent-slate dark:hover:text-accent-slate-hover transition-colors underline"
                            >
                                Clear all
                            </button>
                            <button
                                onClick={handleApply}
                                className="px-8 py-3 bg-accent-slate hover:bg-accent-slate-hover text-ivory rounded-xl font-medium transition-all"
                            >
                                Show results
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
