import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Trash,
  Store,
  MapPin
} from 'lucide-react';
import api from '../services/api';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Service Form State
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Haircut');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // New Salon Form State
  const [salonName, setSalonName] = useState('');
  const [salonCity, setSalonCity] = useState('');
  const [salonAddress, setSalonAddress] = useState('');
  const [salonDesc, setSalonDesc] = useState('');
  const [salonSuccess, setSalonSuccess] = useState(false);

  // Refresh Trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchOwnerStats = async () => {
      try {
        const res = await api.get(`/dashboard/owner/${user.id}`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching owner dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerStats();
  }, [user, refreshTrigger]);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status?status=${status}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!stats?.salons?.[0]?.id) {
      alert("Please register a salon first!");
      return;
    }
    const salonId = stats.salons[0].id;

    try {
      await api.post(`/salons/${salonId}/services`, {
        name: serviceName,
        category: serviceCategory,
        price: parseFloat(servicePrice),
        description: serviceDesc
      });
      setFormSuccess(true);
      setServiceName('');
      setServicePrice('');
      setServiceDesc('');
      setTimeout(() => setFormSuccess(false), 3000);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to add service:", err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    if (!stats?.salons?.[0]?.id) return;
    const salonId = stats.salons[0].id;

    try {
      await api.delete(`/salons/${salonId}/services/${serviceId}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  const handleRegisterSalon = async (e) => {
    e.preventDefault();
    try {
      await api.post('/salons/register', {
        name: salonName,
        city: salonCity,
        address: salonAddress,
        description: salonDesc,
        ownerId: user.id,
        approved: false, // Pending admin approval
        rating: 5.0,
        images: ['https://image.pollinations.ai/prompt/chic_beauty_salon_interior_modern_lighting_8k?nologo=true']
      });
      setSalonSuccess(true);
      setSalonName('');
      setSalonCity('');
      setSalonAddress('');
      setSalonDesc('');
      setTimeout(() => setSalonSuccess(false), 3000);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Salon registration failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Resolve service lists for catalog management
  // For the seeder data, we only fetch services for their first salon
  const firstSalon = stats?.salons?.[0];

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Salon Owner Dashboard</h1>
          <p className="text-purple-300/40 text-sm">Oversee requests, manage catalogs, and track revenue statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Total Requests</span>
              <span className="text-white font-extrabold text-2xl">{stats?.totalBookings || 0}</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Pending</span>
              <span className="text-white font-extrabold text-2xl">{stats?.pendingBookings || 0}</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Confirmed</span>
              <span className="text-white font-extrabold text-2xl">{stats?.confirmedBookings || 0}</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Total Revenue</span>
              <span className="text-white font-extrabold text-2xl">${stats?.totalRevenue?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Appointments List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Customer Appointment Requests</h2>

              {stats?.bookings?.length === 0 ? (
                <p className="text-purple-300/30 text-sm text-center py-8">No booking requests logged yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats?.bookings?.map((book) => (
                    <div key={book.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-bold text-sm">Booking ID: #{book.id.substring(0, 8)}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest ${
                            book.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                            book.status === 'CONFIRMED' ? 'bg-green-500/10 border-green-500/20 text-green-300' :
                            book.status === 'COMPLETED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                            'bg-rose-500/10 border-rose-500/20 text-rose-300'
                          }`}>
                            {book.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-purple-300/40">
                          <span>Scheduled Date: <strong className="text-purple-200">{book.bookingDate}</strong></span>
                          <span>Time slot: <strong className="text-purple-200">{book.timeSlot}</strong></span>
                        </div>
                      </div>

                      {/* Status actions */}
                      <div className="flex items-center gap-2 border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
                        {book.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(book.id, 'CONFIRMED')}
                              className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(book.id, 'CANCELLED')}
                              className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}
                        {book.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(book.id, 'COMPLETED')}
                            className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Complete Appointment</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog management */}
            {firstSalon && (
              <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">Service Catalog Management</h2>
                {/* Add Service Form */}
                <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 mb-6">
                  <div className="md:col-span-4">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-violet-400" />
                      Add New Service
                    </h4>
                    {formSuccess && (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-2 rounded-xl text-xs flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        Service catalog updated successfully!
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Service Name (e.g. Trim)..."
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c142c] border border-white/10 rounded-xl text-purple-200 text-xs focus:outline-none"
                    >
                      <option value="Haircut">Haircut</option>
                      <option value="Hair Spa">Hair Spa</option>
                      <option value="Hair Coloring">Hair Coloring</option>
                      <option value="Bridal Makeup">Bridal Makeup</option>
                      <option value="Grooming">Grooming</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      placeholder="Price ($)..."
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <button type="submit" className="w-full py-2 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="md:col-span-4">
                    <textarea
                      required
                      rows="2"
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      placeholder="Describe this service catalog entry..."
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/30 focus:outline-none"
                    />
                  </div>
                </form>

                {/* Services list with delete option */}
                <CatalogServicesList salonId={firstSalon.id} refreshTrigger={refreshTrigger} onDelete={handleDeleteService} />
              </div>
            )}
          </div>

          {/* Right Side: Salon Profile & Registration */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Store className="w-5 h-5 text-violet-400" />
                Your Salon Profile
              </h3>

              {firstSalon ? (
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-md">
                    <img src={firstSalon.images?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'} alt="Salon Banner" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-lg flex items-center gap-2">
                      {firstSalon.name}
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        firstSalon.approved ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}>
                        {firstSalon.approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </h4>
                    <p className="text-xs text-purple-300/50 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {firstSalon.address}, {firstSalon.city}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSalon} className="space-y-4">
                  <p className="text-xs text-purple-300/40 leading-relaxed mb-4">
                    You don't have a salon registered on GlamAI yet. Enter details below to submit a registration request.
                  </p>
                  {salonSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-2 rounded-xl text-xs flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      Registration request sent successfully!
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-semibold text-purple-300/60 uppercase tracking-wider mb-1">Salon Name</label>
                    <input
                      type="text"
                      required
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      placeholder="Aura Styling Lounge..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-purple-300/60 uppercase tracking-wider mb-1">City Location</label>
                    <input
                      type="text"
                      required
                      value={salonCity}
                      onChange={(e) => setSalonCity(e.target.value)}
                      placeholder="e.g. New York..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-purple-300/60 uppercase tracking-wider mb-1">Address Details</label>
                    <input
                      type="text"
                      required
                      value={salonAddress}
                      onChange={(e) => setSalonAddress(e.target.value)}
                      placeholder="e.g. 104 Broadway St..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-purple-300/60 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={salonDesc}
                      onChange={(e) => setSalonDesc(e.target.value)}
                      placeholder="Describe your services, credentials, and salon atmosphere..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-purple-300/20 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl btn-primary text-xs font-bold">
                    Register Salon
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

// Helper component to render and load services dynamically
const CatalogServicesList = ({ salonId, refreshTrigger, onDelete }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/salons/${salonId}/services`);
        setServices(res.data);
      } catch (err) {
        console.error("Error loading services for catalog list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [salonId, refreshTrigger]);

  if (loading) return <div className="text-center py-4 text-xs text-purple-300/30 animate-pulse">Loading menu catalog...</div>;

  return (
    <div className="space-y-3">
      <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Service Catalog ({services.length})</h4>
      {services.length === 0 ? (
        <p className="text-purple-300/30 text-xs text-center py-4">No services defined in your menu menu yet.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {services.map((srv) => (
            <div key={srv.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[8px] font-bold uppercase tracking-wider mr-1.5">{srv.category}</span>
                <span className="text-white text-xs font-bold">{srv.name}</span>
                <span className="block text-[10px] text-purple-300/40 mt-0.5">${srv.price}</span>
              </div>
              <button
                onClick={() => onDelete(srv.id)}
                className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
