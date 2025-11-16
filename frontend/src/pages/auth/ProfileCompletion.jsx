import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdPhone, MdArrowForward } from 'react-icons/md';

const ProfileCompletion = () => {
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+880'); // Default Bangladesh
  const [loading, setLoading] = useState(false);
  
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const countryCodes = [
    { code: '+880', country: '🇧🇩 Bangladesh', flag: '🇧🇩' },
    { code: '+91', country: '🇮🇳 India', flag: '🇮🇳' },
    { code: '+92', country: '🇵🇰 Pakistan', flag: '🇵🇰' },
    { code: '+966', country: '🇸🇦 Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', country: '🇦🇪 UAE', flag: '🇦🇪' },
    { code: '+1', country: '🇺🇸 USA', flag: '🇺🇸' },
    { code: '+44', country: '🇬🇧 UK', flag: '🇬🇧' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!mobile || mobile.length < 10) {
      toast.error('সঠিক মোবাইল নম্বর দিন');
      return;
    }

    setLoading(true);
    
    try {
      const fullMobile = countryCode + mobile;
      
      // Update user profile in backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: currentUser.uid,
          mobile: fullMobile
        })
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      toast.success('✅ প্রোফাইল সম্পন্ন হয়েছে!');
      
      // Redirect to dashboard
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error('❌ সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-4">
            <img 
              src="/logos/logo-full.png" 
              alt="Muslim Finance Tracker" 
              className="h-16 w-auto mb-2"
            />
            <span className="text-sm font-semibold text-green-600">Muslim Finance Tracker</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            প্রোফাইল সম্পন্ন করুন
          </h2>
          <p className="text-sm text-gray-600">
            Premium features এর জন্য মোবাইল নম্বর যোগ করুন
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              দেশ
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.country} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              মোবাইল নম্বর
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPhone className="text-gray-400" size={20} />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1712345678"
                required
                maxLength="15"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              দেশের কোড ছাড়া শুধু নম্বর লিখুন
            </p>
          </div>

          {/* Preview */}
          {mobile && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">সম্পূর্ণ নম্বর:</span> {countryCode}{mobile}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !mobile}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'অপেক্ষা করুন...' : 'সম্পন্ন করুন'}
            {!loading && <MdArrowForward size={20} />}
          </button>

          {/* Skip for now */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
          >
            পরে করবো (Premium features পাবেন না)
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;
