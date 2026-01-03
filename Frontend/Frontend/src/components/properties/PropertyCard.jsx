import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Heart, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp, scaleHover } from '../../animations/motion';
import { useState } from 'react';

/**
 * PropertyCard Component - Colorful TripAdvisor-style with image carousel
 */
export default function PropertyCard({ property, index = 0 }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle image navigation
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ ...fadeUp.transition, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group h-full"
    >
      <Link to={`/property/${property.id}`} className="block h-full">
        <div className="h-full rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
          {/* Image carousel */}
          <div className="relative overflow-hidden aspect-[4/3]">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 dark:from-neutral-700 dark:to-neutral-800 animate-pulse" />
            )}
            <img
              src={property.images[currentImageIndex] || property.images[0]}
              alt={property.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              loading="lazy"
            />

            {/* Image navigation arrows */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 dark:bg-neutral-800/95 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} className="text-neutral-900 dark:text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 dark:bg-neutral-800/95 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} className="text-neutral-900 dark:text-white" />
                </button>

                {/* Image dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {property.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/50 w-1.5'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Favorite button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-300 shadow-md z-10"
              aria-label="Add to favorites"
            >
              <Heart
                size={20}
                className={`transition-all duration-300 ${isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-neutral-700 dark:text-neutral-300'
                  }`}
              />
            </motion.button>

            {/* Travellers' Choice 2025 badge */}
            {property.is_luxe && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-900 text-xs font-bold shadow-md flex items-center gap-1 z-10">
                <Star size={12} className="fill-neutral-900" />
                2025
              </div>
            )}

            {/* Travellers' Choice green badge */}
            {property.is_guest_favourite && (
              <div className="absolute bottom-14 left-3 px-2.5 py-1 rounded-md bg-green-700 text-white text-xs font-bold shadow-md flex items-center gap-1 z-10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#00AA6C" />
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
                Travellers' Choice
              </div>
            )}
          </div>

          {/* Content section - colorful gradient background */}
          <div className="p-4 space-y-2.5 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-950">
            {/* Title */}
            <h3 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-snug min-h-[2.5rem]">
              {property.title}
            </h3>

            {/* Rating - Green TripAdvisor style */}
            {property.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-700 text-white shadow-sm">
                  <span className="text-sm font-bold">{property.rating}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${i < Math.floor(property.rating)
                          ? 'fill-green-600 text-green-600'
                          : 'fill-neutral-300 text-neutral-300 dark:fill-neutral-600 dark:text-neutral-600'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                  ({property.reviews})
                </span>
              </div>
            )}

            {/* Location */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5 font-normal truncate">
              <MapPin size={14} className="flex-shrink-0 text-neutral-500" />
              <span className="truncate">{property.location}</span>
            </p>

            {/* Price section */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">from</span>
                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                      ₹{property.price}
                    </span>
                  </div>
                  {property.original_price && property.original_price > property.price && (
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{property.original_price}
                    </span>
                  )}
                </div>
                {property.original_price && property.original_price > property.price && (
                  <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    Save {Math.round(((property.original_price - property.price) / property.original_price) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
