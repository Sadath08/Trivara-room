import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { staggerContainer } from '../../animations/motion';

/**
 * PropertyGrid Component - Responsive 12-column grid
 */
export default function PropertyGrid({ properties, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse w-3/4" />
            <div className="h-4 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} />
      ))}
    </motion.div>
  );
}

