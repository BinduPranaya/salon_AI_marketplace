import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star, Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';
import api from '../services/api';

const SearchPage = () => {
  const location = useLocation();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tier, setTier] = useState('ALL'); // ALL, LUXURY, BUDGET

  useEffect(() => {
    // Parse query parameters from URL on load
    const params = new URLSearchParams(location.search);
    const initialCity = params.get('city') || '';
    const initialName = params.get('name') || '';
    const initialCategory = params.get('category') || '';
    
    setCity(initialCity);
    setName(initialName);
    setCategory(initialCategory);

    fetchSalons(initialCity, initialName, initialCategory);
  }, [location.search]);

  const fetchSalons = async (cCity, cName, cCat) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (cCity) query.append('city', cCity);
      if (cName) query.append('name', cName);
      if (cCat) query.append('serviceCategory', cCat);
      query.append('approvedOnly', 'true');

      const res = await api.get(`/salons?${query.toString()}`);
      setSalons(res.data);
    } catch (err) {
      console.error("Error loading search results:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchSalons(city, name, category);
  };

  const clearFilters = () => {
    setCity('');
    setName('');
    setCategory('');
    setTier('ALL');
    fetchSalons('', '', '');
  };

  // Client-side filtering for Luxury / Budget tiers
  const filteredSalons = salons.filter((salon) => {
    if (tier === 'LUXURY') {
      return salon.rating >= 4.7;
    }
    if (tier === 'BUDGET') {
      // In seed data, Budget Cuts is rated 4.2 or we check names
      return salon.rating < 4.7;
    }
    return true;
  });

  const categories = ['Haircut', 'Hair Spa', 'Hair Coloring', 'Bridal Makeup', 'Grooming'];

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white mb-2">Find a Beauty Salon</h1>
          <p className="text-purple-300/40 text-sm">Compare services, ratings, and book your next appointment instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide">
                  <Filter className="w-4 h-4 text-violet-400" />
                  <span>Filters</span>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                >
                  Clear All
                </button>
              </div>

              <form onSubmit={handleFilterSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                    Search Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/20 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
                    placeholder="e.g. Vogue, Crown..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                    City Location
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/20 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
                    placeholder="e.g. New York..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                    Service Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-purple-200 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
                  >
                    <option value="" className="bg-[#1c142c] text-purple-200">All Services</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat} className="bg-[#1c142c] text-purple-200">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                    Pricing & Tier
                  </label>
                  <div className="space-y-2">
                    {['ALL', 'LUXURY', 'BUDGET'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTier(opt)}
                        className={`w-full py-2 px-4 rounded-xl text-xs font-semibold text-left border transition-all ${
                          tier === opt
                            ? 'bg-violet-600/20 border-violet-500 text-white'
                            : 'bg-white/5 border-white/5 text-purple-300/50 hover:border-white/10'
                        }`}
                      >
                        {opt === 'ALL' && 'All Salons'}
                        {opt === 'LUXURY' && 'Luxury Salons (4.7+ ★)'}
                        {opt === 'BUDGET' && 'Budget Salons'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Apply Filters</span>
                </button>
              </form>
            </div>
          </div>

          {/* Salons Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4].map((n) => (
                  <div key={n} className="glass-panel h-80 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredSalons.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-purple-300/30 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Salons Found</h3>
                <p className="text-purple-300/50 text-sm max-w-sm mb-6">
                  We couldn't find any approved partner salons matching your current filters. Try relaxing your parameters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl btn-secondary text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSalons.map((salon) => (
                  <div key={salon.id} className="glass-card rounded-2xl overflow-hidden flex flex-col">
                    <div className="h-44 relative overflow-hidden bg-black/20">
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
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1.5">{salon.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-purple-300/60 mb-3">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{salon.address}, {salon.city}</span>
                        </div>
                        <p className="text-purple-200/50 text-xs leading-relaxed mb-4">
                          {salon.description && salon.description.length > 120
                            ? `${salon.description.substring(0, 120)}...`
                            : salon.description}
                        </p>
                      </div>
                      <Link to={`/salon/${salon.id}`} className="w-full py-3 rounded-xl btn-primary text-center text-xs font-bold block mt-2">
                        View Details & Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
