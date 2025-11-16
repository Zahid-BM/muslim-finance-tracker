import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdDownload, MdPictureAsPdf, MdLanguage } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generateFinancialReport } from '../../utils/pdfGeneratorMultilingual';

const Reports = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('bn');

  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  const fetchAllData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Fetch Transaction Stats
      const statsRes = await axios.get(`${API_URL}/api/transactions/stats/${currentUser.uid}`);
      setStats(statsRes.data.stats);
      
      // Fetch Transactions
      const transRes = await axios.get(`${API_URL}/api/transactions/${currentUser.uid}`);
      setTransactions(transRes.data.transactions);
      
      // Fetch Loans
      const loansRes = await axios.get(`${API_URL}/api/loans/${currentUser.uid}`);
      setLoans(loansRes.data.loans);
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error('ডাটা লোড করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const userData = {
        name: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        profilePicture: currentUser.photoURL
      };

      const doc = await generateFinancialReport(userData, transactions, loans, stats, selectedLanguage);
      
      const fileName = `Finance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('রিপোর্ট ডাউনলোড হয়েছে');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('রিপোর্ট তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logos/logo-full.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-green-600">Muslim Finance Tracker</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-green-600">রিপোর্ট ও বিশ্লেষণ</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Summary Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <h3 className="text-gray-600 font-semibold mb-2">মোট আয়</h3>
              <p className="text-3xl font-bold text-green-600">
                ৳ {stats.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
              <h3 className="text-gray-600 font-semibold mb-2">মোট ব্যয়</h3>
              <p className="text-3xl font-bold text-red-600">
                ৳ {stats.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-gray-600 font-semibold mb-2">ব্যালেন্স</h3>
              <p className="text-3xl font-bold text-blue-600">
                ৳ {stats.balance.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Language Selector + Download Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <MdPictureAsPdf size={32} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">PDF রিপোর্ট</h2>
              <p className="text-gray-600">সম্পূর্ণ আর্থিক রিপোর্ট ডাউনলোড করুন</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MdLanguage size={20} className="text-green-600" />
              <label className="font-semibold text-gray-700">ভাষা নির্বাচন করুন:</label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-sm font-semibold">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-3">রিপোর্টে যা থাকবে:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                আর্থিক সারসংক্ষেপ
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                লেনদেনের বিস্তারিত
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                ঋণের তালিকা
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                QR কোড (ওয়েবসাইট লিংক)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                তারিখ ও সময়সহ
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <MdDownload size={24} />
            {loading ? 'তৈরি হচ্ছে...' : 'PDF ডাউনলোড করুন'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            রিপোর্টে আপনার সর্বশেষ {transactions.length}টি লেনদেন অন্তর্ভুক্ত থাকবে
          </p>
        </div>

        {/* Quick Stats Preview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold mb-4">দ্রুত পরিসংখ্যান</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">মোট লেনদেন:</span>
              <span className="font-bold">{transactions.length}টি</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">মোট ঋণ:</span>
              <span className="font-bold">{loans.length}টি</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">এই মাসের আয়:</span>
              <span className="font-bold text-green-600">
                ৳ {stats?.monthlyIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">এই মাসের ব্যয়:</span>
              <span className="font-bold text-red-600">
                ৳ {stats?.monthlyExpense.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
