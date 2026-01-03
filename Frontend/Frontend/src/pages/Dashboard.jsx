import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Heart, Settings, LogOut, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { fadeUp, fadeIn } from '../animations/motion';
import Card from '../components/ui/Card';
import PropertyCard from '../components/properties/PropertyCard';
import { bookingsAPI } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [cancelling, setCancelling] = useState(null);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const allBookings = response.data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Separate upcoming and past bookings based on checkout date
        const upcoming = allBookings.filter(booking => {
          const checkoutDate = new Date(booking.end_date);
          return checkoutDate >= today;
        });

        const past = allBookings.filter(booking => {
          const checkoutDate = new Date(booking.end_date);
          return checkoutDate < today;
        });

        setUpcomingBookings(upcoming);
        setPastBookings(past);
        setBookings(allBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    const confirmation = window.confirm(
      'Are you sure you want to cancel this booking? Refund will be calculated based on the cancellation policy.'
    );

    if (!confirmation) return;

    setCancelling(bookingId);
    try {
      const result = await bookingsAPI.cancel(bookingId, 'User requested cancellation');
      alert(result.message || `Booking cancelled successfully. Refund amount: ₹${result.refund_amount}`);

      // Refresh bookings
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allBookings = response.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = allBookings.filter(booking => {
        const checkoutDate = new Date(booking.end_date);
        return checkoutDate >= today && booking.status !== 'cancelled';
      });

      const past = allBookings.filter(booking => {
        const checkoutDate = new Date(booking.end_date);
        return checkoutDate < today || booking.status === 'cancelled';
      });

      setUpcomingBookings(upcoming);
      setPastBookings(past);
      setBookings(allBookings);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert(`Failed to cancel booking: ${error.message}`);
    } finally {
      setCancelling(null);
    }
  };

  const savedProperties = []; // TODO: Implement saved properties functionality

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
          <h1 className="text-4xl md:text-display font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Manage your bookings and saved properties
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
          className="flex gap-2 mb-8 border-b border-neutral-200 dark:border-neutral-800"
        >
          {[
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'saved', label: 'Saved', icon: Heart },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-300 border-b-2 ${activeTab === tab.id
                ? 'text-primary-500 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">Loading bookings...</p>
              </div>
            ) : (
              <>
                {/* Upcoming Bookings */}
                <motion.div
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={fadeUp.transition}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                    Upcoming Trips
                  </h2>
                  {upcomingBookings.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Calendar size={48} className="mx-auto mb-4 text-neutral-400" />
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        No upcoming trips
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Time to plan your next adventure!
                      </p>
                      <Link
                        to="/listings"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                      >
                        Explore Properties
                      </Link>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="p-6 hoverable">
                          <div className="flex gap-4">
                            <img
                              src={
                                booking.room?.image_url
                                  ? `${API_URL}${booking.room.image_url}`
                                  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop'
                              }
                              alt={booking.room?.title || 'Property'}
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 truncate">
                                {booking.room?.title || 'Property'}
                              </h3>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 truncate">
                                {booking.room?.location || 'Location'}
                              </p>
                              <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  <span className="text-xs">
                                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={14} className="text-green-600" />
                                  <span className="text-green-600 font-semibold text-xs capitalize">
                                    {booking.status || 'Confirmed'}
                                  </span>
                                </div>
                              </div>
                              <Link
                                to={`/property/${booking.room_id}`}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                              >
                                View Details →
                              </Link>
                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={cancelling === booking.id}
                                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  <XCircle size={14} />
                                  {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Past Bookings */}
                <motion.div
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                    Past Trips
                  </h2>
                  {pastBookings.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Clock size={40} className="mx-auto mb-3 text-neutral-400" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        No past trips yet
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pastBookings.map((booking) => (
                        <Card key={booking.id} className="p-6 hoverable opacity-75">
                          <div className="flex gap-4">
                            <img
                              src={
                                booking.room?.image_url
                                  ? `${API_URL}${booking.room.image_url}`
                                  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop'
                              }
                              alt={booking.room?.title || 'Property'}
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 truncate">
                                {booking.room?.title || 'Property'}
                              </h3>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 truncate">
                                {booking.room?.location || 'Location'}
                              </p>
                              <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  <span className="text-xs">
                                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-neutral-400" />
                                  <span className="text-neutral-400 text-xs">Completed</span>
                                </div>
                              </div>
                              <Link
                                to={`/property/${booking.room_id}`}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={fadeUp.transition}
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Saved Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={fadeUp.transition}
            className="max-w-2xl"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Account Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 font-medium">
                  Save Changes
                </button>
                <button className="w-full px-6 py-3 border-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-300 font-medium flex items-center justify-center gap-2">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

