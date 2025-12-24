import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Star, MapPin, Users, Bed, Droplets, Share2, ChevronLeft, ChevronRight, X, Navigation } from 'lucide-react';
import { fadeUp, fadeIn } from '../animations/motion';
import { getPropertyById as getMockProperty, reviews } from '../utils/data';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { propertiesAPI } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isBookingSticky, setIsBookingSticky] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Try fetching from API first
        const data = await propertiesAPI.getById(id);
        if (data) {
          // Transform
          const mapped = {
            id: data.id,
            title: data.title,
            location: data.location || 'Unknown Location',
            price: data.price,
            original_price: data.original_price,
            rating: 4.8,
            reviews: 127,
            images: data.image_url ? [`http://localhost:8000${data.image_url}`] : ['https://via.placeholder.com/600'],
            amenities: ['WiFi', 'Kitchen', 'Mountain View', 'Fireplace', 'Hot Tub'],
            description: data.description || "No description provided.",
            host: "Admin Host",
            hostAvatar: "https://via.placeholder.com/100",
            beds: 4,
            baths: 3,
            guests: 8,
            latitude: data.latitude || 12.9716,
            longitude: data.longitude || 77.5946
          };
          setProperty(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch from API, falling back to mock (if id matches mock)", error);
        // Fallback to mock if API fails (or if using mock IDs)
        const mock = getMockProperty(id);
        if (mock) setProperty(mock);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();

    const handleScroll = () => {
      setIsBookingSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Property not found
          </h2>
          <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Image Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.images[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowImageModal(true)}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prevImage}
            className="p-3 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-neutral-900 dark:text-neutral-100" />
          </button>
          <button
            onClick={nextImage}
            className="p-3 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors duration-300"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-neutral-900 dark:text-neutral-100" />
          </button>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/listings')}
          className="absolute top-4 left-4 p-3 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors duration-300 z-10"
          aria-label="Go back to listings"
        >
          <ArrowLeft size={20} className="text-neutral-900 dark:text-neutral-100" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors duration-300"
            aria-label="Add to favorites"
          >
            <Heart
              size={20}
              className={`transition-colors duration-300 ${isFavorite ? 'fill-accent-500 text-accent-500' : 'text-neutral-900 dark:text-neutral-100'
                }`}
            />
          </button>
          <button
            className="p-3 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors duration-300"
            aria-label="Share"
          >
            <Share2 size={20} className="text-neutral-900 dark:text-neutral-100" />
          </button>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Z-pattern layout */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={fadeUp.transition}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {property.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-primary-500 text-primary-500" />
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {property.rating}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    ({property.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                  <MapPin size={18} />
                  {property.location}
                </div>
              </div>
            </motion.div>

            {/* Property Stats */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Users className="w-6 h-6 text-neutral-400 mb-2" />
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Guests</div>
                    <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {property.guests}
                    </div>
                  </div>
                  <div>
                    <Bed className="w-6 h-6 text-neutral-400 mb-2" />
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Bedrooms</div>
                    <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {property.beds}
                    </div>
                  </div>
                  <div>
                    <Droplets className="w-6 h-6 text-neutral-400 mb-2" />
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Bathrooms</div>
                    <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {property.baths}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  About this place
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </Card>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...fadeUp.transition, delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      <span className="text-neutral-700 dark:text-neutral-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Host */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...fadeUp.transition, delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={property.hostAvatar}
                    alt={property.host}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      Hosted by {property.host}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Superhost · 5 years hosting
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...fadeUp.transition, delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Reviews
                </h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-neutral-200 dark:border-neutral-800 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4 mb-3">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {review.user}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < review.rating
                                      ? 'fill-primary-500 text-primary-500'
                                      : 'text-neutral-300 dark:text-neutral-700'
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-500">
                            {new Date(review.date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={fadeIn.transition}
              className={`lg:sticky ${isBookingSticky ? 'lg:top-24' : 'lg:top-8'} space-y-6`}
            >
              <Card className="p-6 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      ₹{property.price}
                    </span>
                    {property.original_price && (
                      <span className="text-lg text-neutral-400 line-through">
                        ₹{property.original_price}
                      </span>
                    )}
                    <span className="text-neutral-600 dark:text-neutral-400">/ night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <Star size={14} className="fill-primary-500 text-primary-500" />
                    <span>{property.rating}</span>
                    <span>·</span>
                    <span>{property.reviews} reviews</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Check in
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Check out
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Guests
                    </label>
                    <select className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300">
                      {[...Array(property.guests)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1} {i === 0 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  fullWidth
                  onClick={() => navigate(`/property/${id}/booking`)}
                  className="mb-4"
                >
                  Reserve
                </Button>

                <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
                  You won't be charged yet
                </p>
              </Card>

              {/* Location Map */}
              <Card className="p-0 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <MapPin size={18} />
                    Where you'll be
                  </h3>
                </div>

                <div className="h-64 relative">
                  {property.latitude && property.longitude && (
                    <MapContainer
                      center={[property.latitude, property.longitude]}
                      zoom={15}
                      className="h-full w-full"
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[property.latitude, property.longitude]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-semibold text-sm">{property.title}</p>
                            <p className="text-xs text-neutral-600">{property.location}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                    <strong>{property.location}</strong>
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Navigation size={16} />
                    Get Directions
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Close"
            >
              <X size={24} className="text-white" />
            </button>
            <motion.img
              src={property.images[currentImageIndex]}
              alt={property.title}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Previous"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Next"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

