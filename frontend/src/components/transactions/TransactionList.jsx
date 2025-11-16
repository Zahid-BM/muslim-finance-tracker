import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdDelete, MdFilterList } from 'react-icons/md';

const TransactionList = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTransactions = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/api/transactions/${currentUser.uid}`);
      
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Fetch transactions error:', error);
      toast.error('লেনদেন লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি এই লেনদেন মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.delete(`${API_URL}/api/transactions/${id}`, {
        data: { firebaseUid: currentUser.uid }
      });

      toast.success('লেনদেন মুছে ফেলা হয়েছে');
      fetchTransactions(); // Refresh list
    } catch (error) {
      console.error('Delete transaction error:', error);
      toast.error('লেনদেন মুছতে ব্যর্থ হয়েছে');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">লেনদেনের তালিকা</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            সব
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            আয়
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ব্যয়
          </button>
        </div>
      </div>

      {/* Transactions */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 text-lg">কোনো লেনদেন নেই</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                transaction.type === 'income'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{transaction.category}</h3>
                    {transaction.description && (
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.date).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ৳ {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
                </div>

                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                  title="মুছে ফেলুন"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
