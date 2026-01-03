import { motion } from 'framer-motion';
import { fadeIn } from '../../animations/motion';

/**
 * Input Component - Minimalist luxury design with no borders
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional classes
 */
export default function Input({ label, error, className = '', placeholder, ...props }) {
  return (
    <motion.div
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg bg-ivory-bone dark:bg-neutral-800 text-graphite dark:text-ivory placeholder-neutral dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-slate border-2 border-neutral-300 dark:border-neutral-700 transition-all duration-300 ${error ? 'ring-1 ring-status-failure border-status-failure' : ''
          } ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-status-failure font-light"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
