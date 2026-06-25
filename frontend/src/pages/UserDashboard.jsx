import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Sparkles, User as UserIcon, Star, CheckCircle, Clock, MapPin } from 'lucide-react';
import api from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, analysesRes, previewsRes, salonsRes, servicesRes] = await Promise.all([
          api.get(`/bookings/user/${user.id}`),
          api.get(`/ai/analysis-history/${user.id}`),
          api.get(`/ai/preview-history/${user.id}`),
          api.get('/salons'),
          api.get('/salons?serviceCategory=Haircut') // We just fetch some services to resolve names
        ]);
        setBookings(bookingsRes.data);
        setAnalyses(analysesRes.data);
        setPreviews(previewsRes.data);
        setSalons(salonsRes.data);

        // Fetch all services globally if possible, or build service map
        // Let's resolve services names using a simple service list
        const srvRes = await api.get('/salons');
        const srvList = [];
        for (const sal of srvRes.data) {
          try {
            const sRes = await api.get(`/salons/${sal.id}/services`);
            srvList.push(...sRes.data);
          } catch (e) {
            // ignore
          }
        }
        setServices(srvList);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Helpers to resolve names
  const getSalonName = (salonId) => {
    const s = salons.find((sl) => sl.id === salonId);
    return s ? s.name : "Beauty Salon";
  };

  const getServiceName = (serviceId) => {
    const s = services.find((sr) => sr.id === serviceId);
    return s ? s.name : "Hair Styling";
  };

  const getServicePrice = (serviceId) => {
    const s = services.find((sr) => sr.id === serviceId);
    return s ? s.price : 45.0;
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-green-500/10 border-green-500/20 text-green-300';
      case 'COMPLETED': return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      case 'CANCELLED': return 'bg-rose-500/10 border-rose-500/20 text-rose-300';
      default: return 'bg-amber-500/10 border-amber-500/20 text-amber-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Card Header */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-violet-500/20 shadow-md flex-shrink-0 bg-white/5">
            <img src={user?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg'} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5">{user?.name}</h1>
            <span className="text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {user?.role} Account
            </span>
            <span className="block mt-3 text-xs text-purple-300/40">{user?.email}</span>
          </div>
        </div>

        {/* Dash Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bookings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-400" />
                Appointment Bookings
              </h2>

              {bookings.length === 0 ? (
                <div className="text-center py-10 text-purple-300/30 text-sm">
                  No appointments booked yet. Search salons to schedule your first visit!
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((book) => (
                    <div key={book.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-bold text-base">{getSalonName(book.salonId)}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(book.status)}`}>
                            {book.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-purple-200/50">
                          <span>Service: <strong className="text-purple-200">{getServiceName(book.serviceId)}</strong></span>
                          <span>Price: <strong className="text-purple-200">${getServicePrice(book.serviceId)}</strong></span>
                          <span>Date: <strong>{book.bookingDate}</strong></span>
                          <span>Time: <strong>{book.timeSlot}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generated try-on styles gallery */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                Saved AI Hairstyle Previews
              </h2>

              {previews.length === 0 ? (
                <p className="text-purple-300/30 text-sm text-center py-8">No hairstyle previews saved yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previews.map((prev) => (
                    <div key={prev.id} className="relative rounded-xl overflow-hidden border border-white/10 group aspect-square">
                      <img src={prev.previewImageUrl} alt={prev.selectedStyle} className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wide">{prev.selectedStyle}</span>
                        <span className="text-[8px] text-purple-300/40">Try-on Output</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Analysis History */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                AI Analysis History
              </h3>

              {analyses.length === 0 ? (
                <p className="text-purple-300/30 text-sm text-center py-6">No face scans recorded yet.</p>
              ) : (
                <div className="space-y-6">
                  {analyses.map((ana) => (
                    <div key={ana.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={ana.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-white">Face Shape: {ana.faceShape}</span>
                          <span className="block text-[10px] text-purple-300/50">{new Date(ana.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <span className="block text-[9px] text-purple-300/40 uppercase font-bold tracking-wider mb-1.5">Recommendations:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {ana.recommendedStyles?.map((style) => (
                            <span key={style} className="px-2 py-0.5 rounded bg-violet-600/10 border border-violet-500/20 text-[9px] font-semibold text-violet-300">
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
