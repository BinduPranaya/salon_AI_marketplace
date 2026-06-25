import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Store, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setStats(res.data);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [user, refreshTrigger]);

  const handleApproveSalon = async (salonId, approve) => {
    try {
      await api.patch(`/dashboard/admin/salons/${salonId}/approve?approve=${approve}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to approve/decline salon:", err);
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
        {/* Header Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1.5">Platform Admin Dashboard</h1>
            <p className="text-purple-300/40 text-sm">Supervise registered salons, verify approvals, and review statistics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Total Users</span>
              <span className="text-white font-extrabold text-2xl">{stats?.totalUsers || 0}</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Total Salons</span>
              <span className="text-white font-extrabold text-2xl">{stats?.totalSalons || 0}</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Pending Approval</span>
              <span className="text-white font-extrabold text-2xl">{stats?.pendingSalons || 0}</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Platform Bookings</span>
              <span className="text-white font-extrabold text-2xl">{stats?.totalBookings || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Salons List with approval button */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Salon Approvals Panel</h2>

              {stats?.salons?.length === 0 ? (
                <p className="text-purple-300/30 text-sm text-center py-8">No salons registered on the platform.</p>
              ) : (
                <div className="space-y-4">
                  {stats?.salons?.map((salon) => (
                    <div key={salon.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-bold text-base">{salon.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${
                            salon.approved ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                          }`}>
                            {salon.approved ? 'Approved' : 'Pending Verification'}
                          </span>
                        </div>
                        <div className="text-xs text-purple-300/40 space-y-1">
                          <div>Location: <strong className="text-purple-200">{salon.address}, {salon.city}</strong></div>
                          <div>Description: <span className="text-purple-200/60 line-clamp-1">{salon.description}</span></div>
                        </div>
                      </div>

                      {/* Approval Toggles */}
                      <div className="flex items-center gap-2 border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
                        {!salon.approved ? (
                          <button
                            onClick={() => handleApproveSalon(salon.id, true)}
                            className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Salon</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveSalon(salon.id, false)}
                            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Suspend Salon</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Users Overview */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Registered Platform Users</h3>
              <div className="space-y-4">
                {stats?.users?.map((usr) => (
                  <div key={usr.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/5 flex-shrink-0 bg-white/5">
                      <img src={usr.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usr.name}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-white truncate">{usr.name}</span>
                      <span className="block text-[10px] text-purple-300/40 truncate">{usr.email}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      usr.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                      usr.role === 'SALON_OWNER' ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20' :
                      'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                    }`}>
                      {usr.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
