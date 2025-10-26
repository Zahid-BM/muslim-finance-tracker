import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdLogout, MdAccountCircle } from 'react-icons/md';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // শুধু logout করুন, navigate করবেন না
      // ProtectedRoute নিজে থেকে Home এ নিয়ে যাবে
      await logout();
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('❌ লগআউট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🕌</span>
            <span className="text-xl font-bold text-green-600">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-green-600"
                />
              ) : (
                <MdAccountCircle size={40} className="text-green-600" />
              )}
              <span className="font-semibold text-gray-700">
                {currentUser?.displayName || currentUser?.email}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <span>লগআউট হচ্ছে...</span>
              ) : (
                <>
                  <MdLogout size={20} />
                  লগআউট
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            স্বাগতম, {currentUser?.displayName || 'ভাই'}! 🎉
          </h1>
          <p className="text-gray-600 bangla">
            আপনার আর্থিক ব্যবস্থাপনা শুরু করুন
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট আয়</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-green-600">৳ 0</p>
            <p className="text-sm text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট ব্যয়</h3>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-3xl font-bold text-red-600">৳ 0</p>
            <p className="text-sm text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট সম্পদ</h3>
              <span className="text-2xl">🏦</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">৳ 0</p>
            <p className="text-sm text-gray-500 mt-1">বর্তমান</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট ঋণ</h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">৳ 0</p>
            <p className="text-sm text-gray-500 mt-1">বর্তমান</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 bangla">দ্রুত অ্যাক্সেস</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-6 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all text-left">
              <div className="text-3xl mb-2">➕</div>
              <h3 className="font-bold text-lg mb-1">আয় যোগ করুন</h3>
              <p className="text-sm text-gray-600 bangla">নতুন আয়ের তথ্য লিখুন</p>
            </button>

            <button className="p-6 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-all text-left">
              <div className="text-3xl mb-2">➖</div>
              <h3 className="font-bold text-lg mb-1">ব্যয় যোগ করুন</h3>
              <p className="text-sm text-gray-600 bangla">নতুন খরচের তথ্য লিখুন</p>
            </button>

            <button className="p-6 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all text-left">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-lg mb-1">রিপোর্ট দেখুন</h3>
              <p className="text-sm text-gray-600 bangla">PDF রিপোর্ট তৈরি করুন</p>
            </button>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">আরো Features শীঘ্রই আসছে!</h2>
          <p className="bangla opacity-90">
            সম্পূর্ণ ফিচার যুক্ত Dashboard তৈরি হচ্ছে...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
