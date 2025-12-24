import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import trivaraLogo from '../assets/trivara-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setSubmitError(result.error || 'Login failed');
      }
    } catch (error) {
      setSubmitError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-neutral-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <img src={trivaraLogo} alt="Trivara Rooms" className="h-14 w-auto" />
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">Trivara</span>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-200/40 dark:border-amber-900/40 p-8 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-orange-50/20 to-stone-100/30 dark:from-amber-900/10 dark:via-stone-800/10 dark:to-stone-900/10"></div>

          {/* Floating circles animation */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-2"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center text-stone-600 dark:text-stone-400 mb-8"
            >
              Sign in to your Trivara account
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative"
              >
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 bg-transparent border-b-2 border-stone-300 dark:border-stone-600 focus:border-amber-600 dark:focus:border-amber-500 outline-none text-stone-800 dark:text-stone-100 px-0 pt-4 pb-1 transition-all duration-300 peer"
                  placeholder=" "
                />
                <label className="absolute left-0 top-3 text-stone-500 dark:text-stone-400 transition-all duration-300 peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber-600 dark:peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-amber-600 dark:peer-[:not(:placeholder-shown)]:text-amber-500">
                  Email
                </label>
                <Mail className="absolute right-0 top-3 text-stone-400 dark:text-stone-500 peer-focus:text-amber-600 dark:peer-focus:text-amber-500 transition-colors duration-300" size={20} />
                {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 bg-transparent border-b-2 border-stone-300 dark:border-stone-600 focus:border-amber-600 dark:focus:border-amber-500 outline-none text-stone-800 dark:text-stone-100 px-0 pt-4 pb-1 pr-20 transition-all duration-300 peer"
                  placeholder=" "
                />
                <label className="absolute left-0 top-3 text-stone-500 dark:text-stone-400 transition-all duration-300 peer-focus:top-0 peer-focus:text-sm peer-focus:text-amber-600 dark:peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-amber-600 dark:peer-[:not(:placeholder-shown)]:text-amber-500">
                  Password
                </label>
                <div className="absolute right-0 top-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>}
              </motion.div>

              {/* Error Message */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2"
                >
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="relative w-full h-12 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-semibold transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
