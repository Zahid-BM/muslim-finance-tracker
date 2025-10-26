import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

const AddLoan = ({ onClose, onSuccess, loanType }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    phoneNumber: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.personName || !formData.amount) {
      toast.error('নাম এবং পরিমাণ আবশ্যক');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      await axios.post(`${API_URL}/loans`, {
        type: loanType,
        personName: formData.personName,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        dueDate: formData.dueDate || null,
        phoneNumber: formData.phoneNumber,
        notes: formData.notes,
        firebaseUid: currentUser.uid
      });

      toast.success(loanType === 'given' ? 'দেওয়া ঋণ যোগ করা হয়েছে' : 'নেওয়া ঋণ যোগ করা হয়েছে');
      
      setFormData({
        personName: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        phoneNumber: '',
        notes: ''
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (error) {
      console.error('Add loan error:', error);
      toast.error(error.response?.data?.message || 'ঋণ যোগ করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className={`text-2xl font-bold ${loanType === 'given' ? 'text-orange-600' : 'text-purple-600'}`}>
            {loanType === 'given' ? '📤 দেওয়া ঋণ' : '📥 নেওয়া ঋণ'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ব্যক্তির নাম *
            </label>
            <input
              type="text"
              name="personName"
              value={formData.personName}
              onChange={handleChange}
              required
              placeholder="যেমন: আবদুল করিম"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">পরিমাণ (৳) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">বিবরণ</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="ঋণের কারণ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">শেষ তারিখ</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ফোন নম্বর</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">নোট</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="অতিরিক্ত তথ্য..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-all disabled:opacity-50 ${
                loanType === 'given' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoan;
