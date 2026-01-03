import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import AboutUs from './pages/AboutUs';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/property/:id/booking" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Protected Host Route */}
              <Route
                path="/host"
                element={
                  <ProtectedRoute role="admin">
                    <HostDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/saved" element={<Dashboard />} />
              {/* Fallback route */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        404 - Page Not Found
                      </h2>
                      <a
                        href="/"
                        className="text-primary-500 hover:text-primary-600 transition-colors duration-300"
                      >
                        Return to Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

