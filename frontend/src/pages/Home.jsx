import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, MapPin, Star, Flame, ShieldCheck, HeartPulse } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [salons, setSalons] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedSalons = async () => {
      try {
        const res = await api.get('/salons?approvedOnly=true');
        // Take top 3 for featured section
        setSalons(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured salons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedSalons();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCity) query.append('city', searchCity);
    if (searchName) query.append('name', searchName);
    navigate(`/search?${query.toString()}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const categories = [
    { name: 'Haircut', icon: '✂️', desc: 'Precision styling' },
    { name: 'Hair Spa', icon: '🧖‍♀️', desc: 'Deep hydration' },
    { name: 'Hair Coloring', icon: '🎨', desc: 'Fashion highlights' },
    { name: 'Bridal Makeup', icon: '💄', desc: 'Wedding glow' },
    { name: 'Grooming', icon: '🪒', desc: 'Classic trims' },
  ];

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-violet-950/20 via-rose-950/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-16 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Facial AI Matching Powered by Gemini</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Discover Salons & Your{' '}
          <span className="gradient-text font-black block md:inline">Perfect AI Hairstyle</span>
        </h1>

        <p className="text-purple-200/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a selfie, get instant AI facial analysis, try on stunning new hair models virtually, and book appointments with matching salons near you.
        </p>

        {/* Hero Search Box */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl md:rounded-full border border-white/10 shadow-2xl flex flex-col md:flex-row gap-2 mb-16">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b border-white/5 md:border-b-0">
            <Search className="w-5 h-5 text-purple-300/40" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="bg-transparent text-white placeholder-purple-300/30 text-sm focus:outline-none w-full"
              placeholder="Search salon names or services..."
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b border-white/5 md:border-b-0 md:border-l md:border-white/10">
            <MapPin className="w-5 h-5 text-purple-300/40" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="bg-transparent text-white placeholder-purple-300/30 text-sm focus:outline-none w-full"
              placeholder="City (e.g. New York, Los Angeles)..."
            />
          </div>
          <button type="submit" className="px-8 py-3.5 rounded-xl md:rounded-full btn-primary text-sm font-semibold flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search Salons</span>
          </button>
        </form>

        {/* AI Action Banner */}
        <div className="max-w-5xl mx-auto rounded-3xl relative overflow-hidden glass-panel border border-violet-500/20 p-8 md:p-12 shadow-2xl text-left flex flex-col md:flex-row items-center gap-8 bg-gradient-to-tr from-violet-950/40 via-purple-950/20 to-rose-950/20">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-rose-500/5 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-600/5 blur-[80px] pointer-events-none" />
          <div className="flex-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GlamAI Studio</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Visualize Your Next Hairstyle Virtually
            </h3>
            <p className="text-purple-300/70 text-sm md:text-base leading-relaxed mb-6">
              Our advanced Face Analyzer maps your facial structures to find the most flattering cuts. Try them on virtually using AI generation and book instantly.
            </p>
            <Link to="/ai-salon" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-primary text-sm font-bold shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Start Face Analysis</span>
            </Link>
          </div>
          <div className="w-full md:w-80 flex-shrink-0 flex items-center justify-center z-10">
            {/* Try-on graphics */}
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 flex items-center justify-center">
              <img
                src="https://image.pollinations.ai/prompt/split_screen_before_and_after_professional_hair_salon_style_makeover_8k?nologo=true&seed=88"
                alt="Try-on Example"
                className="object-cover w-full h-full opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0716] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-300 bg-black/40 px-2.5 py-1 rounded-full border border-rose-500/30">
                  Try-on Demo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16 z-10 relative">
        <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
          <Flame className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-bold text-white tracking-wide">Trending Services</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="glass-card p-6 rounded-2xl text-center group flex flex-col items-center cursor-pointer"
            >
              <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h4 className="text-white font-bold text-sm mb-1">{cat.name}</h4>
              <span className="text-xs text-purple-300/40">{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Salons Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <ShieldCheck className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white tracking-wide">Featured Partner Salons</h2>
            </div>
            <p className="text-purple-300/50 text-sm text-center md:text-left">Top-rated beauty hubs certified by GlamAI for premium styling</p>
          </div>
          <Link to="/search" className="text-rose-400 hover:text-rose-300 text-sm font-semibold tracking-wide transition-all text-center">
            View All Salons &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel h-80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <div key={salon.id} className="glass-card rounded-2xl overflow-hidden flex flex-col">
                <div className="h-48 relative overflow-hidden bg-black/20">
                  <img
                    src={salon.images?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}
                    alt={salon.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{salon.rating || '5.0'}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2">{salon.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/60 mb-4">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{salon.address}, {salon.city}</span>
                  </div>
                  <p className="text-purple-200/50 text-xs leading-relaxed mb-6 flex-1">
                    {salon.description && salon.description.length > 100
                      ? `${salon.description.substring(0, 100)}...`
                      : salon.description}
                  </p>
                  <Link to={`/salon/${salon.id}`} className="w-full py-3 rounded-xl btn-secondary text-center text-xs font-bold block">
                    View Services & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust & Features Info */}
      <div className="max-w-7xl mx-auto px-4 py-16 z-10 relative border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Smart Face Mapping</h4>
            <p className="text-purple-300/40 text-sm leading-relaxed">
              We leverage Gemini Vision to identify face dimensions, ensuring highly flattering style matching.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-rose-400" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Virtual Hair try-on</h4>
            <p className="text-purple-300/40 text-sm leading-relaxed">
              Generate visual hair makeovers dynamically prior to stepping into any physical salon.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <HeartPulse className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Instant Booking</h4>
            <p className="text-purple-300/40 text-sm leading-relaxed">
              Seamlessly secure appointments, select services, and map slots with premium providers in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
