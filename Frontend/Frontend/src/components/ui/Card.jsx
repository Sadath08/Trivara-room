import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/motion';

/**
 * Card Component - Layered neutrals instead of borders, no shadows
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.hoverable - Enable hover scale
 * @param {string} props.className - Additional classes
 */
export default function Card({ children, hoverable = false, className = '', ...props }) {
  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={fadeUp.transition}
      whileHover={hoverable ? { scale: 1.02 } : {}}
      className={`bg-ivory-bone dark:bg-neutral-800 rounded-2xl border-none shadow-none ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
