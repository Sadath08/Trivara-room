import { Link } from 'react-router-dom';
import { fadeIn } from '../../animations/motion';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const footerSections = {
    support: [
      { label: 'Help Centre', path: '/help' },
      { label: 'Get help with a safety issue', path: '/safety' },
      { label: 'AirCover', path: '/aircover' },
      { label: 'Anti-discrimination', path: '/anti-discrimination' },
      { label: 'Disability support', path: '/accessibility' },
      { label: 'Cancellation options', path: '/cancellation' },
      { label: 'Report neighbourhood concern', path: '/report' },
    ],
    hosting: [
      { label: 'Trivara your home', path: '/host' },
      { label: 'Trivara your experience', path: '/host/experience' },
      { label: 'Trivara your service', path: '/host/service' },
      { label: 'AirCover for Hosts', path: '/host/aircover' },
      { label: 'Hosting resources', path: '/host/resources' },
      { label: 'Community forum', path: '/community' },
      { label: 'Hosting responsibly', path: '/host/responsible' },
      { label: 'Join a free Hosting class', path: '/host/class' },
      { label: 'Find a co-host', path: '/host/cohost' },
      { label: 'Refer a Host', path: '/host/refer' },
    ],
    trivara: [
      { label: '2025 Summer Release', path: '/summer-release' },
      { label: 'Newsroom', path: '/newsroom' },
      { label: 'Careers', path: '/careers' },
      { label: 'Investors', path: '/investors' },
      { label: 'Trivara.org emergency stays', path: '/emergency' },
    ],
  };

  return (
    <motion.footer
      initial={fadeIn.initial}
      whileInView={fadeIn.animate}
      viewport={{ once: true }}
      transition={fadeIn.transition}
      className="bg-ivory-bone dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Support Column */}
          <div>
            <h4 className="text-sm font-medium text-graphite dark:text-ivory mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerSections.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-light text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory hover:underline transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosting Column */}
          <div>
            <h4 className="text-sm font-medium text-graphite dark:text-ivory mb-4">
              Hosting
            </h4>
            <ul className="space-y-3">
              {footerSections.hosting.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-light text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory hover:underline transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trivara Column */}
          <div>
            <h4 className="text-sm font-medium text-graphite dark:text-ivory mb-4">
              Trivara
            </h4>
            <ul className="space-y-3">
              {footerSections.trivara.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-light text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory hover:underline transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Copyright & Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral dark:text-neutral-400 font-light">
              <span>© {new Date().getFullYear()} Trivara, Inc.</span>
              <span>·</span>
              <Link to="/privacy" className="hover:text-graphite dark:hover:text-ivory hover:underline transition-colors">
                Privacy
              </Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-graphite dark:hover:text-ivory hover:underline transition-colors">
                Terms
              </Link>
              <span>·</span>
              <Link to="/sitemap" className="hover:text-graphite dark:hover:text-ivory hover:underline transition-colors">
                Company details
              </Link>
            </div>

            {/* Social Links & Language */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <button className="flex items-center gap-2 text-sm text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>English (IN)</span>
              </button>

              {/* Currency */}
              <button className="flex items-center gap-1 text-sm text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors">
                <span>₹ INR</span>
              </button>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
