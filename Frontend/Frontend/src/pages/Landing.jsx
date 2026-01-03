import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, TrendingUp, Shield, Star } from 'lucide-react';
import { fadeUp, fadeIn, staggerContainer } from '../animations/motion';
import PropertyCard from '../components/properties/PropertyCard';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Landing() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        adults: 2,
        children: 0,
    });
    const [openFaq, setOpenFaq] = useState(null);
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch real properties from database
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/rooms`);

                if (response.data && Array.isArray(response.data)) {
                    // Transform backend data to frontend format
                    const properties = response.data.map(room => ({
                        id: room.id,
                        title: room.title,
                        location: room.location || 'Unknown Location',
                        price: room.price,
                        original_price: room.original_price,
                        rating: 4.8,
                        reviews: 127,
                        images: room.image_url
                            ? [`${API_URL}${room.image_url}`]
                            : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop'],
                        amenities: room.amenities || ['WiFi', 'Kitchen'],
                        description: room.description,
                        beds: room.beds || 2,
                        bathrooms: room.bathrooms || 1,
                        max_guests: room.max_guests || 2,
                        bedrooms: room.bedrooms || 1,
                        is_available: room.is_available,
                        is_luxe: room.is_luxe,
                        is_guest_favourite: room.is_guest_favourite,
                        property_type: room.property_type,
                    }));

                    setFeaturedProperties(properties);
                }
            } catch (error) {
                console.error('Failed to fetch properties:', error);
                setFeaturedProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/listings', { state: { search: searchQuery } });
    };

    const faqs = [
        {
            question: 'What is Trivara and how does it work?',
            answer: 'Trivara is a premium room rental platform connecting travelers with unique properties worldwide. Simply search for your destination, select your dates, and book instantly with verified hosts.'
        },
        {
            question: 'How do I use search filters?',
            answer: 'Use our advanced filters to narrow down properties by price, amenities, property type, and more. You can access filters on the listings page to find your perfect match.'
        },
        {
            question: 'Do I need to meet my Host?',
            answer: 'Meeting your host is optional and depends on the property. Many hosts offer self-check-in options, while others prefer to greet guests personally. Check the property details for specific arrangements.'
        },
        {
            question: 'What if I need to cancel due to a problem with the listing or Host?',
            answer: 'We have a flexible cancellation policy. If there\'s an issue with the listing or host, contact our support team within 24 hours of check-in for a full refund.'
        },
        {
            question: 'Need more information?',
            answer: 'Visit our Help Center or contact our 24/7 customer support team for assistance with bookings, payments, or any other questions.'
        }
    ];

    const features = [
        {
            icon: Shield,
            title: 'Verified Hosts',
            description: 'All properties are verified for safety and quality standards.',
        },
        {
            icon: Star,
            title: 'Premium Selection',
            description: 'Curated collection of luxury properties worldwide.',
        },
        {
            icon: TrendingUp,
            title: 'Best Prices',
            description: 'Competitive rates with transparent pricing, no hidden fees.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-neutral-900">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.2, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-amber-300/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, -50, 0],
                        x: [0, 30, 0],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/3 left-1/4 w-64 h-64 bg-stone-300/20 rounded-full blur-2xl"
                />
            </div>

            {/* Hero Section - Booking.com Style */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center px-4 sm:px-6 lg:px-8 pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop"
                        alt="Hotels"
                        className="w-full h-full object-cover"
                    />
                    {/* Light overlay for text readability - NO BLUE */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Search Content */}
                <div className="relative z-10 max-w-6xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                            Find your perfect stay
                        </h1>
                        <p className="text-lg text-white/95 drop-shadow-md">
                            Search hotels, homes and more...
                        </p>
                    </motion.div>

                    {/* Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <form onSubmit={handleSearch} className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl p-3">
                            <div className="flex flex-col lg:flex-row gap-2">
                                {/* Location Input */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Where are you going?"
                                            value={searchQuery.location}
                                            onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-blue-500 dark:focus:border-blue-400 outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Check-in Date */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                                        <input
                                            type="date"
                                            placeholder="Check-in"
                                            value={searchQuery.checkIn}
                                            onChange={(e) => setSearchQuery({ ...searchQuery, checkIn: e.target.value })}
                                            className="w-full pl-12 pr-2 py-3.5 border-2 border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Check-out Date */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                                        <input
                                            type="date"
                                            placeholder="Check-out"
                                            value={searchQuery.checkOut}
                                            onChange={(e) => setSearchQuery({ ...searchQuery, checkOut: e.target.value })}
                                            className="w-full pl-12 pr-2 py-3.5 border-2 border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Guests Selector */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                                        <select
                                            value={`${searchQuery.adults}-${searchQuery.children}`}
                                            onChange={(e) => {
                                                const [adults, children] = e.target.value.split('-').map(Number);
                                                setSearchQuery({ ...searchQuery, adults, children });
                                            }}
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="2-0">2 adults · 0 children · 1 room</option>
                                            <option value="1-0">1 adult · 0 children · 1 room</option>
                                            <option value="2-1">2 adults · 1 child · 1 room</option>
                                            <option value="2-2">2 adults · 2 children · 1 room</option>
                                            <option value="3-0">3 adults · 0 children · 1 room</option>
                                            <option value="4-0">4 adults · 0 children · 1 room</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="lg:w-auto w-full px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Search size={20} />
                                    Search
                                </button>
                            </div>

                            {/* Traveling for work checkbox */}
                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="workTravel"
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="workTravel" className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
                                    I'm travelling for work
                                </label>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={fadeUp.initial}
                        whileInView={fadeUp.animate}
                        viewport={{ once: true }}
                        transition={fadeUp.transition}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                            Featured Properties
                        </h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                            Handpicked luxury stays for unforgettable experiences
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading properties...</p>
                        </div>
                    ) : featuredProperties.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg text-neutral-600 dark:text-neutral-400">No properties available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {featuredProperties.slice(0, 3).map((property, index) => (
                                <PropertyCard key={property.id} property={property} index={index} />
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        initial={fadeIn.initial}
                        whileInView={fadeIn.animate}
                        viewport={{ once: true }}
                        transition={{ ...fadeIn.transition, delay: 0.3 }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/listings"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Explore All Properties
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Property Types Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-white/30 dark:bg-stone-900/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                            Big, small, we have it all
                        </h2>
                        <p className="text-stone-600 dark:text-stone-400">
                            Find the perfect space for your next adventure
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Houses */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => navigate('/listings', { state: { propertyType: 'house' } })}
                            className="group cursor-pointer"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
                                    alt="Houses"
                                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                                    Houses
                                </h3>
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                                If you need extra space, get an entire place all to yourself.
                            </p>
                        </motion.div>

                        {/* Flats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => navigate('/listings', { state: { propertyType: 'apartment' } })}
                            className="group cursor-pointer"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"
                                    alt="Flats"
                                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                                    Flats
                                </h3>
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                                Stay in some of the most convenient locations with spaces in shared buildings.
                            </p>
                        </motion.div>

                        {/* Private Rooms */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => navigate('/listings', { state: { propertyType: 'room' } })}
                            className="group cursor-pointer"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop"
                                    alt="Private rooms"
                                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                                    Private rooms
                                </h3>
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                                Enjoy your own sleeping space and share a common area with others.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                            Your questions, answered
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="border-b border-stone-200 dark:border-stone-700"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full py-5 flex items-center justify-between text-left hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                                >
                                    <span className="text-lg font-medium text-stone-900 dark:text-stone-100">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-stone-600 dark:text-stone-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === index ? 'auto' : 0,
                                        opacity: openFaq === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <p className="pb-5 text-stone-600 dark:text-stone-400">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={fadeUp.initial}
                        whileInView={fadeUp.animate}
                        viewport={{ once: true }}
                        transition={fadeUp.transition}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                            Why Choose Trivara
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                whileHover={{ y: -5 }}
                                className="text-center p-8 rounded-2xl bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm shadow-lg"
                            >
                                <div className="inline-flex p-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4">
                                    <feature.icon className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={fadeIn.initial}
                        whileInView={fadeIn.animate}
                        viewport={{ once: true }}
                        className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">10K+</div>
                            <div className="text-sm text-stone-600 dark:text-stone-400">Properties</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">50K+</div>
                            <div className="text-sm text-stone-600 dark:text-stone-400">Happy Guests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">4.9</div>
                            <div className="text-sm text-stone-600 dark:text-stone-400">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">100+</div>
                            <div className="text-sm text-stone-600 dark:text-stone-400">Destinations</div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
