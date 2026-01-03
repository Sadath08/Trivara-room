import { Award, MapPin, Users, Sparkles, Home, TrendingUp } from 'lucide-react';
import '../styles/about-journey.css';

export default function Journey() {
    const milestones = [
        {
            year: '2008',
            title: 'Foundation',
            description: 'Trivara Rooms was founded with a vision to transform the hospitality industry.',
            icon: Home,
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        },
        {
            year: '2012',
            title: 'First 100 Properties',
            description: 'Reached a milestone of 100 premium properties across 10 cities.',
            icon: MapPin,
            image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
        },
        {
            year: '2016',
            title: 'National Expansion',
            description: 'Expanded to all major cities, serving 10,000+ happy guests monthly.',
            icon: Users,
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        },
        {
            year: '2020',
            title: 'Innovation Award',
            description: 'Recognized as the Most Innovative Hospitality Platform of the Year.',
            icon: Award,
            image: 'https://images.unsplash.com/photo-1511578194003-00c80e42dc9b?w=800&h=600&fit=crop',
        },
        {
            year: '2023',
            title: 'AI-Powered Experiences',
            description: 'Launched AI-driven personalization for unique guest experiences.',
            icon: Sparkles,
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        },
        {
            year: '2024',
            title: 'Global Recognition',
            description: 'Serving 50K+ guests monthly with 500+ properties and a 4.9 rating.',
            icon: TrendingUp,
            image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop',
        },
    ];

    const achievements = [
        { title: 'Best Hospitality Platform', year: '2023' },
        { title: 'Customer Choice Award', year: '2022' },
        { title: 'Innovation Excellence', year: '2021' },
        { title: 'Top Rated Service', year: '2020' },
    ];

    return (
        <section className="py-20 px-4 bg-white dark:bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                <h2 className="section-header text-4xl md:text-5xl font-bold text-center mb-6 text-neutral-900 dark:text-neutral-100">
                    Our <span className="gradient-text">Growth Journey</span>
                </h2>
                <p className="text-center text-neutral-600 dark:text-neutral-400 text-lg mb-16 max-w-2xl mx-auto">
                    From humble beginnings to becoming a trusted name in premium
                    hospitality - here's our story of growth and excellence.
                </p>

                {/\* Timeline \*/}
                <div className="relative journey-timeline py-12">
                    {/\* Timeline Line \*/}
                    <div className="timeline-line hidden md:block"></div>

                    {/\* Milestones \*/}
                    <div className="space-y-20">
                        {milestones.map((milestone, index) => {
                            const Icon = milestone.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`timeline-milestone relative grid md:grid-cols-2 gap-8 items-center ${isEven ? '' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/\* Content \*/}
                                    <div
                                        className={`milestone-card p-8 rounded-2xl bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-800 dark:to-neutral-900 shadow-xl ${isEven ? 'md:text-right md:pr-16' : 'md:pl-16 md:col-start-2'
                                            }`}
                                    >
                                        <div
                                            className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 mb-4 ${isEven ? 'md:ml-auto' : ''
                                                }`}
                                        >
                                            <Icon className="text-white" size={28} />
                                        </div>
                                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 mb-3">
                                            {milestone.year}
                                        </div>
                                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                                            {milestone.description}
                                        </p>
                                    </div>

                                    {/\* Image \*/}
                                    <div
                                        className={`image-zoom-container ${isEven ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'
                                            }`}
                                    >
                                        <img
                                            src={milestone.image}
                                            alt={milestone.title}
                                            className="image-zoom w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
                                        />
                                    </div>

                                    {/\* Timeline Dot (Desktop) \*/}
                                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="timeline-dot"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/\* Achievements \*/}
                <div className="mt-24">
                    <h3 className="section-header text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
                        Awards & <span className="gradient-text">Recognition</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="achievement-badge p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-neutral-800 dark:to-neutral-900 text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                    <Award className="text-white" size={32} />
                                </div>
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    {achievement.title}
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {achievement.year}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
