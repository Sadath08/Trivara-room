import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Award, TrendingUp, Heart, Shield, Star, Target } from 'lucide-react';
import '../styles/about-journey.css';
import Journey from '../components/Journey';

export default function AboutUs() {
    const stats = [
        { number: '500+', label: 'Premium Properties', icon: Home },
        { number: '50K+', label: 'Happy Guests', icon: Users },
        { number: '4.9', label: 'Average Rating', icon: Star },
        { number: '15+', label: 'Years Experience', icon: Award },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Guest-Centric',
            description: 'Every decision we make puts our guests\' comfort andatisfaction first.',
            color: '#F4A460'
        },
        {
            icon: Shield,
            title: 'Trust & Safety',
            description: 'Verified properties and secure bookings for complete peace of mind.',
            color: '#FFB84D'
        },
        {
            icon: Star,
            title: 'Excellence',
            description: 'We curate only the finest properties that meet our high standards.',
            color: '#F4A460'
        },
        {
            icon: Target,
            title: 'Innovation',
            description: 'Constantly evolving to provide the best hospitality experience.',
            color: '#5C4033'
        },
    ];

    const story = [
        {
            year: '2008',
            title: 'The Beginning',
            description: 'Started with a vision to revolutionize hospitality and make luxury accessible to everyone.',
        },
        {
            year: '2015',
            title: 'Expansion',
            description: 'Expanded to 50+ cities, becoming one of the most trusted names in premium accommodations.',
        },
        {
            year: '2023',
            title: 'Innovation Leader',
            description: 'Launched cutting-edge technology for seamless booking and personalized guest experiences.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/20 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="decorative-circle"></div>
                <div className="decorative-circle"></div>

                <div className="parallax-bg absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center about-hero">
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            About Trivara Rooms
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Redefining Luxury Living Through Exceptional Properties and
                            Unforgettable Experiences
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <button className="about-button px-8 py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl font-semibold text-lg shadow-lg">
                                Discover Our Story
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="stat-card text-center p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 mb-4">
                                        <Icon className="text-white" size={32} />
                                    </div>
                                    <div className="stat-number text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-400 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="section-header text-4xl md:text-5xl font-bold text-center mb-16 text-neutral-900 dark:text-neutral-100">
                        Our <span className="gradient-text">Journey</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {story.map((item, index) => (
                            <div
                                key={index}
                                className="story-card p-8 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 mb-4">
                                    {item.year}
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-neutral-900 dark:to-neutral-800">
                <div className="max-w-7xl mx-auto">
                    <div className="mission-vision-container grid md:grid-cols-2 gap-12">
                        <div className="mission-section p-10 rounded-2xl bg-white dark:bg-neutral-800 shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-6">
                                <Target className="text-white" size={32} />
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                Our Mission
                            </h3>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                To provide exceptional hospitality experiences by connecting
                                travelers with carefully curated properties that feel like home,
                                while empowering property owners to share their spaces with the
                                world.
                            </p>
                        </div>
                        <div className="vision-section p-10 rounded-2xl bg-white dark:bg-neutral-800 shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
                                <TrendingUp className="text-white" size={32} />
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                Our Vision
                            </h3>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                To become the world's most trusted platform for premium
                                accommodations, redefining how people experience travel and
                                hospitality through innovation, trust, and excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="section-header text-4xl md:text-5xl font-bold text-center mb-16 text-neutral-900 dark:text-neutral-100">
                        Our Core <span className="gradient-text">Values</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="value-card p-8 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg text-center"
                                >
                                    <div className="value-icon inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                                        style={{
                                            background: `linear-gradient(135deg, ${value.color}, ${value.color}dd)`,
                                        }}
                                    >
                                        <Icon className="text-white" size={36} />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Journey Timeline Component */}
            <Journey />

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-amber-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Experience Trivara?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of happy guests who have discovered their perfect stay
                    </p>
                    <button className="about-button px-10 py-4 bg-white text-orange-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl">
                        Explore Properties
                    </button>
                </div>
            </section>
        </div>
    );
}
