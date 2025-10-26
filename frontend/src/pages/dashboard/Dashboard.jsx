import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdLogout, MdAccountCircle } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';
import AddIncome from '../../components/transactions/AddIncome';
import AddExpense from '../../components/transactions/AddExpense';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('❌ লগআউট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      setIsLoggingOut(false);
    }
  };

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/transactions/stats/${currentUser.uid}`);
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);

  const handleTransactionSuccess = () => {
    fetchStats(); // Refresh stats
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
            <p className="text-3xl font-bold text-green-600">
              ৳ {loading ? '...' : stats.monthlyIncome.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট ব্যয়</h3>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-3xl font-bold text-red-600">
              ৳ {loading ? '...' : stats.monthlyExpense.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">ব্যালেন্স</h3>
              <span className="text-2xl">💵</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ৳ {loading ? '...' : stats.balance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">মোট</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">সঞ্চয়</h3>
              <span className="text-2xl">🏦</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              ৳ {loading ? '...' : (stats.monthlyIncome - stats.monthlyExpense).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">এই মাসে</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 bangla">দ্রুত অ্যাক্সেস</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowIncomeModal(true)}
              className="p-6 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <h3 className="font-bold text-lg mb-1">আয় যোগ করুন</h3>
              <p className="text-sm text-gray-600 bangla">নতুন আয়ের তথ্য লিখুন</p>
            </button>

            <button 
              onClick={() => setShowExpenseModal(true)}
              className="p-6 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-all text-left"
            >
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
      </div>

      {/* Modals */}
      {showIncomeModal && (
        <AddIncome 
          onClose={() => setShowIncomeModal(false)} 
          onSuccess={handleTransactionSuccess}
        />
      )}
      
      {showExpenseModal && (
        <AddExpense 
          onClose={() => setShowExpenseModal(false)} 
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
