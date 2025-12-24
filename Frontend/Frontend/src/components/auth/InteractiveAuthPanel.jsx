import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function InteractiveAuthPanel() {
    const ref = useRef(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    // Map mouse position to tilt angles
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    // Handle mouse move
    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate normalized mouse position (-0.5 to 0.5)
        const mouseXPos = (e.clientX - rect.left) / width - 0.5;
        const mouseYPos = (e.clientY - rect.top) / height - 0.5;

        x.set(mouseXPos);
        y.set(mouseYPos);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900 items-center justify-center p-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={ref}
            style={{ perspective: 1000 }}
        >
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        x: [0, -50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent-500/20 blur-[120px] rounded-full"
                />
            </div>

            {/* 3D Floating Card */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full max-w-lg aspect-square"
            >
                {/* Glass Card */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Inner Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent p-8 flex flex-col justify-between">
                        {/* Top Decoration */}
                        <div className="flex justify-between items-start">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/80"
                            />
                        </div>

                        {/* Central Typography */}
                        <div className="space-y-4">
                            <motion.h2
                                style={{ transform: "translateZ(50px)" }}
                                className="text-4xl font-bold text-white tracking-tight"
                            >
                                Experience <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">
                                    Luxury Living
                                </span>
                            </motion.h2>
                            <motion.p
                                style={{ transform: "translateZ(30px)" }}
                                className="text-white/60 text-lg max-w-xs"
                            >
                                Discover curated properties that redefine comfort and style.
                            </motion.p>
                        </div>

                        {/* Bottom Stats */}
                        <motion.div
                            style={{ transform: "translateZ(40px)" }}
                            className="flex gap-6 pt-6 border-t border-white/10"
                        >
                            <div>
                                <div className="text-2xl font-bold text-white">500+</div>
                                <div className="text-sm text-white/50">Properties</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">50k+</div>
                                <div className="text-sm text-white/50">Happy Guests</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">4.9</div>
                                <div className="text-sm text-white/50">Rating</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Elements for Depth */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transform: "translateZ(80px)" }}
                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl z-10 flex items-center justify-center border border-white/20 backdrop-blur-sm"
                >
                    <span className="text-3xl">✨</span>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    style={{ transform: "translateZ(60px)" }}
                    className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full shadow-xl z-10 flex items-center justify-center border border-white/20 backdrop-blur-sm"
                >
                    <span className="text-3xl">🏠</span>
                </motion.div>

            </motion.div>
        </div>
    );
}
