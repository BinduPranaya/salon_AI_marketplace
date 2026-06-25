import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Calendar, Clock, Sparkles, CheckCircle2, User, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../services/api';

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow States
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const [salonRes, servicesRes, reviewsRes] = await Promise.all([
          api.get(`/salons/${id}`),
          api.get(`/salons/${id}/services`),
          api.get(`/salons/${id}/reviews`)
        ]);
        setSalon(salonRes.data);
        setServices(servicesRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error loading salon details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalonData();
  }, [id, reviewSuccess]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedService || !bookingDate || !bookingTime) return;

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        userId: user.id,
        salonId: id,
        serviceId: selectedService.id,
        bookingDate,
        timeSlot: bookingTime
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!comment) return;

    try {
      await api.post(`/salons/${id}/reviews`, {
        userId: user.id,
        userName: user.name,
        rating: parseFloat(rating),
        comment
      });
      setReviewSuccess(true);
      setComment('');
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error("Review submission failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center text-white px-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold">Salon Not Found</h2>
        <Link to="/search" className="mt-4 px-6 py-2 rounded-xl btn-secondary text-sm">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Salon Header / Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 h-[300px] md:h-[400px] shadow-2xl border border-white/5 bg-black/20">
          <img
            src={salon.images?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200'}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3">{salon.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-purple-200">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-bold text-white">{salon.rating}</span> ({reviews.length} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{salon.address}, {salon.city}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-purple-200/60 text-sm leading-relaxed whitespace-pre-line">{salon.description}</p>
            </div>

            {/* Service Menu */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Service Menu</h2>
              {services.length === 0 ? (
                <p className="text-purple-300/40 text-sm text-center">No services currently listed for this salon.</p>
              ) : (
                <div className="space-y-4">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        selectedService?.id === srv.id
                          ? 'bg-violet-600/10 border-violet-500 shadow-lg'
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                            {srv.category}
                          </span>
                          <h4 className="text-white font-bold text-base">{srv.name}</h4>
                        </div>
                        <p className="text-purple-200/50 text-xs leading-relaxed">{srv.description}</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
                        <span className="text-xl font-extrabold text-white">${srv.price}</span>
                        <button
                          onClick={() => {
                            setSelectedService(srv);
                            // Scroll down on mobile to scheduler
                            const sched = document.getElementById('scheduler-card');
                            if (sched) sched.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            selectedService?.id === srv.id
                              ? 'bg-violet-600 text-white shadow-md'
                              : 'btn-secondary'
                          }`}
                        >
                          {selectedService?.id === srv.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Customer Reviews</h2>

              {/* Review Input */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    Write a Review
                  </h4>

                  {reviewSuccess && (
                    <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Review submitted successfully!
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-semibold text-purple-300/80 uppercase tracking-wider">Rating:</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              num <= rating ? 'text-amber-400 fill-current' : 'text-purple-300/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <textarea
                      required
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your grooming experience..."
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-purple-300/30 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <button type="submit" className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-purple-300/50">
                  Please{' '}
                  <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold underline">
                    sign in
                  </Link>{' '}
                  to leave a review.
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-purple-300/40 text-sm text-center py-6">Be the first to review this salon!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-violet-300" />
                          </div>
                          <span className="text-white font-bold text-sm">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`w-3.5 h-3.5 ${
                                n <= rev.rating ? 'text-amber-400 fill-current' : 'text-purple-300/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-purple-200/60 text-xs leading-relaxed pl-10">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar / Scheduler */}
          <div className="lg:col-span-1" id="scheduler-card">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-400" />
                Book Appointment
              </h3>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Booking Confirmed!</h4>
                  <p className="text-purple-300/50 text-xs leading-relaxed mb-6">
                    Your appointment has been logged successfully and is currently pending salon approval.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3.5 rounded-xl btn-primary text-xs font-bold"
                  >
                    Go to User Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {/* Selected service details */}
                  {selectedService ? (
                    <div className="p-4 rounded-2xl bg-violet-600/10 border border-violet-500/30 flex justify-between items-center">
                      <div>
                        <span className="block text-[10px] text-purple-300/60 uppercase font-semibold">Selected Service</span>
                        <span className="text-white font-bold text-sm">{selectedService.name}</span>
                      </div>
                      <span className="text-white font-extrabold text-lg">${selectedService.price}</span>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-purple-300/40">
                      Please select a service from the menu list to begin scheduling.
                    </div>
                  )}

                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        disabled={!selectedService}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Block past dates
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm disabled:opacity-40"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          disabled={!bookingDate}
                          onClick={() => setBookingTime(slot)}
                          className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                            bookingTime === slot
                              ? 'bg-rose-500/20 border-rose-500 text-white shadow-md'
                              : 'bg-white/5 border-white/5 text-purple-300/60 hover:border-white/10 disabled:opacity-30 disabled:hover:border-white/5'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Booking Trigger Button */}
                  <button
                    type="submit"
                    disabled={!selectedService || !bookingDate || !bookingTime || bookingLoading}
                    className="w-full py-4 rounded-xl btn-primary text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : !user ? (
                      'Sign In to Book'
                    ) : (
                      'Confirm Appointment'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDetails;
