import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { fadeUp } from '../animations/motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authAPI.forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError('Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
            <motion.div
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={fadeUp.transition}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary-500">
                        LuxeStay
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        Enter your email to reset your password
                    </p>
                </div>

                <Card className="p-8">
                    {submitted ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Check your inbox
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                We have sent password reset instructions to <strong>{email}</strong>
                            </p>
                            <Link to="/login">
                                <Button fullWidth>
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button type="submit" fullWidth disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                                {!loading && <ArrowRight size={18} className="ml-2" />}
                            </Button>

                            <div className="text-center mt-6">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors duration-300"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
