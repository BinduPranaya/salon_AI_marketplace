import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sparkles, AlertCircle, User, Scissors } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // USER or SALON_OWNER
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);

    try {
      const user = await register(name, email, password, role, `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`);
      if (user.role === 'SALON_OWNER') {
        navigate('/owner-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed. Email might already be registered.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg grid-bg flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            GLAM<span className="text-rose-500 font-medium">AI</span>
          </span>
        </Link>
        <p className="text-purple-300/60 text-sm">Discover salons & your perfect look with AI analysis</p>
      </div>

      {/* Card Wrapper */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl border border-white/5 z-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-pulse">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setRole('USER')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1.5 border text-xs font-semibold tracking-wide transition-all ${
                role === 'USER'
                  ? 'bg-gradient-to-tr from-violet-600/20 to-rose-500/20 border-violet-500 text-white shadow-lg shadow-violet-500/10'
                  : 'bg-white/5 border-white/10 text-purple-300/60 hover:border-white/20'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('SALON_OWNER')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1.5 border text-xs font-semibold tracking-wide transition-all ${
                role === 'SALON_OWNER'
                  ? 'bg-gradient-to-tr from-violet-600/20 to-rose-500/20 border-violet-500 text-white shadow-lg shadow-violet-500/10'
                  : 'bg-white/5 border-white/10 text-purple-300/60 hover:border-white/20'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Salon Owner</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
              placeholder="Alex Johnson"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/40 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className="w-full py-4 rounded-xl btn-primary text-sm font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
          >
            {localLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-purple-300/50">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
