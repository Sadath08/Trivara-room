/**
 * Shimmer Component - Soft shimmer loading state
 */
export default function Shimmer({ className = '' }) {
  return (
    <div
      className={`bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 bg-[length:200%_100%] animate-shimmer rounded-xl ${className}`}
      aria-label="Loading"
    />
  );
}

