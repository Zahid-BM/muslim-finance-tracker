import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdPhone, MdArrowForward } from 'react-icons/md';

const ProfileCompletion = () => {
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const countryCodes = [
    { code: '+880', country: '🇧🇩 Bangladesh', flag: '🇧🇩' },
    { code: '+91', country: '🇮🇳 India', flag: '🇮🇳' },
    { code: '+92', country: '🇵🇰 Pakistan', flag: '🇵🇰' },
    { code: '+966', country: '🇸🇦 Saudi Arabia', flag: '��🇦' },
    { code: '+971', country: '🇦🇪 UAE', flag: '🇦🇪' },
    { code: '+1', country: '🇺🇸 USA', flag: '🇺🇸' },
    { code: '+44', country: '��🇧 UK', flag: '🇬🇧' },
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
          mobile: fullMobile,
          isPhoneVerified: false // Will be verified later with SMS gateway
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ মোবাইল নম্বর সংরক্ষিত হয়েছে!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast('Premium features এর জন্য পরে মোবাইল যোগ করবেন', { icon: 'ℹ️' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdPhone className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            মোবাইল নম্বর যোগ করুন
          </h2>
          <p className="text-gray-600 text-sm">
            Premium features এবং updates পেতে মোবাইল নম্বর দিন
          </p>
          <p className="text-blue-600 text-xs mt-2">
            📱 SMS verification শীঘ্রই আসছে
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Country Code Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              দেশ নির্বাচন করুন
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {countryCodes.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.country} ({item.code})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              মোবাইল নম্বর
            </label>
            <div className="flex gap-2">
              <div className="w-24 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center font-semibold text-gray-700">
                {countryCode}
              </div>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1712345678"
                maxLength="15"
                required
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">সম্পূর্ণ নম্বর:</p>
            <p className="text-lg font-bold text-green-700">
              {countryCode}{mobile || 'XXXXXXXXXX'}
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 আপাতত শুধু মোবাইল নম্বর সংরক্ষণ হবে। SMS verification শীঘ্রই যোগ করা হবে।
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !mobile || mobile.length < 10}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'সংরক্ষণ হচ্ছে...'
            ) : (
              <>
                সংরক্ষণ করুন
                <MdArrowForward />
              </>
            )}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium"
          >
            পরে করবো (Premium features পাবেন না)
          </button>

        </form>

      </div>
    </div>
  );
};

export default ProfileCompletion;
