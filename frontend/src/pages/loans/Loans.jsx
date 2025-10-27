import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import axios from 'axios';
import AddLoan from '../../components/loans/AddLoan';
import LoanList from '../../components/loans/LoanList';

const Loans = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showGivenModal, setShowGivenModal] = useState(false);
  const [showTakenModal, setShowTakenModal] = useState(false);
  const [stats, setStats] = useState({
    totalGiven: 0,
    totalTaken: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshList, setRefreshList] = useState(0);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/loans/stats/${currentUser.uid}`);
      
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
  }, [currentUser, refreshList]);

  const handleLoanSuccess = () => {
    fetchStats();
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-green-600">ঋণ ব্যবস্থাপনা</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট দেওয়া ঋণ</h3>
              <span className="text-3xl">📤</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              ৳ {loading ? '...' : stats.totalGiven.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-600 font-semibold">মোট নেওয়া ঋণ</h3>
              <span className="text-3xl">📥</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              ৳ {loading ? '...' : stats.totalTaken.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 bangla">নতুন ঋণ যোগ করুন</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowGivenModal(true)}
              className="p-6 border-2 border-orange-600 rounded-xl hover:bg-orange-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">📤</div>
              <h3 className="font-bold text-lg mb-1">দেওয়া ঋণ</h3>
              <p className="text-sm text-gray-600 bangla">আপনি অন্যকে ঋণ দিয়েছেন</p>
            </button>

            <button
              onClick={() => setShowTakenModal(true)}
              className="p-6 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">📥</div>
              <h3 className="font-bold text-lg mb-1">নেওয়া ঋণ</h3>
              <p className="text-sm text-gray-600 bangla">আপনি অন্যের কাছ থেকে ঋণ নিয়েছেন</p>
            </button>
          </div>
        </div>

        <LoanList key={refreshList} />
      </div>

      {showGivenModal && (
        <AddLoan
          onClose={() => setShowGivenModal(false)}
          onSuccess={handleLoanSuccess}
          loanType="given"
        />
      )}

      {showTakenModal && (
        <AddLoan
          onClose={() => setShowTakenModal(false)}
          onSuccess={handleLoanSuccess}
          loanType="taken"
        />
      )}
    </div>
  );
};

export default Loans;
