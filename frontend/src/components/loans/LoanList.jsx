import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdDelete, MdPhone } from 'react-icons/md';

const LoanList = () => {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchLoans = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/api/loans/${currentUser.uid}`);
      
      if (response.data.success) {
        setLoans(response.data.loans);
      }
    } catch (error) {
      console.error('Fetch loans error:', error);
      toast.error('ঋণ লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchLoans();
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি এই ঋণ মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.delete(`${API_URL}/api/loans/${id}`, {
        data: { firebaseUid: currentUser.uid }
      });
      
      toast.success('ঋণ মুছে ফেলা হয়েছে');
      fetchLoans();
    } catch (error) {
      console.error('Delete loan error:', error);
      toast.error('ঋণ মুছতে ব্যর্থ হয়েছে');
    }
  };

  const filteredLoans = loans.filter(l => {
    if (filter === 'all') return true;
    return l.type === filter;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2 animate-pulse">⏳</div>
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ঋণের তালিকা</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            সব
          </button>
          <button
            onClick={() => setFilter('given')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'given' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            দেওয়া
          </button>
          <button
            onClick={() => setFilter('taken')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'taken' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            নেওয়া
          </button>
        </div>
      </div>

      {filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 text-lg">কোনো ঋণ নেই</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLoans.map((loan) => (
            <div
              key={loan._id}
              className={`p-4 rounded-lg border-2 ${
                loan.type === 'given' ? 'border-orange-200 bg-orange-50' : 'border-purple-200 bg-purple-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{loan.type === 'given' ? '📤' : '📥'}</span>
                    <div>
                      <h3 className="font-bold text-lg">{loan.personName}</h3>
                      {loan.description && <p className="text-sm text-gray-600">{loan.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span>তারিখ: {new Date(loan.date).toLocaleDateString('bn-BD')}</span>
                    {loan.dueDate && (
                      <span>শেষ: {new Date(loan.dueDate).toLocaleDateString('bn-BD')}</span>
                    )}
                    {loan.phoneNumber && (
                      <span className="flex items-center gap-1">
                        <MdPhone size={16} />
                        {loan.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      loan.type === 'given' ? 'text-orange-600' : 'text-purple-600'
                    }`}>
                      ৳ {loan.remainingAmount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      loan.status === 'paid' ? 'bg-green-100 text-green-700' :
                      loan.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {loan.status === 'paid' ? 'পরিশোধিত' : loan.status === 'partial' ? 'আংশিক' : 'বাকি'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(loan._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanList;
