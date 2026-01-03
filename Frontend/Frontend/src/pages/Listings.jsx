import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Map, List } from 'lucide-react';
import PropertyGrid from '../components/properties/PropertyGrid';
import PropertyListCard from '../components/properties/PropertyListCard';
import FiltersPanel from '../components/filters/FiltersPanel';
import MapView from '../components/map/MapView';
import { propertiesAPI } from '../services/api';
import { fadeIn } from '../animations/motion';

export default function Listings() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'price_low', 'rating', 'reviews'
  const [filters, setFilters] = useState({
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
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Build active filters display
  useEffect(() => {
    const active = [];

    if (filters.property_type?.length > 0) {
      filters.property_type.forEach(type => {
        active.push({ key: 'property_type', value: type, label: type });
      });
    }

    if (filters.amenities?.length > 0) {
      filters.amenities.forEach(amenity => {
        active.push({ key: 'amenities', value: amenity, label: amenity });
      });
    }

    if (filters.min_price) {
      active.push({ key: 'min_price', value: filters.min_price, label: `Min: ₹${filters.min_price}` });
    }

    if (filters.max_price) {
      active.push({ key: 'max_price', value: filters.max_price, label: `Max: ₹${filters.max_price}` });
    }

    if (filters.bedrooms) {
      active.push({ key: 'bedrooms', value: filters.bedrooms, label: `${filters.bedrooms}+ Bedrooms` });
    }

    if (filters.is_guest_favourite) {
      active.push({ key: 'is_guest_favourite', value: true, label: 'Guest Favourite' });
    }

    if (filters.is_luxe) {
      active.push({ key: 'is_luxe', value: true, label: 'Luxe' });
    }

    setActiveFilters(active);
  }, [filters]);

  // Fetch properties with filters
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertiesAPI.getAll(filters);

        if (Array.isArray(data)) {
          // Transform backend data to frontend model
          let mapped = data.map(room => ({
            id: room.id,
            title: room.title,
            location: room.location || 'Unknown Location',
            price: room.price,
            original_price: room.original_price,
            rating: 4.8,
            reviews: 127,
            images: room.image_url
              ? [`http://localhost:8000${room.image_url}`]
              : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop'],
            amenities: room.amenities || ['WiFi', 'Kitchen'],
            description: room.description,
            host: 'Admin',
            hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            beds: room.beds || 2,
            bathrooms: room.bathrooms || 1,
            max_guests: room.max_guests || 2,
            bedrooms: room.bedrooms || 1,
            is_available: room.is_available,
            is_luxe: room.is_luxe,
            is_guest_favourite: room.is_guest_favourite,
            property_type: room.property_type,
            latitude: room.latitude,
            longitude: room.longitude,
          }));

          // Sort properties based on selected sort option
          if (sortBy === 'price_low') {
            mapped = mapped.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'rating') {
            mapped = mapped.sort((a, b) => b.rating - a.rating);
          } else if (sortBy === 'reviews') {
            mapped = mapped.sort((a, b) => b.reviews - a.reviews);
          }

          setProperties(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, sortBy]);

  // Apply filters from navigation state (when clicking from landing page)
  useEffect(() => {
    if (location.state?.propertyType) {
      setFilters(prev => ({
        ...prev,
        property_type: [location.state.propertyType]
      }));
    }

    if (location.state?.amenity) {
      setFilters(prev => ({
        ...prev,
        amenities: [location.state.amenity]
      }));
    }
  }, [location.state]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
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
    });
  };

  const removeFilter = (filterKey, filterValue) => {
    if (Array.isArray(filters[filterKey])) {
      setFilters({
        ...filters,
        [filterKey]: filters[filterKey].filter(v => v !== filterValue)
      });
    } else {
      setFilters({
        ...filters,
        [filterKey]: filterKey.includes('is_') ? false : null
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {location.state?.location || 'All Properties'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {properties.length} properties available
          </p>
        </motion.div>

        {/* Sort Tabs - Booking.com Style */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex gap-0 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
            <button
              onClick={() => setSortBy('recommended')}
              className={`flex-1 px-6 py-3 font-semibold text-sm transition-all ${sortBy === 'recommended'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
            >
              Our top picks
            </button>
            <button
              onClick={() => setSortBy('price_low')}
              className={`flex-1 px-6 py-3 font-semibold text-sm border-l-2 border-neutral-300 dark:border-neutral-700 transition-all ${sortBy === 'price_low'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
            >
              Lowest price first
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`flex-1 px-6 py-3 font-semibold text-sm border-l-2 border-neutral-300 dark:border-neutral-700 transition-all ${sortBy === 'rating'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
            >
              Star rating and price
            </button>
            <button
              onClick={() => setSortBy('reviews')}
              className={`flex-1 px-6 py-3 font-semibold text-sm border-l-2 border-neutral-300 dark:border-neutral-700 transition-all ${sortBy === 'reviews'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
            >
              Top reviewed
            </button>
          </div>
        </motion.div>

        {/* Filter Button & Active Filters */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex items-center gap-3 flex-wrap"
        >
          {/* Filters Button */}
          <button
            onClick={() => setShowFiltersPanel(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-semibold"
          >
            <Filter size={18} />
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold ${viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400'
                }`}
            >
              <List size={18} />
              <span className="text-sm">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold ${viewMode === 'map'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400'
                }`}
            >
              <Map size={18} />
              <span className="text-sm">Map</span>
            </button>
          </div>

          {/* Active Filters Pills */}
          {activeFilters.length > 0 && (
            <>
              {activeFilters.map((filter, index) => (
                <div
                  key={`${filter.key}-${filter.value}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key, filter.value)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <button
                onClick={handleClearFilters}
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            </>
          )}
        </motion.div>

        {/* Property List or Map View */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-neutral-600 dark:text-neutral-400">Loading properties...</div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">No properties found matching your filters.</p>
              </div>
            ) : (
              properties.map((property, index) => (
                <PropertyListCard key={property.id} property={property} index={index} />
              ))
            )}
          </div>
        ) : (
          <div className="h-[calc(100vh-300px)] min-h-[500px] rounded-lg overflow-hidden">
            <MapView properties={properties} />
          </div>
        )}
      </div>

      {/* Filters Panel (Sidebar) */}
      <FiltersPanel
        isOpen={showFiltersPanel}
        onClose={() => setShowFiltersPanel(false)}
        filters={filters}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}
