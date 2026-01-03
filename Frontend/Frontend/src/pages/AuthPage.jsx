import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/animated-auth.css';
import trivaraLogo from '../assets/trivara-logo.png';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    // Determine initial mode from URL
    const [isRegisterMode, setIsRegisterMode] = useState(
        location.pathname === '/signup'
    );

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitError('');
        setIsSubmitting(true);

        // Validation
        const newErrors = {};
        if (!loginData.email) newErrors.email = 'Email is required';
        if (!loginData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await login(loginData.email, loginData.password);
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitError('');
        setIsSubmitting(true);

        // Validation
        const newErrors = {};
        if (!registerData.name) newErrors.name = 'Name is required';
        if (!registerData.email) newErrors.email = 'Email is required';
        if (!registerData.password) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await register({
                email: registerData.email,
                password: registerData.password,
                full_name: registerData.name,
            });

            if (result.success) {
                // Switch to login mode after successful registration
                setIsRegisterMode(false);
                setSubmitError('');
                setLoginData({ email: registerData.email, password: '' });
            } else {
                setSubmitError(result.error || 'Registration failed');
            }
        } catch (error) {
            setSubmitError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setErrors({});
        setSubmitError('');
        // Update URL
        navigate(isRegisterMode ? '/login' : '/signup', { replace: true });
    };

    return (
        <div className="auth-page">
            <div className={`auth-container ${isRegisterMode ? 'auth-active' : ''}`}>
                {/* Curved Shapes */}
                <div className="auth-curved-shape"></div>
                <div className="auth-curved-shape2"></div>

                {/* Login Form */}
                <div className="auth-form-box auth-login">
                    <div className="auth-logo auth-animation" style={{ '--s': 0, '--d': 0 }}>
                        <img src={trivaraLogo} alt="Trivara Rooms" />
                        <span>Trivara</span>
                    </div>

                    <h2 className="auth-animation" style={{ '--s': 1, '--d': 21 }}>
                        Login
                    </h2>

                    <form onSubmit={handleLogin}>
                        <div className="auth-input-box auth-animation" style={{ '--s': 2, '--d': 22 }}>
                            <input
                                type="email"
                                required
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                            <label>Email</label>
                            <Mail className="auth-icon" size={20} />
                            {errors.email && <span className="auth-error">{errors.email}</span>}
                        </div>

                        <div className="auth-input-box auth-animation" style={{ '--s': 3, '--d': 23 }}>
                            <input
                                type="password"
                                required
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                            <label>Password</label>
                            <Lock className="auth-icon" size={20} />
                            {errors.password && <span className="auth-error">{errors.password}</span>}
                        </div>

                        {submitError && !isRegisterMode && (
                            <div className="auth-submit-error auth-animation" style={{ '--s': 4, '--d': 24 }}>
                                <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                {submitError}
                            </div>
                        )}

                        <div className="auth-input-box auth-animation" style={{ '--s': 5, '--d': 25 }}>
                            <button className="auth-btn" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Login'}
                            </button>
                        </div>

                        <div className="auth-regi-link auth-animation" style={{ '--s': 6, '--d': 26 }}>
                            <p>
                                Don't have an account? <br />
                                <a onClick={toggleMode}>Sign Up</a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Login Info Content */}
                <div className="auth-info-content auth-login">
                    <h2 className="auth-animation" style={{ '--s': 0, '--d': 20 }}>
                        WELCOME BACK!
                    </h2>
                    <p className="auth-animation" style={{ '--s': 1, '--d': 21 }}>
                        We're happy to have you with us again. Experience luxury living with Trivara Rooms.
                    </p>
                </div>

                {/* Register Form */}
                <div className="auth-form-box auth-register">
                    <div className="auth-logo auth-animation" style={{ '--li': 17, '--s': 0 }}>
                        <img src={trivaraLogo} alt="Trivara Rooms" />
                        <span>Trivara</span>
                    </div>

                    <h2 className="auth-animation" style={{ '--li': 17, '--s': 0 }}>
                        Register
                    </h2>

                    <form onSubmit={handleRegister}>
                        <div className="auth-input-box auth-animation" style={{ '--li': 18, '--s': 1 }}>
                            <input
                                type="text"
                                required
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            />
                            <label>Full Name</label>
                            <User className="auth-icon" size={20} />
                            {errors.name && <span className="auth-error">{errors.name}</span>}
                        </div>

                        <div className="auth-input-box auth-animation" style={{ '--li': 19, '--s': 2 }}>
                            <input
                                type="email"
                                required
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            />
                            <label>Email</label>
                            <Mail className="auth-icon" size={20} />
                            {errors.email && <span className="auth-error">{errors.email}</span>}
                        </div>

                        <div className="auth-input-box auth-animation" style={{ '--li': 20, '--s': 3 }}>
                            <input
                                type="password"
                                required
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            />
                            <label>Password</label>
                            <Lock className="auth-icon" size={20} />
                            {errors.password && <span className="auth-error">{errors.password}</span>}
                        </div>

                        {submitError && isRegisterMode && (
                            <div className="auth-submit-error auth-animation" style={{ '--li': 21, '--s': 4 }}>
                                <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                {submitError}
                            </div>
                        )}

                        <div className="auth-input-box auth-animation" style={{ '--li': 22, '--s': 5 }}>
                            <button className="auth-btn" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating account...' : 'Register'}
                            </button>
                        </div>

                        <div className="auth-regi-link auth-animation" style={{ '--li': 23, '--s': 6 }}>
                            <p>
                                Already have an account? <br />
                                <a onClick={toggleMode}>Sign In</a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Register Info Content */}
                <div className="auth-info-content auth-register">
                    <h2 className="auth-animation" style={{ '--li': 17, '--s': 0 }}>
                        WELCOME!
                    </h2>
                    <p className="auth-animation" style={{ '--li': 18, '--s': 1 }}>
                        Join Trivara Rooms today and discover amazing properties that feel like home.
                    </p>
                </div>
            </div>
        </div>
    );
}
