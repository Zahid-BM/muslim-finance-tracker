import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCalculate } from 'react-icons/md';
import toast from 'react-hot-toast';

const ZakatCalculator = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState({
    cash: '',
    bankBalance: '',
    gold: '',
    silver: '',
    business: '',
    investments: '',
    loanGiven: '',
    other: ''
  });
  
  const [liabilities, setLiabilities] = useState({
    loanTaken: '',
    debts: ''
  });

  const [zakatAmount, setZakatAmount] = useState(0);
  const [nisabValue] = useState(87.48 * 130000); // 87.48 gram gold * current rate

  const handleAssetChange = (e) => {
    setAssets({
      ...assets,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleLiabilityChange = (e) => {
    setLiabilities({
      ...liabilities,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const calculateZakat = () => {
    const totalAssets = Object.values(assets).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    const netAssets = totalAssets - totalLiabilities;

    if (netAssets < nisabValue) {
      toast.error('আপনার সম্পদ নিসাব সীমার নিচে। যাকাত ফরজ নয়।');
      setZakatAmount(0);
      return;
    }

    const zakat = netAssets * 0.025; // 2.5%
    setZakatAmount(zakat);
    toast.success('যাকাত হিসাব সম্পন্ন হয়েছে');
  };

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
          <h1 className="text-2xl font-bold text-green-600">যাকাত ক্যালকুলেটর</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Nisab Info */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 bangla">নিসাব সীমা</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-90">স্বর্ণের মূল্য (৮৭.৪৮ গ্রাম)</p>
              <p className="text-3xl font-bold">৳ {nisabValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">যাকাতের হার</p>
              <p className="text-3xl font-bold">২.৫%</p>
            </div>
          </div>
          <p className="text-sm mt-4 opacity-90 bangla">
            আপনার সম্পদ নিসাব সীমার উপরে হলে যাকাত ফরজ
          </p>
        </div>

        {/* Assets Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-green-600 bangla">সম্পদের হিসাব</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                নগদ টাকা (৳)
              </label>
              <input
                type="number"
                name="cash"
                value={assets.cash}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ব্যাংক ব্যালেন্স (৳)
              </label>
              <input
                type="number"
                name="bankBalance"
                value={assets.bankBalance}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                স্বর্ণের মূল্য (৳)
              </label>
              <input
                type="number"
                name="gold"
                value={assets.gold}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                রূপার মূল্য (৳)
              </label>
              <input
                type="number"
                name="silver"
                value={assets.silver}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ব্যবসায়িক পুঁজি (৳)
              </label>
              <input
                type="number"
                name="business"
                value={assets.business}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিনিয়োগ (৳)
              </label>
              <input
                type="number"
                name="investments"
                value={assets.investments}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                দেওয়া ঋণ (৳)
              </label>
              <input
                type="number"
                name="loanGiven"
                value={assets.loanGiven}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অন্যান্য সম্পদ (৳)
              </label>
              <input
                type="number"
                name="other"
                value={assets.other}
                onChange={handleAssetChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-red-600 bangla">দায়-দেনা</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                নেওয়া ঋণ (৳)
              </label>
              <input
                type="number"
                name="loanTaken"
                value={liabilities.loanTaken}
                onChange={handleLiabilityChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অন্যান্য ঋণ (৳)
              </label>
              <input
                type="number"
                name="debts"
                value={liabilities.debts}
                onChange={handleLiabilityChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateZakat}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <MdCalculate size={24} />
          যাকাত হিসাব করুন
        </button>

        {/* Result */}
        {zakatAmount > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
            <div className="text-5xl mb-4">🕌</div>
            <h3 className="text-xl mb-2 bangla">আপনার যাকাতের পরিমাণ</h3>
            <p className="text-5xl font-bold mb-4">৳ {zakatAmount.toLocaleString()}</p>
            <p className="text-sm opacity-90 bangla">
              এই পরিমাণ টাকা দরিদ্র ও অভাবগ্রস্তদের মধ্যে বিতরণ করুন
            </p>
          </div>
        )}

        {/* Islamic Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold mb-4 text-green-600 bangla">যাকাত সম্পর্কে গুরুত্বপূর্ণ তথ্য</h3>
          <ul className="space-y-3 text-gray-700 bangla">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>যাকাত ইসলামের পাঁচটি স্তম্ভের একটি এবং প্রত্যেক সামর্থ্যবান মুসলিমের উপর ফরজ।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>নিসাব পরিমাণ সম্পদের উপর পূর্ণ এক বছর অতিক্রান্ত হলে যাকাত দিতে হয়।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>যাকাত আদায়ে বিলম্ব করা গুনাহের কাজ।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>যাকাত শুধুমাত্র নির্দিষ্ট ৮ শ্রেণীর লোকদের মধ্যে বিতরণ করতে হয়।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>ব্যক্তিগত ব্যবহারের জিনিস (বাড়ি, গাড়ি, পোশাক) এর উপর যাকাত নেই।</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
