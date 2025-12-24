import { motion } from 'framer-motion';
import { buttonTap } from '../../animations/motion';

/**
 * Button Component - Minimalist luxury design with muted accents
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  // Soft rounded borders, subtle focus indicators
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Primary: Muted Slate Blue background, Warm Ivory text
    primary: 'bg-accent-slate text-ivory hover:bg-accent-slate-hover focus:ring-accent-slate disabled:bg-neutral-200 disabled:text-neutral-400',

    // Secondary: Transparent background, Deep Graphite text, no border
    secondary: 'bg-transparent text-graphite hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 focus:ring-graphite',

    // Ghost: Subtle hover effect
    ghost: 'text-graphite hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 focus:ring-neutral-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? buttonTap : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
