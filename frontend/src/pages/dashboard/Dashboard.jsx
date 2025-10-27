import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdAccountCircle } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';
import AddIncome from '../../components/transactions/AddIncome';
import AddExpense from '../../components/transactions/AddExpense';
import TransactionList from '../../components/transactions/TransactionList';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
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
  
  const [loanStats, setLoanStats] = useState({
    totalGiven: 0,
    totalTaken: 0
  });
  
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('লগআউট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      setIsLoggingOut(false);
    }
  };

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      const transRes = await axios.get(`${API_URL}/transactions/stats/${currentUser.uid}`);
      if (transRes.data.success) {
        setStats(transRes.data.stats);
      }
      
      const loanRes = await axios.get(`${API_URL}/loans/stats/${currentUser.uid}`);
      if (loanRes.data.success) {
        setLoanStats(loanRes.data.stats);
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
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-70"
            >
              {isLoggingOut ? <span>লগআউট হচ্ছে...</span> : (
                <>
                  <MdLogout size={20} />
                  লগআউট
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            স্বাগতম, {currentUser?.displayName || 'ভাই'}! 🎉
          </h1>
          <p className="text-gray-600 bangla">আপনার আর্থিক ব্যবস্থাপনা শুরু করুন</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">মোট আয়</h3>
              <span className="text-xl">💰</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ৳ {loading ? '...' : stats.monthlyIncome.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">মোট ব্যয়</h3>
              <span className="text-xl">💸</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              ৳ {loading ? '...' : stats.monthlyExpense.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">ব্যালেন্স</h3>
              <span className="text-xl">💵</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ৳ {loading ? '...' : stats.balance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">মোট</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">সঞ্চয়</h3>
              <span className="text-xl">🏦</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ৳ {loading ? '...' : (stats.monthlyIncome - stats.monthlyExpense).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">এই মাসে</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">দেওয়া ঋণ</h3>
              <span className="text-xl">📤</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              ৳ {loading ? '...' : loanStats.totalGiven.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">বাকি</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-pink-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">নেওয়া ঋণ</h3>
              <span className="text-xl">📥</span>
            </div>
            <p className="text-2xl font-bold text-pink-600">
              ৳ {loading ? '...' : loanStats.totalTaken.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">বাকি</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 bangla">দ্রুত অ্যাক্সেস</h2>
          <div className="grid md:grid-cols-4 gap-4">
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

            <button
              onClick={() => navigate('/loans')}
              className="p-6 border-2 border-orange-600 rounded-xl hover:bg-orange-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-bold text-lg mb-1">ঋণ ব্যবস্থাপনা</h3>
              <p className="text-sm text-gray-600 bangla">ঋণ দেওয়া/নেওয়া দেখুন</p>
            </button>

            <button
              onClick={() => navigate('/zakat')}
              className="p-6 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">🕌</div>
              <h3 className="font-bold text-lg mb-1">যাকাত ক্যালকুলেটর</h3>
              <p className="text-sm text-gray-600 bangla">যাকাত হিসাব করুন</p>
            </button>
          </div>
        </div>

        <TransactionList />
      </div>

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
