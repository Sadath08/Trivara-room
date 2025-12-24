import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Heart, User, LogOut } from 'lucide-react';
import { fadeIn } from '../../animations/motion';
import { useAuth } from '../../context/AuthContext';
import trivaraLogo from '../../assets/trivara-logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { path: '/', label: 'Explore' },
    { path: '/listings', label: 'Listings' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-ivory-bone shadow-sm dark:bg-neutral-800'
          : 'bg-ivory-bone dark:bg-neutral-800'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Monochrome only (Deep Graphite) */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.img
              src={trivaraLogo}
              alt="Trivara Rooms"
              whileHover={{ scale: 1.05 }}
              className="h-12 w-auto"
              style={{ filter: 'grayscale(100%)' }}
            />
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-medium text-graphite dark:text-ivory hidden sm:block"
            >
              Trivara
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 ${location.pathname === link.path
                    ? 'text-graphite dark:text-ivory'
                    : 'text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-graphite dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/saved"
              className="hidden md:block p-2 rounded-xl text-graphite dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-300"
              aria-label="Saved properties"
            >
              <Heart size={20} />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-graphite dark:text-ivory hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-300"
                >
                  <User size={18} />
                  <span className="text-sm font-medium">{user?.full_name || 'Dashboard'}</span>
                </Link>
                {/* Only show Host Dashboard if user is admin */}
                {user?.role === 'admin' && (
                  <Link
                    to="/host"
                    className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-accent-slate/10 dark:bg-accent-slate/20 text-accent-slate dark:text-accent-slate-hover hover:bg-accent-slate/20 dark:hover:bg-accent-slate/30 transition-colors duration-300"
                  >
                    <span className="text-sm font-medium">Host Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl text-graphite dark:text-ivory hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-300"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-graphite dark:text-ivory hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-300"
              >
                <User size={18} />
                <span className="text-sm font-medium">Sign in</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-graphite dark:text-ivory hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-ivory-bone dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${location.pathname === link.path
                      ? 'text-graphite dark:text-ivory'
                      : 'text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/saved"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors duration-300"
              >
                Saved
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left py-2 text-base font-medium text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-neutral dark:text-neutral-400 hover:text-graphite dark:hover:text-ivory transition-colors duration-300"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
