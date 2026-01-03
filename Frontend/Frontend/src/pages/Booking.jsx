import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar, Users, DollarSign, CreditCard, QrCode } from 'lucide-react';
import { fadeUp, fadeIn } from '../animations/motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { propertiesAPI, bookingsAPI, getToken } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pay_on_site'); // Default payment method

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertiesAPI.getById(id);
        if (data) {
          const mapped = {
            id: data.id,
            title: data.title,
            location: data.location || 'Unknown Location',
            price: data.price,
            images: data.image_url ? [`http://localhost:8000${data.image_url}`] : ['https://via.placeholder.com/600'],
            guests: 8 // Assuming default max guests as backend doesn't have this field yet
          };
          setProperty(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch property", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Property not found
          </h2>
          <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  const nights = bookingData.checkIn && bookingData.checkOut
    ? Math.max(1, Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;

  const subtotal = property.price * nights;
  const serviceFee = subtotal * 0.12;
  const cleaningFee = 50;
  const total = subtotal + serviceFee + cleaningFee;

  const handleSubmit = async () => {
    // Check if user is authenticated before booking
    const token = getToken();
    if (!token) {
      alert("Please login to make a booking");
      navigate('/login');
      return;
    }

    setProcessing(true);
    try {
      // Convert dates to ISO datetime format (YYYY-MM-DDTHH:mm:ss)
      const checkInDate = new Date(bookingData.checkIn);
      checkInDate.setHours(14, 0, 0, 0); // 2 PM check-in

      const checkOutDate = new Date(bookingData.checkOut);
      checkOutDate.setHours(11, 0, 0, 0); // 11 AM check-out

      const payload = {
        room_id: property.id,
        start_date: checkInDate.toISOString(),
        end_date: checkOutDate.toISOString(),
        guests: bookingData.guests,
        payment_method: paymentMethod
      };

      console.log('Booking payload:', payload); // Debug log

      await bookingsAPI.create(payload);
      setBookingComplete(true);
    } catch (error) {
      console.error("Booking failed", error);

      // Improved error messages
      if (error.message.includes('Not authenticated') || error.message.includes('Session expired')) {
        alert(error.message);
        navigate('/login');
      } else {
        alert(`Booking failed: ${error.message}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  // QR Code Payment Configuration
  const UPI_ID = "trivara.hotel@upi"; // Replace with your actual UPI ID
  const MERCHANT_NAME = "Trivara Hotels";
  const generateUPIString = () => {
    const amount = total.toFixed(2);
    const transactionNote = `Booking for ${property.title}`;
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  };

  const steps = [
    { number: 1, label: 'Dates & Guests', icon: Calendar },
    { number: 2, label: 'Review', icon: DollarSign },
    { number: 3, label: 'Payment', icon: CreditCard },
    { number: 4, label: 'Confirm', icon: Check },
  ];

  // Confirmation Screen - minimalist, almost empty, high whitespace
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-graphite pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full text-center"
        >
          {/* One confirmation sentence */}
          <h2 className="text-2xl font-medium text-graphite dark:text-ivory mb-8">
            Your booking is confirmed.
          </h2>

          {/* One booking reference */}
          <p className="text-sm font-light text-neutral dark:text-neutral-400 mb-12">
            {property.title}
          </p>

          {/* One secondary action */}
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            View booking
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-graphite pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
          className="mb-12"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= step.number
                      ? 'bg-accent-slate text-ivory'
                      : 'bg-ivory-bone dark:bg-neutral-800 text-neutral'
                      }`}
                  >
                    {currentStep > step.number ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${currentStep >= step.number
                      ? 'text-accent-slate dark:text-accent-slate-hover'
                      : 'text-neutral dark:text-neutral-400'
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-colors duration-300 ${currentStep > step.number
                      ? 'bg-accent-slate'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={fadeUp.transition}
            >
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-medium text-graphite dark:text-ivory mb-6">
                  {steps[currentStep - 1].label}
                </h2>

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                          Check in
                        </label>
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                          Check out
                        </label>
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-neutral dark:text-neutral-400 mb-2">
                        Guests
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              guests: Math.max(1, bookingData.guests - 1),
                            })
                          }
                          className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300 text-graphite dark:text-ivory"
                        >
                          -
                        </button>
                        <span className="text-lg font-medium text-graphite dark:text-ivory w-12 text-center">
                          {bookingData.guests}
                        </span>
                        <button
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              guests: Math.min(property.guests, bookingData.guests + 1),
                            })
                          }
                          className="w-10 h-10 rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-4">
                        Booking Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral dark:text-neutral-400 font-light">
                            ₹{property.price} × {nights} {nights === 1 ? 'night' : 'nights'}
                          </span>
                          <span className="font-medium text-graphite dark:text-ivory">
                            ₹{subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 dark:text-neutral-400">Service fee</span>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            ₹{serviceFee.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 dark:text-neutral-400">Cleaning fee</span>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            ₹{cleaningFee.toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                          <span className="text-lg font-medium text-graphite dark:text-ivory">
                            Total
                          </span>
                          <span className="text-lg font-medium text-graphite dark:text-ivory">
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {
                  currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-graphite dark:text-ivory mb-2">
                          Select Payment Method
                        </h3>
                        <p className="text-sm text-neutral dark:text-neutral-400 font-light mb-6">
                          Amount to pay: <span className="font-medium text-graphite dark:text-ivory">₹{total.toFixed(2)}</span>
                        </p>

                        <div className="space-y-4">
                          {/* QR Code */}
                          <button
                            onClick={() => setPaymentMethod('qr_code')}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'qr_code'
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <QrCode className={`mt-1 ${paymentMethod === 'qr_code' ? 'text-primary-500' : 'text-neutral-400'}`} size={24} />
                              <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                  Scan QR Code
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                  Scan this QR code with any UPI app to pay
                                </p>
                                {paymentMethod === 'qr_code' && (
                                  <div className="bg-white p-4 rounded-lg inline-block">
                                    <QRCodeSVG value={generateUPIString()} size={200} />
                                    <p className="text-xs text-center text-neutral-500 mt-2">Amount: ₹{total.toFixed(2)}</p>
                                  </div>
                                )}
                              </div>
                              {paymentMethod === 'qr_code' && (
                                <Check className="text-primary-500" size={24} />
                              )}
                            </div>
                          </button>

                          {/* Pay on Site */}
                          <button
                            onClick={() => setPaymentMethod('pay_on_site')}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'pay_on_site'
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <CreditCard className={`mt-1 ${paymentMethod === 'pay_on_site' ? 'text-primary-500' : 'text-neutral-400'}`} size={24} />
                              <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                  Pay on Site
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  Pay ₹{total.toFixed(2)} when you arrive at the hotel
                                </p>
                              </div>
                              {paymentMethod === 'pay_on_site' && (
                                <Check className="text-primary-500" size={24} />
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }

              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={fadeIn.transition}
              className="sticky top-24"
            >
              <Card className="p-6 mb-6">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {property.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {property.location}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={() =>
              currentStep > 1
                ? setCurrentStep(currentStep - 1)
                : navigate(`/property/${id}`)
            }
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
              } else {
                handleSubmit();
              }
            }}
          >
            {currentStep < 4 ? 'Continue' : 'Confirm Booking'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

