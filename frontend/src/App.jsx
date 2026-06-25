import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import SalonDetails from './pages/SalonDetails';
import FaceAnalysis from './pages/FaceAnalysis';
import HairstylePreviewPage from './pages/HairstylePreview';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Sparkles, Search, User, LogOut, Menu, X, Scissors, ClipboardList, ShieldAlert } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin-dashboard';
    if (user?.role === 'SALON_OWNER') return '/owner-dashboard';
    return '/dashboard';
  };

  const getDashboardIcon = () => {
    if (user?.role === 'ADMIN') return <ShieldAlert className="w-4 h-4" />;
    if (user?.role === 'SALON_OWNER') return <Scissors className="w-4 h-4" />;
    return <ClipboardList className="w-4 h-4" />;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center shadow shadow-violet-500/10 group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              GLAM<span className="text-rose-500 font-medium">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-purple-200/70 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>Search Salons</span>
            </Link>
            <Link to="/ai-salon" className="text-purple-200/70 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="gradient-text font-bold">AI Studio</span>
            </Link>
          </div>

          {/* Desktop Session controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-bold text-white transition-colors"
                >
                  {getDashboardIcon()}
                  <span>Dashboard</span>
                </Link>
                <div className="text-right">
                  <span className="block text-xs font-bold text-white">{user.name}</span>
                  <span className="block text-[9px] text-purple-300/40 uppercase font-semibold">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-purple-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 py-4 px-6 space-y-4 shadow-xl">
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-purple-200/70 hover:text-white text-sm font-semibold py-2"
          >
            Search Salons
          </Link>
          <Link
            to="/ai-salon"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-rose-400 hover:text-rose-300 text-sm font-bold py-2"
          >
            AI Studio (Facial try-on)
          </Link>

          <div className="pt-4 border-t border-white/5">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs text-white">
                    {user.name[0]}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">{user.name}</span>
                    <span className="block text-[10px] text-purple-300/40">{user.email}</span>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 rounded-xl btn-secondary text-center text-xs font-bold"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 rounded-xl btn-primary text-center text-xs font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  return (
    <footer className="glass-panel border-t border-white/5 py-8 mt-auto relative z-10 text-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-purple-300/30 text-xs">
          &copy; {new Date().getFullYear()} GlamAI Marketplace. All rights reserved.
        </span>
        <span className="text-purple-300/30 text-xs flex items-center gap-1 justify-center">
          Powered by <span className="text-rose-400 font-semibold">Gemini AI</span> &amp; <span className="text-violet-400 font-semibold">Vite</span>
        </span>
      </div>
    </footer>
  );
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/salon/:id" element={<SalonDetails />} />
          <Route path="/ai-salon" element={<FaceAnalysis />} />
          <Route path="/hairstyle-preview" element={<HairstylePreviewPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
