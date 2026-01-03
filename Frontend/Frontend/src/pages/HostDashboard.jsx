import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Calendar, DollarSign, Settings, X, Upload, Edit, Trash2, MapPin } from 'lucide-react';
import { fadeUp, fadeIn } from '../animations/motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { propertiesAPI } from '../services/api';

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  // New Room Form State
  const [newRoom, setNewRoom] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    location: '',
    property_type: 'room',
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    max_guests: 2,
    amenities: [],
    booking_options: [],
    is_guest_favourite: false,
    is_luxe: false,
    images: []
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await propertiesAPI.getAll();
      if (Array.isArray(data)) {
        // Transform data
        const mapped = data.map(room => ({
          id: room.id,
          title: room.title,
          location: room.location || 'Unknown',
          price: room.price,
          original_price: room.original_price,
          image: room.image_url ? `http://localhost:8000${room.image_url}` : 'https://via.placeholder.com/400'
        }));
        setProperties(mapped);
      }
    } catch (error) {
      console.error("Error fetching properties", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newRoom.title);
      formData.append('description', newRoom.description);
      formData.append('price', newRoom.price);
      if (newRoom.original_price) {
        formData.append('original_price', newRoom.original_price);
      }
      formData.append('location', newRoom.location);
      formData.append('property_type', newRoom.property_type);
      formData.append('bedrooms', newRoom.bedrooms);
      formData.append('beds', newRoom.beds);
      formData.append('bathrooms', newRoom.bathrooms);
      formData.append('max_guests', newRoom.max_guests);
      formData.append('amenities', JSON.stringify(newRoom.amenities));
      formData.append('booking_options', JSON.stringify(newRoom.booking_options));
      formData.append('is_guest_favourite', newRoom.is_guest_favourite);
      formData.append('is_luxe', newRoom.is_luxe);
      if (newRoom.images && newRoom.images.length > 0) {
        // For now, upload first image only (backend supports single image)
        formData.append('file', newRoom.images[0]);
      }

      const newRoom = await propertiesAPI.create(formData);
      setShowAddModal(false);
      setNewRoom({ title: '', description: '', price: '', original_price: '', location: '', property_type: 'room', bedrooms: 1, beds: 1, bathrooms: 1, max_guests: 2, amenities: [], booking_options: [], is_guest_favourite: false, is_luxe: false, images: [] });
      await fetchProperties(); // Refresh list immediately
      alert('Room created successfully!');
    } catch (error) {
      console.error("Failed to create room", error);
      alert("Failed to create room: " + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoomId(room.id);
    setNewRoom({
      title: room.title,
      description: room.description,
      price: room.price,
      original_price: room.original_price,
      location: room.location,
      property_type: room.property_type || 'room',
      bedrooms: room.bedrooms || 1,
      beds: room.beds || 1,
      bathrooms: room.bathrooms || 1,
      max_guests: room.max_guests || 2,
      amenities: room.amenities || [],
      booking_options: room.booking_options || [],
      is_guest_favourite: room.is_guest_favourite || false,
      is_luxe: room.is_luxe || false,
      images: [] // Images won't be pre-filled, user can upload new ones
    });
    setShowAddModal(true);
  };

  const handleCreateOrUpdateRoom = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newRoom.title);
      formData.append('description', newRoom.description);
      formData.append('price', newRoom.price);
      if (newRoom.original_price) {
        formData.append('original_price', newRoom.original_price);
      }
      formData.append('location', newRoom.location);
      formData.append('property_type', newRoom.property_type);
      formData.append('bedrooms', newRoom.bedrooms);
      formData.append('beds', newRoom.beds);
      formData.append('bathrooms', newRoom.bathrooms);
      formData.append('max_guests', newRoom.max_guests);
      formData.append('amenities', JSON.stringify(newRoom.amenities));
      formData.append('booking_options', JSON.stringify(newRoom.booking_options));
      formData.append('is_guest_favourite', newRoom.is_guest_favourite);
      formData.append('is_luxe', newRoom.is_luxe);
      if (newRoom.images && newRoom.images.length > 0) {
        // For now, upload first image only (backend supports single image)
        formData.append('file', newRoom.images[0]);
      }

      if (editingRoomId) {
        await propertiesAPI.update(editingRoomId, formData);
      } else {
        await propertiesAPI.create(formData);
      }
      setShowAddModal(false);
      setEditingRoomId(null);
      setNewRoom({
        title: '',
        description: '',
        price: '',
        original_price: '',
        location: '',
        property_type: 'room',
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        max_guests: 2,
        amenities: [],
        booking_options: [],
        is_guest_favourite: false,
        is_luxe: false,
        images: []
      });
      fetchProperties(); // Refresh list
    } catch (error) {
      console.error("Failed to save room", error);
      alert("Failed to save room");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await propertiesAPI.delete(id);
        await fetchProperties(); // Refresh list immediately
        alert('Property deleted successfully!');
      } catch (error) {
        console.error("Failed to delete property", error);
        alert("Failed to delete property: " + (error.message || 'Unknown error'));
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewRoom({ ...newRoom, images: filesArray });
    }
  };

  const stats = [
    { label: 'Total Revenue', value: '₹0', change: '+0%', icon: DollarSign, color: 'text-primary-500' },
    { label: 'Bookings', value: '0', change: '+0%', icon: Calendar, color: 'text-blue-500' },
    { label: 'Occupancy', value: '0%', change: '+0%', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={fadeUp.transition}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-display font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Host Dashboard
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Manage your properties and bookings
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Room
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...fadeUp.transition, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
          className="flex gap-2 mb-8 border-b border-neutral-200 dark:border-neutral-800"
        >
          {[
            { id: 'properties', label: 'Properties' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium transition-colors duration-300 border-b-2 ${activeTab === tab.id
                ? 'text-primary-500 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={fadeUp.transition}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.length === 0 && !loading && (
                <div className="col-span-full text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                      <Plus size={32} className="text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      No properties yet
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      Start adding your first property to get started
                    </p>
                    <Button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2">
                      <Plus size={18} />
                      Add Your First Property
                    </Button>
                  </motion.div>
                </div>
              )}
              {properties.map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <Card className="overflow-hidden h-full bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Image with overlay */}
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Action buttons - solid */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditRoom(property)}
                          className="p-3 rounded-full bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-all duration-300 shadow-md"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteRoom(property.id)}
                          className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 shadow-md"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        {property.title}
                      </h3>

                      <p className="text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2 font-medium">
                        <div className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700">
                          <MapPin size={14} />
                        </div>
                        {property.location}
                      </p>

                      <div className="pt-3 border-t-2 border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-baseline justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                              ₹{property.price}
                            </span>
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-400">per night</span>
                          </div>
                          {property.original_price && property.original_price > property.price && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 line-through">
                                ₹{property.original_price}
                              </span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-600 text-white">
                                {Math.round(((property.original_price - property.price) / property.original_price) * 100)}% off
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hover action button */}
                      <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleEditRoom(property)}
                          className="w-full py-2.5 text-center text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modal for Adding/Editing Room */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {editingRoomId ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateOrUpdateRoom} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Basic Information</h3>
                  <Input
                    label="Title"
                    value={newRoom.title}
                    onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</label>
                    <textarea
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      rows={3}
                    />
                  </div>
                  <Input
                    label="Location"
                    value={newRoom.location}
                    onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                    required
                  />
                </div>

                {/* Property Type */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Property Type</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['room', 'house', 'apartment', 'villa', 'cabin', 'cottage', 'loft', 'studio'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewRoom({ ...newRoom, property_type: type })}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 capitalize ${newRoom.property_type === type
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Pricing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Selling Price (per night)"
                      type="number"
                      value={newRoom.price}
                      onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                      required
                    />
                    <Input
                      label="Original Price (MRP)"
                      type="number"
                      value={newRoom.original_price}
                      onChange={(e) => setNewRoom({ ...newRoom, original_price: e.target.value })}
                    />
                  </div>
                </div>

                {/* Room Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Room Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={newRoom.bedrooms}
                        onChange={(e) => setNewRoom({ ...newRoom, bedrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Beds</label>
                      <input
                        type="number"
                        min="0"
                        value={newRoom.beds}
                        onChange={(e) => setNewRoom({ ...newRoom, beds: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Bathrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={newRoom.bathrooms}
                        onChange={(e) => setNewRoom({ ...newRoom, bathrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Max Guests</label>
                      <input
                        type="number"
                        min="1"
                        value={newRoom.max_guests}
                        onChange={(e) => setNewRoom({ ...newRoom, max_guests: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['WiFi', 'Kitchen', 'AC', 'Heating', 'TV', 'Washer', 'Dryer', 'Pool', 'Hot Tub', 'Gym', 'Parking', 'Workspace'].map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          const updated = newRoom.amenities.includes(amenity)
                            ? newRoom.amenities.filter(a => a !== amenity)
                            : [...newRoom.amenities, amenity];
                          setNewRoom({ ...newRoom, amenities: updated });
                        }}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm ${newRoom.amenities.includes(amenity)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                          }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Booking Options</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Instant Book', 'Self Check-In', 'Pets Allowed'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const updated = newRoom.booking_options.includes(option)
                            ? newRoom.booking_options.filter(o => o !== option)
                            : [...newRoom.booking_options, option];
                          setNewRoom({ ...newRoom, booking_options: updated });
                        }}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm ${newRoom.booking_options.includes(option)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Categories */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Special Categories</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRoom.is_guest_favourite}
                        onChange={(e) => setNewRoom({ ...newRoom, is_guest_favourite: e.target.checked })}
                        className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">Guest Favourite</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRoom.is_luxe}
                        onChange={(e) => setNewRoom({ ...newRoom, is_luxe: e.target.checked })}
                        className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">Luxe Property</span>
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Room Images (Multiple)
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {newRoom.images && newRoom.images.length > 0 ? (
                      <div>
                        <p className="text-primary-500 font-medium mb-2">
                          {newRoom.images.length} image(s) selected
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {newRoom.images.map((img, idx) => (
                            <span key={idx} className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                              {img.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="text-neutral-400" size={32} />
                        <p className="text-sm text-neutral-500">Click to upload images (multiple)</p>
                        <p className="text-xs text-neutral-400">Note: Backend currently supports 1 image, first will be uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" fullWidth disabled={uploading}>
                  {uploading ? (editingRoomId ? 'Saving...' : 'Creating...') : (editingRoomId ? 'Save Changes' : 'Create Room')}
                </Button>
              </form>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
