import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { fadeUp } from '../../animations/motion';
import { useState } from 'react';

/**
 * PropertyListCard - Horizontal Booking.com style layout
 */
export default function PropertyListCard({ property, index = 0 }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: index * 0.05 }}
            className="group"
        >
            <Link to={`/property/${property.id}`} className="block">
                <div className="bg-white dark:bg-neutral-900 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section - Left */}
                        <div className="relative md:w-72 h-56 md:h-auto flex-shrink-0">
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                            )}
                            <img
                                src={property.images[0]}
                                alt={property.title}
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                loading="lazy"
                            />

                            {/* Badges on image */}
                            {property.is_luxe && (
                                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-amber-500 text-white text-xs font-bold">
                                    ★ Luxe
                                </div>
                            )}
                        </div>

                        {/* Content Section - Middle */}
                        <div className="flex-1 p-5 md:p-6">
                            {/* Title with stars */}
                            <div className="mb-2">
                                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline mb-1">
                                    {property.title}
                                </h3>
                                {/* Star rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={`${i < Math.floor(property.rating || 0)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-neutral-300 dark:text-neutral-600'
                                                }`}
                                        />
                                    ))}
                                    {property.is_guest_favourite && (
                                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded">
                                            Guest Favourite
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                                <MapPin size={14} />
                                <span>Hotel in {property.location}</span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 mb-3">
                                {property.description || `Well set in the ${property.location} district. This property is located ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}, ${property.beds} bed${property.beds > 1 ? 's' : ''}, and can accommodate up to ${property.max_guests} guests.`}
                            </p>

                            {/* Amenities preview */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                    {property.amenities.slice(0, 3).map((amenity, idx) => (
                                        <span key={idx} className="flex items-center gap-1">
                                            {idx > 0 && <span>•</span>}
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Show more link */}
                            <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-2 hover:underline">
                                Show more →
                            </button>
                        </div>

                        {/* Price & Rating Section - Right */}
                        <div className="border-t-2 md:border-t-0 md:border-l-2 border-neutral-200 dark:border-neutral-700 p-5 md:p-6 md:w-64 flex flex-row md:flex-col justify-between md:justify-start items-end md:items-end">
                            {/* Rating Score */}
                            <div className="mb-0 md:mb-4 flex md:flex-col items-center md:items-end gap-2">
                                <div className="text-right">
                                    <div className="text-sm font-bold text-neutral-900 dark:text-white mb-0.5">
                                        Superb
                                    </div>
                                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                        {property.reviews || 0} reviews
                                    </div>
                                </div>
                                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
                                    {property.rating || '9.0'}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                    Price from
                                </div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-500 mb-0.5">
                                    ₹{property.price}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                                    1 night, 2 adults
                                </div>

                                {/* Original price if discount */}
                                {property.original_price && property.original_price > property.price && (
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 line-through mb-2">
                                        ₹{property.original_price}
                                    </div>
                                )}

                                {/* Check availability button */}
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded font-bold text-sm transition-colors duration-200">
                                    Check availability
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
