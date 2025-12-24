// Centralized animation configurations for Framer Motion
// Soft easing, no spring overshoot, luxury feel

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth easing
  },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

export const scaleHover = {
  scale: 1.02,
  transition: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

export const scaleTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
  },
}

export const buttonTap = {
  scale: 0.96,
  transition: {
    duration: 0.15,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

export const shimmerLoading = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2s linear infinite',
}

export const accordionReveal = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

export const parallaxScroll = {
  y: [0, -50],
  transition: {
    duration: 1,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  },
}

