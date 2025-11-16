import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show verification help if coming from registration
  useEffect(() => {
    if (location.state?.showVerificationHelp) {
      if (location.state?.email) {
        setEmail(location.state.email);
      }
      
      // Show helpful message
      setTimeout(() => {
        toast.info('ইমেইল চেক করুন (Inbox অথবা Spam folder)', {
          duration: 8000
        });
      }, 500);
    }
  }, [location]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('  ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      
      // Success - Dashboard এ redirect করুন
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      // Error already handled in AuthContext
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const user = await loginWithGoogle();
      
      // Check if user has mobile number
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/profile/${user.uid}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        // Check if mobile exists
        if (data.user.mobile && data.user.mobile.length > 0) {
          // Has mobile - go to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // No mobile - complete profile first
          navigate('/complete-profile', { 
            replace: true,
            state: { from: '/dashboard' }
          });
        }
      } else {
        // Fallback - go to profile completion
        navigate('/complete-profile', { replace: true });
      }
      
    } catch (error) {
      // Error already handled in AuthContext
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="flex flex-col items-center mb-4">
            <img 
              src="/logos/logo-full.png" 
              alt="Muslim Finance Tracker" 
              className="h-16 w-auto mb-2"
            />
            <span className="text-sm font-semibold text-green-600">Muslim Finance Tracker</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            লগইন করুন
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={24} />
          {loading ? 'অপেক্ষা করুন...' : 'Google দিয়ে লগইন করুন'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">অথবা</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ইমেইল
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="আপনার ইমেইল"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdLock className="text-gray-400" size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="আপনার পাসওয়ার্ড"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          নতুন ব্যবহারকারী?{' '}
          <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
            রেজিস্টার করুন
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
