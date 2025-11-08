import { useState, useEffect } from 'react';
import axios from 'axios';

const EnhancedZakatCalculator = () => {
  const [prices, setPrices] = useState({
    gold22K: 0,
    silver: 0,
    source: 'Loading...'
  });
  
  const [assets, setAssets] = useState({
    cash: '',
    bankBalance: '',
    goldGram: '',
    goldValue: 0,
    silverGram: '',
    silverValue: 0,
    businessInventory: '',
    investments: '',
    properties: '',
    savingsCertificates: '',
    other: ''
  });
  
  const [liabilities, setLiabilities] = useState({
    loans: '',
    unpaidBills: '',
    businessDebts: '',
    other: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch gold/silver prices on mount
  useEffect(() => {
    fetchPrices();
  }, []);
  
  const fetchPrices = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/zakat/prices`);
      
      if (response.data.success) {
        setPrices(response.data.prices);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      // Use fallback
      setPrices({
        gold22K: 9850,
        silver: 1850,
        source: 'Fallback prices'
      });
    }
  };
  
  // Calculate gold/silver values when grams change
  useEffect(() => {
    if (assets.goldGram && prices.gold22K) {
      const bhori = parseFloat(assets.goldGram) / 11.66;
      const value = Math.round(bhori * prices.gold22K);
      setAssets(prev => ({ ...prev, goldValue: value }));
    }
  }, [assets.goldGram, prices.gold22K]);
  
  useEffect(() => {
    if (assets.silverGram && prices.silver) {
      const bhori = parseFloat(assets.silverGram) / 11.66;
      const value = Math.round(bhori * prices.silver);
      setAssets(prev => ({ ...prev, silverValue: value }));
    }
  }, [assets.silverGram, prices.silver]);
  
  const handleCalculate = async () => {
    setLoading(true);
    
    try {
      // Convert strings to numbers
      const numericAssets = {};
      Object.keys(assets).forEach(key => {
        numericAssets[key] = parseFloat(assets[key]) || 0;
      });
      
      const numericLiabilities = {};
      Object.keys(liabilities).forEach(key => {
        numericLiabilities[key] = parseFloat(liabilities[key]) || 0;
      });
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/zakat/calculate`, {
        assets: numericAssets,
        liabilities: numericLiabilities,
        goldPrice: prices.gold22K,
        silverPrice: prices.silver
      });
      
      if (response.data.success) {
        setResult(response.data.result);
      }
      
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD').format(Math.round(amount));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🕌 যাকাত ক্যালকুলেটর
          </h1>
          <p className="text-gray-600">হানাফী মাযহাব অনুযায়ী যাকাত হিসাব করুন</p>
        </div>
        
        {/* Current Prices */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-green-800">বর্তমান বাজার দর</h2>
            <span className="text-xs text-green-600">{prices.source}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">২২ ক্যারেট সোনা (প্রতি ভরি)</p>
              <p className="text-xl font-bold text-green-700">৳ {formatCurrency(prices.gold22K)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">রুপা (প্রতি ভরি)</p>
              <p className="text-xl font-bold text-green-700">৳ {formatCurrency(prices.silver)}</p>
            </div>
          </div>
          <a 
            href="https://www.bajus.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-2 inline-block"
          >
            দাম দেখুন BAJUS ওয়েবসাইটে →
          </a>
        </div>
        
        {/* Assets Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">💰 সম্পদ (Assets)</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                নগদ টাকা (হাতে/ব্যাগে)
              </label>
              <input
                type="number"
                value={assets.cash}
                onChange={(e) => setAssets({...assets, cash: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ব্যাংক ব্যালেন্স
              </label>
              <input
                type="number"
                value={assets.bankBalance}
                onChange={(e) => setAssets({...assets, bankBalance: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সোনা (গ্রাম)
              </label>
              <input
                type="number"
                step="0.01"
                value={assets.goldGram}
                onChange={(e) => setAssets({...assets, goldGram: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০.০০"
              />
              {assets.goldValue > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  মূল্য: ৳ {formatCurrency(assets.goldValue)}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                রুপা (গ্রাম)
              </label>
              <input
                type="number"
                step="0.01"
                value={assets.silverGram}
                onChange={(e) => setAssets({...assets, silverGram: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০.০০"
              />
              {assets.silverValue > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  মূল্য: ৳ {formatCurrency(assets.silverValue)}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ব্যবসায়িক পণ্য
              </label>
              <input
                type="number"
                value={assets.businessInventory}
                onChange={(e) => setAssets({...assets, businessInventory: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                বিনিয়োগ (শেয়ার, ফান্ড)
              </label>
              <input
                type="number"
                value={assets.investments}
                onChange={(e) => setAssets({...assets, investments: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                জমি-সম্পত্তি (বিনিয়োগের জন্য)
              </label>
              <input
                type="number"
                value={assets.properties}
                onChange={(e) => setAssets({...assets, properties: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সঞ্চয়পত্র
              </label>
              <input
                type="number"
                value={assets.savingsCertificates}
                onChange={(e) => setAssets({...assets, savingsCertificates: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                অন্যান্য
              </label>
              <input
                type="number"
                value={assets.other}
                onChange={(e) => setAssets({...assets, other: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
          </div>
        </div>
        
        {/* Liabilities Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">💳 দায় (Liabilities)</h2>
          <p className="text-sm text-gray-600 mb-4">⚠️ শুধু ১ বছরের মধ্যে পরিশোধযোগ্য ঋণ</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ঋণ
              </label>
              <input
                type="number"
                value={liabilities.loans}
                onChange={(e) => setLiabilities({...liabilities, loans: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                বকেয়া বিল
              </label>
              <input
                type="number"
                value={liabilities.unpaidBills}
                onChange={(e) => setLiabilities({...liabilities, unpaidBills: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ব্যবসায়িক দায়
              </label>
              <input
                type="number"
                value={liabilities.businessDebts}
                onChange={(e) => setLiabilities({...liabilities, businessDebts: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                অন্যান্য
              </label>
              <input
                type="number"
                value={liabilities.other}
                onChange={(e) => setLiabilities({...liabilities, other: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="০"
              />
            </div>
          </div>
        </div>
        
        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
        >
          {loading ? 'হিসাব করা হচ্ছে...' : '✅ যাকাত হিসাব করুন'}
        </button>
        
        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📊 ফলাফল</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">মোট সম্পদ:</span>
                <span className="font-semibold">৳ {formatCurrency(result.totalAssets)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">মোট দায়:</span>
                <span className="font-semibold text-red-600">৳ {formatCurrency(result.totalLiabilities)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">যাকাতযোগ্য সম্পদ:</span>
                <span className="font-semibold text-blue-600">৳ {formatCurrency(result.zakatableAmount)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">নিসাব (রুপা):</span>
                <span className="font-semibold">৳ {formatCurrency(result.nisabThreshold)}</span>
              </div>
              
              {result.isObligatory ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mt-4">
                  <p className="text-green-800 font-semibold mb-2">
                    ✅ আপনার উপর যাকাত ফরজ
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    ৳ {formatCurrency(result.zakatDue)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    (যাকাতযোগ্য সম্পদের ২.৫%)
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 font-semibold">
                    ℹ️ আপনার উপর যাকাত ফরজ নয়
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    নিসাব পরিমাণ সম্পদ নেই
                  </p>
                </div>
              )}
            </div>
            
            {/* Masail Note */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>📚 গুরুত্বপূর্ণ মাসআলা:</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>যাকাত বছর পূর্ণ হলে দিতে হয়</li>
                <li>নিসাব: ৫২.৫ ভরি রুপা বা ৭.৫ ভরি সোনা</li>
                <li>শুধু ১ বছরের মধ্যে পরিশোধযোগ্য ঋণ বাদ যায়</li>
                <li>বিস্তারিত জানতে আলেমের পরামর্শ নিন</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                সূত্র: দারুল উলূম দেওবন্দ, মাসিক আল-কাউসার
              </p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default EnhancedZakatCalculator;
