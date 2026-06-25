import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, Sparkles, AlertCircle, Camera, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import api from '../services/api';

const FaceAnalysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file (PNG/JPG).');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!file) {
      setError('Please choose a selfie image to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      const res = await api.post('/ai/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResult(res.data);
    } catch (err) {
      console.error("AI Analysis error:", err);
      setError(err.response?.data || 'Failed to complete facial analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startTryOn = (styleName) => {
    if (!analysisResult) return;
    navigate('/hairstyle-preview', {
      state: {
        originalImageUrl: analysisResult.selfieUrl,
        selectedStyle: styleName,
      },
    });
  };

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Mirror Studio</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">AI Face Analysis & Styling</h1>
          <p className="text-purple-300/40 text-sm max-w-lg mx-auto">
            Upload your selfie to scan facial features, determine your face shape, and unlock tailored hairstyle recommendations.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-rose-500/10 border border-rose-500/25 text-rose-300 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-pulse">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Phase 1: Upload Form */}
        {!analysisResult && (
          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              {/* Image Uploader area */}
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-violet-500/30 group">
                    <img src={previewUrl} alt="Selfie Preview" className="w-full h-full object-cover" />
                    {/* Scanning overlay loader */}
                    {loading && <div className="scanner-line" />}
                    {!loading && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity text-white text-xs font-bold">
                        <Camera className="w-6 h-6" />
                        <span>Change Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="w-full max-w-lg h-60 rounded-2xl border border-dashed border-white/10 hover:border-violet-500/50 bg-white/5 hover:bg-violet-950/10 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white mb-1">Click to Upload Selfie</span>
                      <span className="text-xs text-purple-300/40">PNG, JPG up to 10MB. Make sure your face is clearly visible.</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              {/* Submit Trigger */}
              <div className="text-center">
                {!user ? (
                  <Link to="/login" className="inline-flex py-3.5 px-8 rounded-xl btn-primary text-sm font-bold shadow-lg">
                    Sign In to Analyze
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={!file || loading}
                    className="inline-flex py-4 px-12 rounded-xl btn-primary text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Face Shape...
                      </span>
                    ) : (
                      'Analyze Selfie'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Phase 2: Analysis Results View */}
        {analysisResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Cards with Metrics */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0">
                <img src={analysisResult.selfieUrl} alt="Analyzed Face" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  Analysis Complete
                </h3>
                {/* Metric Badges */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="p-3 px-5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Face Shape</span>
                    <span className="text-white font-extrabold text-lg">{analysisResult.faceShape}</span>
                  </div>
                  <div className="p-3 px-5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Hair Type</span>
                    <span className="text-white font-extrabold text-lg">{analysisResult.hairType}</span>
                  </div>
                  <div className="p-3 px-5 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="block text-[10px] text-purple-300/40 uppercase font-semibold">Density</span>
                    <span className="text-white font-extrabold text-lg">{analysisResult.hairDensity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Recommended Hairstyles For You
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysisResult.recommendedStyles?.map((style) => {
                  const score = analysisResult.suitabilityScores?.[style] || 90;
                  const tip = analysisResult.stylingTips?.[style] || "Style with light holding gel.";
                  
                  return (
                    <div key={style} className="glass-card p-6 rounded-2xl flex flex-col justify-between h-80">
                      <div>
                        {/* Style Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="text-white font-extrabold text-base leading-snug">{style}</h4>
                          <span className="text-xs font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                            {score}% Match
                          </span>
                        </div>
                        {/* Score bar indicator */}
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-4">
                          <div className="bg-gradient-to-r from-violet-500 to-rose-500 h-full" style={{ width: `${score}%` }} />
                        </div>
                        {/* styling tip */}
                        <p className="text-purple-200/50 text-xs leading-relaxed">
                          <span className="font-bold text-purple-300 block mb-1">Styling Tip:</span>
                          {tip}
                        </p>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => startTryOn(style)}
                        className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Preview Virtually</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Restart Trigger */}
            <div className="text-center pt-6">
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl('');
                  setAnalysisResult(null);
                }}
                className="px-6 py-3 rounded-xl btn-secondary text-xs font-bold"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceAnalysis;
