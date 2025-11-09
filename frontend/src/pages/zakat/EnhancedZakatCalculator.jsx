import { useState, useEffect } from 'react';
import axios from 'axios';

const EnhancedZakatCalculator = () => {
  const [prices, setPrices] = useState({
    goldSellingPerGram: 0,
    silverSellingPerGram: 0,
    source: 'Loading...'
  });
  
  const [todayNisab, setTodayNisab] = useState(0);
  const [nisabDetails, setNisabDetails] = useState('');
  
  const [assets, setAssets] = useState({
    cash: '',
    bankBalance: '',
    goldValue: '',
    silverValue: '',
    businessInventory: '',
    investments: ''
  });
  
  const [liabilities, setLiabilities] = useState({
    necessaryLoans: '',
    unpaidBills: '',
    other: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [masailModal, setMasailModal] = useState({ show: false, topic: '' });
  const [userCountry, setUserCountry] = useState('BD');

  useEffect(() => {
    fetchPrices();
    detectUserCountry();
  }, []);
  
  useEffect(() => {
    if (prices.silverSellingPerGram > 0) {
      const VORI_TO_GRAM = 11.66;
      const NISAB_SILVER_VORI = 52.5;
      const nisab = prices.silverSellingPerGram * VORI_TO_GRAM * NISAB_SILVER_VORI;
      setTodayNisab(Math.round(nisab));
      
      // Set details based on country
      if (['BD', 'IN', 'PK'].includes(userCountry)) {
        setNisabDetails(`(৫২.৫ ভরি রুপা × ১১.৬৬ গ্রাম/ভরি)`);
      } else if (userCountry === 'SA') {
        setNisabDetails(`(৬১২.৩৬ গ্রাম রুপা)`);
      } else {
        setNisabDetails(`(612.36 grams silver)`);
      }
    }
  }, [prices.silverSellingPerGram, userCountry]);
  
  const detectUserCountry = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Dhaka')) setUserCountry('BD');
    else if (timezone.includes('Kolkata')) setUserCountry('IN');
    else if (timezone.includes('Karachi')) setUserCountry('PK');
    else if (timezone.includes('Riyadh')) setUserCountry('SA');
    else setUserCountry('INTL');
  };
  
  const goldAssociations = {
    BD: { name: 'BAJUS', url: 'https://www.bajus.org/gold-price', unit: 'ভরি' },
    IN: { name: 'India Bullion', url: 'https://www.ibja.co', unit: 'তোলা' },
    PK: { name: 'Karachi Saraffa', url: 'https://www.karachisaraffa.com', unit: 'তোলা' },
    SA: { name: 'Saudi Gold', url: 'https://gold.sa', unit: 'গ্রাম' },
    INTL: { name: 'Kitco', url: 'https://www.kitco.com', unit: 'gram' }
  };
  
  const getNisabText = () => {
    const nisabs = {
      BD: { gold: '৭.৫ ভরি (১১.৬৬ গ্রাম = ১ ভরি)', silver: '৫২.৫ ভরি (১১.৬৬ গ্রাম = ১ ভরি)' },
      IN: { gold: '৭.৫ তোলা (১১.৬৬ গ্রাম = ১ তোলা)', silver: '৫২.৫ তোলা (১১.৬৬ গ্রাম = ১ তোলা)' },
      PK: { gold: '৭.৫ তোলা (১১.৬৬ গ্রাম = ১ তোলা)', silver: '৫২.৫ তোলা (১১.৬৬ গ্রাম = ১ তোলা)' },
      SA: { gold: '৮৭.৪৮ গ্রাম', silver: '৬১২.৩৬ গ্রাম' },
      INTL: { gold: '87.48g (3oz)', silver: '612.36g (21.5oz)' }
    };
    return nisabs[userCountry] || nisabs.INTL;
  };
  
  const fetchPrices = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/zakat/prices`);
      
      if (response.data.success) {
        setPrices(response.data.prices);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      // BAJUS Nov 8, 2024 data
      setPrices({
        goldSellingPerGram: 9409,  // 11761 * 0.8
        silverSellingPerGram: 178,  // 223 * 0.8
        source: 'Approximate (Nov 8, 2024)'
      });
    }
  };
  

  
  const handleCalculate = async () => {
    setLoading(true);
    
    try {
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
        goldSellingPrice: prices.goldSellingPerGram,
        silverSellingPrice: prices.silverSellingPerGram
      });
      
      if (response.data.success) {
        setResult(response.data.result);
      }
      
    } catch (error) {
      console.error('Calculation error:', error);
      alert('হিসাব করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };
  
  const openMasail = (topic) => {
    setMasailModal({ show: true, topic });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const MasailContent = ({ topic }) => {
    const masails = {
      fourAssets: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg text-green-800">⚠️ যাকাতযোগ্য সম্পদ</h4>
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <p className="font-bold mb-2">যাকাত শুধু ৪ ধরনের সম্পদে ফরজ:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li className="font-semibold">সোনা</li>
              <li className="font-semibold">রুপা</li>
              <li className="font-semibold">নগদ অর্থ</li>
              <li className="font-semibold">ব্যবসায়িক মালামাল</li>
            </ol>
          </div>
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <p className="text-sm font-semibold text-red-800">❌ যাকাত ফরজ নয়:</p>
            <p className="text-xs text-gray-700">বাড়ি, গাড়ি, ফার্নিচার, ব্যক্তিগত ব্যবহারের জিনিসপত্র</p>
          </div>
          <p className="text-xs text-gray-600">সূত্র: ফাতাওয়া হিন্দিয়া, দারুল উলূম দেওবন্দ</p>
        </div>
      ),
      
      combinedNisab: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg text-blue-800">💡 সম্মিলিত নিসাব</h4>
          <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
            <p className="font-semibold mb-2">আলাদাভাবে কোনো সম্পদ নিসাব না হলেও...</p>
            <p className="text-sm mb-3">সম্মিলিত মূল্য নিসাব হলে যাকাত ফরজ হয়ে যায়!</p>
            
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-sm mb-2">উদাহরণ:</p>
              <ul className="text-xs space-y-1">
                <li>• সোনা: ৩ ভরি (নিসাব নয় ❌)</li>
                <li>• রুপা: ২০ ভরি (নিসাব নয় ❌)</li>
                <li>• নগদ: ৳৫০,০০০</li>
                <li className="font-bold text-green-700">→ মোট মূল্য নিসাব হলে যাকাত ফরজ ✅</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-600">সূত্র: মুফতি তাকী উসমানী, মাসিক আল-কাউসার</p>
        </div>
      ),
      
      gold: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg">সোনার যাকাত</h4>
          <div className="space-y-2 text-sm">
            <p><strong>নিসাব:</strong> {getNisabText().gold}</p>
            <p><strong>হিসাব:</strong> বিক্রয় মূল্য ধরতে হবে</p>
            <p><strong>বিক্রয় মূল্য বের করতে:</strong> বাজার দাম থেকে মেকিং চার্জ এবং অন্যান্য কারণে ১৫-২০% বাদ দিতে হবে</p>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ আপনার দেশের স্বর্ণ ব্যবসায়ীদের কাছ থেকে সঠিক বিক্রয় মূল্য জেনে নিন
            </p>
          </div>
        </div>
      ),
      
      goldCalculation: (
        <div className="space-y-4">
          <h4 className="font-bold text-xl text-yellow-800">🪙 সোনার বিক্রয় মূল্য কীভাবে হিসাব করবেন?</h4>
          
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <p className="font-bold mb-3">ধাপ ১: প্রতিটি ধরনের সোনা আলাদা হিসাব করুন</p>
            
            <div className="space-y-3 ml-4">
              <div className="bg-white rounded p-3">
                <p className="font-semibold text-sm mb-2">• 22 ক্যারেট সোনা:</p>
                <p className="text-xs text-gray-700">___ গ্রাম × ৳___ (প্রতি গ্রাম বিক্রয় মূল্য) = ৳___</p>
              </div>
              
              <div className="bg-white rounded p-3">
                <p className="font-semibold text-sm mb-2">• 18 ক্যারেট সোনা:</p>
                <p className="text-xs text-gray-700">___ গ্রাম × ৳___ (প্রতি গ্রাম বিক্রয় মূল্য) = ৳___</p>
              </div>
              
              <div className="bg-white rounded p-3">
                <p className="font-semibold text-sm mb-2">• সনাতন সোনা:</p>
                <p className="text-xs text-gray-700">___ গ্রাম × ৳___ (প্রতি গ্রাম বিক্রয় মূল্য) = ৳___</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <p className="font-bold mb-2">ধাপ ২: সব যোগ করুন</p>
            <p className="text-sm text-gray-700">মোট বিক্রয় মূল্য = ___ + ___ + ___ = <strong>৳___</strong></p>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
            <p className="font-bold mb-2">ধাপ ৩: এই মোট মূল্যটি ইনপুট দিন</p>
            <p className="text-xs text-gray-700">উপরের ফিল্ডে এই মোট বিক্রয় মূল্য লিখুন</p>
          </div>
          
          <div className="bg-amber-50 border border-amber-400 rounded p-3">
            <p className="text-xs font-semibold text-amber-900 mb-1">💡 বিক্রয় মূল্য কীভাবে জানবেন?</p>
            <p className="text-xs text-gray-700">
              বাজার দাম থেকে মেকিং চার্জ বাদ দিন (১৫-২০%)।<br/>
              অথবা স্বর্ণ ব্যবসায়ীকে জিজ্ঞাসা করুন আজকে বিক্রি করলে কত পাবেন।
            </p>
          </div>
        </div>
      ),
      
      silverCalculation: (
        <div className="space-y-4">
          <h4 className="font-bold text-xl text-gray-800">⚪ রুপার বিক্রয় মূল্য কীভাবে হিসাব করবেন?</h4>
          
          <div className="bg-gray-50 border-2 border-gray-400 rounded-lg p-4">
            <p className="font-bold mb-3">ধাপ ১: প্রতিটি ধরনের রুপা আলাদা হিসাব করুন</p>
            
            <div className="space-y-3 ml-4">
              <div className="bg-white rounded p-3">
                <p className="font-semibold text-sm mb-2">• খাঁটি রুপা:</p>
                <p className="text-xs text-gray-700">___ গ্রাম × ৳___ (প্রতি গ্রাম বিক্রয় মূল্য) = ৳___</p>
              </div>
              
              <div className="bg-white rounded p-3">
                <p className="font-semibold text-sm mb-2">• সনাতন রুপা:</p>
                <p className="text-xs text-gray-700">___ গ্রাম × ৳___ (প্রতি গ্রাম বিক্রয় মূল্য) = ৳___</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <p className="font-bold mb-2">ধাপ ২: সব যোগ করুন</p>
            <p className="text-sm text-gray-700">মোট বিক্রয় মূল্য = ___ + ___ = <strong>৳___</strong></p>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
            <p className="font-bold mb-2">ধাপ ৩: এই মোট মূল্যটি ইনপুট দিন</p>
            <p className="text-xs text-gray-700">উপরের ফিল্ডে এই মোট বিক্রয় মূল্য লিখুন</p>
          </div>
          
          <div className="bg-amber-50 border border-amber-400 rounded p-3">
            <p className="text-xs font-semibold text-amber-900 mb-1">💡 বিক্রয় মূল্য কীভাবে জানবেন?</p>
            <p className="text-xs text-gray-700">
              বাজার দাম থেকে মেকিং চার্জ বাদ দিন।<br/>
              অথবা স্বর্ণ ব্যবসায়ীকে জিজ্ঞাসা করুন আজকে বিক্রি করলে কত পাবেন।
            </p>
          </div>
        </div>
      ),
      
      silver: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg">রুপার যাকাত</h4>
          <div className="space-y-2 text-sm">
            <p><strong>নিসাব:</strong> {getNisabText().silver}</p>
            <p><strong>হিসাব:</strong> বিক্রয় মূল্য ধরতে হবে</p>
            <p><strong>বিক্রয় মূল্য বের করতে:</strong> বাজার দাম থেকে মেকিং চার্জ বাদ দিতে হবে</p>
            <p className="text-blue-700 font-semibold">�� সাধারণ মানুষের জন্য রুপার নিসাব প্রযোজ্য (সহজ)</p>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ আপনার দেশের স্বর্ণ ব্যবসায়ীদের কাছ থেকে সঠিক বিক্রয় মূল্য জেনে নিন
            </p>
          </div>
        </div>
      ),
      
      cash: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg">নগদ অর্থের যাকাত</h4>
          <div className="space-y-2 text-sm">
            <p><strong>হস্তগত টাকা:</strong> যা আপনার সম্পূর্ণ নিয়ন্ত্রণে</p>
            <p><strong>উত্তোলনযোগ্য:</strong> যেকোনো সময় ব্যবহার করতে পারেন</p>
            <p className="text-red-600">❌ Fixed Deposit (মেয়াদী) যা উত্তোলন করা যায় না = ধর্তব্য নয়</p>
          </div>
        </div>
      ),      
      bank: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg">ব্যাংক ব্যালেন্সের যাকাত</h4>
          <div className="bg-green-50 border border-green-300 rounded p-3 mb-2">
            <p className="font-semibold text-sm mb-2 text-green-800">✅ যাকাতযোগ্য ব্যাংক ব্যালেন্স:</p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• Savings Account (সঞ্চয় হিসাব)</li>
              <li>• Current Account (চলতি হিসাব)</li>
              <li>• যেকোনো সময় উত্তোলনযোগ্য টাকা</li>
              <li>• কোনো lock-in period নেই</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <p className="font-semibold text-sm mb-2 text-red-800">❌ যাকাতযোগ্য নয়:</p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• Fixed Deposit (মেয়াদী আমানত - locked)</li>
              <li>• DPS যা মেয়াদ শেষ হয়নি</li>
              <li>• Notice period সহ account</li>
              <li>• উত্তোলন করলে জরিমানা হয় এমন</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            মূলনীতি: freely accessible = zakatable, locked = not zakatable
          </p>
        </div>
      ),
      
      business: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg">ব্যবসায়িক পণ্যের যাকাত</h4>
          <div className="bg-green-50 border border-green-300 rounded p-3 mb-2">
            <p className="font-semibold text-sm mb-2">✅ যাকাতযোগ্য:</p>
            <ul className="text-xs space-y-1">
              <li>• পুনঃবিক্রয়ের উদ্দেশ্যে ক্রয়কৃত পণ্য</li>
              <li>• দোকানের মালামাল</li>
              <li>• তৈরিকৃত পণ্য (Finished goods)</li>
              <li>• উৎপাদনে সরাসরি ব্যবহৃত যন্ত্রপাতি<br/>
                  <span className="text-gray-600">(উদাহরণ: ডায়াগনস্টিক সেন্টারের CBC Analyzer, X-ray Machine)</span>
              </li>
              <li>• বিক্রয়ের উদ্দেশ্যে ক্রয়কৃত জমি<br/>
                  <span className="text-gray-600">(উদাহরণ: ১০ লক্ষ টাকায় জমি কিনে বিক্রয়ের জন্য রেখেছেন)</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <p className="font-semibold text-sm mb-2">❌ যাকাতযোগ্য নয়:</p>
            <ul className="text-xs space-y-1">
              <li>• পরোক্ষ সহায়ক সামগ্রী: গাড়ি, AC, ফ্রিজ, অফিস ফার্নিচার</li>
              <li>• কাঁচামাল (Raw materials - তৈরি না হলে)</li>
              <li>• ব্যক্তিগত ব্যবহারের জিনিসপত্র</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            মূলনীতি: উৎপাদনে সরাসরি ব্যবহৃত = যাকাতযোগ্য, পরোক্ষ সহায়ক = নয়
          </p>
          <p className="text-xs text-gray-600">সূত্র: ফাতাওয়া হিন্দিয়া, মুফতি তাকী উসমানী</p>
        </div>
      ),
      
      loans: (
        <div className="space-y-3">
          <h4 className="font-bold text-lg">ঋণ বাদ দেওয়া</h4>
          <div className="bg-green-50 border-2 border-green-500 rounded p-3 mb-2">
            <p className="font-semibold text-sm mb-2">✅ বাদ যাবে (প্রয়োজনীয় ঋণ):</p>
            <ul className="text-xs space-y-1">
              <li>• খাদ্য, বাসস্থান, চিকিৎসার জন্য</li>
              <li>• মৌলিক জীবনযাত্রার জন্য</li>
              <li>• বকেয়া বিল (১ বছরের মধ্যে পরিশোধযোগ্য)</li>
            </ul>
          </div>
          <div className="bg-red-50 border-2 border-red-500 rounded p-3">
            <p className="font-semibold text-sm mb-2">❌ বাদ যাবে না (উন্নয়নমূলক ঋণ):</p>
            <ul className="text-xs space-y-1">
              <li>• ব্যবসা সম্প্রসারণের জন্য</li>
              <li>• দ্বিতীয় বাড়ি/গাড়ি কেনার জন্য</li>
              <li>• বিলাসিতার জন্য</li>
              <li>• দীর্ঘমেয়াদী ঋণ (১ বছরের বেশি)</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600">
            সূত্র: আল-হিদায়া, মুফতি তাকী উসমানী, ফাতাওয়া হিন্দিয়া
          </p>
        </div>
      )
    };
    
    return (
      <div>
        {masails[topic]}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-semibold mb-2">📞 আরও জানতে:</p>
          <div className="space-y-2 text-xs">
            <p>• আপনার এলাকার আলেমদের সাথে যোগাযোগ করুন</p>
            <p>• Muslim Finance Tracker Support</p>
            <p className="text-blue-600">support@muslimfinancetracker.com</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-extrabold mb-2">
            🕌 যাকাত ক্যালকুলেটর
          </h1>
          <p className="text-green-100 text-lg">হানাফী মাযহাব অনুযায়ী</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">দারুল উলূম দেওবন্দ</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">মাসিক আল-কাউসার</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">মুফতি তাকী উসমানী</span>
          </div>
        </div>
        
        {/* Today's Minimum Nisab - BIG DISPLAY */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold mb-3">
              🎯 আজকের যাকাতের সর্বনিম্ন নিসাব
            </p>
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-6xl md:text-7xl font-black mb-2">
                ৳{formatCurrency(todayNisab)}
              </p>
              <p className="text-lg opacity-90 mt-2">
                {nisabDetails}
              </p>
              <p className="text-base opacity-80 mt-1">
                (সনাতন রুপা ভিত্তিক)
              </p>
            </div>
            <p className="text-sm mt-4 opacity-90">
              {userCountry === 'BD' ? 'বাংলাদেশ' : 
               userCountry === 'IN' ? 'ভারত' :
               userCountry === 'PK' ? 'পাকিস্তান' : 
               'আন্তর্জাতিক'} - 
              আজকের তারিখ: {new Date().toLocaleDateString('bn-BD')}
            </p>
          </div>
        </div>
        
        {/* Important Instructions */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-4 border-yellow-400 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-4xl">⚠️</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                অনুগ্রহ করে লক্ষ্য করুন:
              </h2>
              <div className="space-y-3 text-sm md:text-base text-gray-800">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-green-700 min-w-[24px]">১.</span>
                  <span>উপরে আজকের <strong>সর্বনিম্ন নিসাব</strong> দেখানো হয়েছে (সনাতন রুপা ভিত্তিক, সবচেয়ে কম দামি রুপা)</span>
                </div>
                
                <p className="flex items-start gap-2">
                  <span className="font-bold text-green-700 min-w-[24px]">২.</span>
                  <span>আপনার দেশের স্বর্ণ সংস্থার website থেকে <strong>আজকের সনাতন/Traditional</strong> সোনা-রুপার দাম জেনে নিন</span>
                </p>
                
                <div className="flex items-start gap-2">
                  <span className="font-bold text-green-700 min-w-[24px]">৩.</span>
                  <span><strong>বিক্রয় মূল্য বের করুন:</strong>
                    <ul className="ml-4 mt-1 space-y-1 list-disc">
                      <li>বাজার দাম থেকে মেকিং চার্জ এবং অন্যান্য কারণে বাদ দিন (সাধারণত ১৫-২০%)</li>
                      <li>আপনার দেশের স্বর্ণ ব্যবসায়ীর কাছ থেকে <strong>সঠিক বিক্রয় মূল্য</strong> জেনে নিন</li>
                    </ul>
                  </span>
                </div>
                
                <p className="flex items-start gap-2">
                  <span className="font-bold text-green-700 min-w-[24px]">৪.</span>
                  <span>সেই মূল্য দিয়ে নিচে হিসাব করুন</span>
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="font-bold text-green-700 min-w-[24px]">৫.</span>
                  <span>যদি <strong>সম্মিলিত সম্পদ</strong> (সোনা + রুপা + নগদ + ব্যবসা) উপরের নিসাব পরিমাণ হয়, তাহলে যাকাত ফরজ</span>
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="font-bold text-green-700 min-w-[24px]">৬.</span>
                  <span className="text-xs text-gray-600 italic">উপরের মূল্য আনুমানিক (Nov 8, 2024 অনুযায়ী) - সঠিক দাম জেনে হিসাব করুন</span>
                </p>
              </div>
              
              <a 
                href={goldAssociations[userCountry].url}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-bold text-sm transition mt-4 shadow-md"
              >
                🔗 {goldAssociations[userCountry].name} Website দেখুন →
              </a>
            </div>
          </div>
        </div>
        
        {/* Critical Info: 4 Assets */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-4 border-red-400 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-4xl">📌</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-red-900 mb-3">
                যাকাতযোগ্য সম্পদ (৪টি মাত্র)
              </h2>
              <div className="bg-white rounded-xl p-4 mb-3">
                <p className="font-bold text-gray-800 mb-2">যাকাত শুধু ৪ ধরনের সম্পদে ফরজ:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
                    <span className="text-3xl">🪙</span>
                    <span className="font-bold text-lg">১. সোনা</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border-2 border-gray-400">
                    <span className="text-3xl">⚪</span>
                    <span className="font-bold text-lg">২. রুপা</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border-2 border-green-400">
                    <span className="text-3xl">💵</span>
                    <span className="font-bold text-lg">৩. নগদ অর্থ</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border-2 border-blue-400">
                    <span className="text-3xl">📦</span>
                    <span className="font-bold text-lg">৪. ব্যবসায়িক মালামাল</span>
                  </div>
                </div>
              </div>
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold text-red-900">
                  ❌ অন্যান্য সম্পদ যাকাতযোগ্য নয়: বাড়ি, গাড়ি, ফার্নিচার, ব্যক্তিগত ব্যবহারের জিনিস
                </p>
              </div>
              <button
                onClick={() => openMasail('fourAssets')}
                className="text-blue-700 hover:text-blue-900 font-bold text-sm flex items-center gap-1 underline"
              >
                📚 বিস্তারিত মাসআলা পড়ুন →
              </button>
            </div>
          </div>
        </div>
        
        {/* Combined Nisab Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-3 border-blue-500 rounded-xl p-5 mb-6 shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-blue-900 mb-2">
                বিশেষ মাসআলা: সম্মিলিত নিসাব
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                আলাদাভাবে কোনো সম্পদ নিসাব না হলেও, <strong className="text-blue-800">সম্মিলিত মূল্য</strong> নিসাব হলে যাকাত ফরজ!
              </p>
              <div className="bg-white rounded-lg p-3 text-sm border-2 border-blue-300">
                <p className="font-semibold mb-1">উদাহরণ:</p>
                <p className="text-gray-700">সোনা: ৩ ভরি + রুপা: ২০ ভরি + নগদ: ৳৫০,০০০</p>
                <p className="text-green-700 font-bold mt-1">→ মোট মূল্য নিসাব = যাকাত ফরজ ✅</p>
              </div>
              <button
                onClick={() => openMasail('combinedNisab')}
                className="text-blue-700 hover:text-blue-900 font-bold text-sm mt-3 flex items-center gap-1 underline"
              >
                📚 আরও জানুন →
              </button>
            </div>
          </div>
        </div>
        
        {/* Assets Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>💰</span>
            <span>সম্পদ (Assets)</span>
          </h2>
          
          <div className="space-y-5">
            {/* Cash */}
            <div className="border-2 border-gray-300 rounded-xl p-5 hover:border-green-500 transition-all hover:shadow-md">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                💵 নগদ টাকা
              </label>
              <input
                type="number"
                value={assets.cash}
                onChange={(e) => setAssets({...assets, cash: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
                <span>💡</span>
                <span>হস্তগত টাকা যা যেকোনো সময় সরাসরি খরচ করতে পারেন</span>
              </p>
              <button 
                onClick={() => openMasail('cash')}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-2 flex items-center gap-1 underline"
              >
                📚 মাসআলা দেখুন
              </button>
            </div>
            
            {/* Bank Balance */}
            <div className="border-2 border-gray-300 rounded-xl p-5 hover:border-green-500 transition-all hover:shadow-md">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                🏦 ব্যাংক ব্যালেন্স
              </label>
              <input
                type="number"
                value={assets.bankBalance}
                onChange={(e) => setAssets({...assets, bankBalance: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
                <span>💡</span>
                <span>যেকোনো সময় উত্তোলনযোগ্য (Fixed Deposit/DPS নয়)</span>
              </p>
              <button 
                onClick={() => openMasail('bank')}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-2 flex items-center gap-1 underline"
              >
                📚 মাসআলা দেখুন
              </button>
            </div>
            
            {/* Gold */}
            <div className="border-2 border-yellow-400 bg-yellow-50 rounded-xl p-5 hover:shadow-lg transition-all">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                🪙 সোনা (মোট বিক্রয় মূল্য)
              </label>
              <input
                type="number"
                value={assets.goldValue}
                onChange={(e) => setAssets({...assets, goldValue: e.target.value})}
                className="w-full border-2 border-yellow-400 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <div className="mt-3 bg-blue-50 border border-blue-300 rounded-lg p-3">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span>💡</span>
                  <span>আপনার সকল সোনার (22K, 18K, সনাতন) প্রকৃত বিক্রয় মূল্য লিখুন</span>
                </p>
              </div>
              <button 
                onClick={() => openMasail('goldCalculation')}
                className="text-blue-600 hover:text-blue-800 font-bold text-sm mt-2 flex items-center gap-1 underline"
              >
                📚 কীভাবে হিসাব করবেন?
              </button>
            </div>
            
            {/* Silver */}
            <div className="border-2 border-gray-400 bg-gray-50 rounded-xl p-5 hover:shadow-lg transition-all">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                ⚪ রুপা (মোট বিক্রয় মূল্য)
              </label>
              <input
                type="number"
                value={assets.silverValue}
                onChange={(e) => setAssets({...assets, silverValue: e.target.value})}
                className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <div className="mt-3 bg-blue-50 border border-blue-300 rounded-lg p-3">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span>💡</span>
                  <span>আপনার সকল রুপার প্রকৃত বিক্রয় মূল্য লিখুন</span>
                </p>
              </div>
              <button 
                onClick={() => openMasail('silverCalculation')}
                className="text-blue-600 hover:text-blue-800 font-bold text-sm mt-2 flex items-center gap-1 underline"
              >
                📚 কীভাবে হিসাব করবেন?
              </button>
            </div>
            
            {/* Business Inventory */}
            <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-5 hover:shadow-lg transition-all">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                �� ব্যবসায়িক পণ্য
              </label>
              <input
                type="number"
                value={assets.businessInventory}
                onChange={(e) => setAssets({...assets, businessInventory: e.target.value})}
                className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-gray-700 flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span>পুনঃবিক্রয়ের পণ্য, উৎপাদনে সরাসরি ব্যবহৃত যন্ত্র, বিক্রয়ের জন্য জমি</span>
                </p>
                <p className="text-gray-700 flex items-start gap-2">
                  <span className="text-red-600">❌</span>
                  <span>গাড়ি, AC, ফার্নিচার (পরোক্ষ সহায়ক)</span>
                </p>
              </div>
              <button 
                onClick={() => openMasail('business')}
                className="text-blue-600 hover:text-blue-800 font-bold text-sm mt-2 flex items-center gap-1 underline"
              >
                📚 বিস্তারিত মাসআলা দেখুন
              </button>
            </div>
            
            {/* Investments */}
            <div className="border-2 border-gray-300 rounded-xl p-5 hover:border-green-500 transition-all hover:shadow-md">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                📈 বিনিয়োগ (শেয়ার, ফান্ড)
              </label>
              <input
                type="number"
                value={assets.investments}
                onChange={(e) => setAssets({...assets, investments: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
                <span>💡</span>
                <span>শেয়ার, মিউচুয়াল ফান্ড এর বাজার মূল্য</span>
              </p>
              <button 
                onClick={() => openMasail('fourAssets')}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-2 flex items-center gap-1 underline"
              >
                📚 মাসআলা দেখুন
              </button>
            </div>
          </div>
        </div>
        
        {/* Liabilities Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span>💳</span>
            <span>দায় (Liabilities)</span>
          </h2>
          
          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 mb-5">
            <p className="font-bold text-amber-900 mb-2">⚠️ হানাফী মাযহাব:</p>
            <p className="text-sm text-gray-700">
              শুধু <strong>প্রয়োজনীয় ঋণ</strong> বাদ যাবে (১ বছরের মধ্যে পরিশোধযোগ্য)। উন্নয়নমূলক ঋণ বাদ যাবে না।
            </p>
            <button 
              onClick={() => openMasail('loans')}
              className="text-blue-600 hover:text-blue-800 font-bold text-sm mt-2 flex items-center gap-1 underline"
            >
              📚 বিস্তারিত মাসআলা দেখুন
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-gray-300 rounded-xl p-5 hover:border-red-400 transition-all">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                প্রয়োজনীয় ঋণ (১ বছরের মধ্যে)
              </label>
              <input
                type="number"
                value={liabilities.necessaryLoans}
                onChange={(e) => setLiabilities({...liabilities, necessaryLoans: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-green-700 flex items-start gap-2">
                  <span>✅</span>
                  <span>খাদ্য, বাসস্থান, চিকিৎসা</span>
                </p>
                <p className="text-red-600 flex items-start gap-2">
                  <span>❌</span>
                  <span>ব্যবসা সম্প্রসারণ, দ্বিতীয় বাড়ি/গাড়ি</span>
                </p>
              </div>
            </div>
            
            <div className="border-2 border-gray-300 rounded-xl p-5 hover:border-red-400 transition-all">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                বকেয়া বিল (১ বছরের মধ্যে)
              </label>
              <input
                type="number"
                value={liabilities.unpaidBills}
                onChange={(e) => setLiabilities({...liabilities, unpaidBills: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
              <p className="text-sm text-gray-600 mt-2">💡 এক বছরের মধ্যে পরিশোধযোগ্য বিল</p>
            </div>
            
            <div className="border-2 border-gray-300 rounded-xl p-5 hover:border-red-400 transition-all">
              <label className="block text-lg font-bold text-gray-800 mb-2">
                অন্যান্য (১ বছরের মধ্যে)
              </label>
              <input
                type="number"
                value={liabilities.other}
                onChange={(e) => setLiabilities({...liabilities, other: e.target.value})}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                placeholder="০"
              />
            </div>
          </div>
        </div>
        
        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black text-2xl md:text-3xl py-6 md:py-8 rounded-2xl transition duration-200 disabled:bg-gray-400 shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? '⏳ হিসাব করা হচ্ছে...' : '✅ যাকাত হিসাব করুন'}
        </button>
        
        {/* Result */}
        {result && (
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl p-8 border-4 border-green-500">
            <h2 className="text-3xl font-black mb-6 text-gray-800 flex items-center gap-3">
              <span>📊</span>
              <span>ফলাফল</span>
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-4 border-b-2 border-gray-300">
                <span className="text-lg font-semibold text-gray-700">মোট সম্পদ:</span>
                <span className="text-2xl font-bold">৳ {formatCurrency(result.totalAssets)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-b-2 border-gray-300">
                <span className="text-lg font-semibold text-gray-700">মোট দায় (বাদযোগ্য):</span>
                <span className="text-2xl font-bold text-red-600">৳ {formatCurrency(result.deductibleLiabilities)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-b-2 border-gray-300">
                <span className="text-lg font-semibold text-gray-700">যাকাতযোগ্য সম্পদ:</span>
                <span className="text-2xl font-bold text-blue-600">৳ {formatCurrency(result.zakatableAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-b-2 border-gray-300">
                <span className="text-lg font-semibold text-gray-700">নিসাব (রুপা):</span>
                <span className="text-2xl font-bold">৳ {formatCurrency(result.nisabThreshold)}</span>
              </div>
            </div>
            
            {result.isObligatory ? (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-600 rounded-2xl p-8 shadow-lg">
                <p className="text-green-900 font-black text-2xl mb-4 flex items-center gap-2">
                  <span>✅</span>
                  <span>মাশাআল্লাহ! আপনার উপর যাকাত ফরজ</span>
                </p>
                <p className="text-6xl md:text-7xl font-black text-green-700 mb-3">
                  ৳ {formatCurrency(result.zakatDue)}
                </p>
                <p className="text-lg text-gray-800 font-bold">
                  (যাকাতযোগ্য সম্পদের ২.৫%)
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border-4 border-blue-500 rounded-2xl p-6">
                <p className="text-blue-900 font-bold text-xl">
                  ℹ️ আপনার উপর যাকাত ফরজ নয়
                </p>
                <p className="text-gray-700 mt-2">
                  নিসাব পরিমাণ সম্পদ নেই
                </p>
              </div>
            )}
            
            {/* Contact */}
            <div className="mt-6 bg-white rounded-xl p-5 border-2 border-gray-300">
              <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📞</span>
                <span>আরও জানতে যোগাযোগ করুন:</span>
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• আপনার এলাকার আলেমদের সাথে পরামর্শ করুন</p>
                <p>• Muslim Finance Tracker Support</p>
                <p className="text-blue-600 font-semibold">support@muslimfinancetracker.com</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Masail Modal */}
        {masailModal.show && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl animate-slideUp">
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
                <h3 className="text-2xl font-bold">📚 যাকাত মাসআলা</h3>
                <button 
                  onClick={() => setMasailModal({ show: false, topic: '' })}
                  className="text-3xl font-bold hover:bg-white/20 w-10 h-10 rounded-full transition"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <MasailContent topic={masailModal.topic} />
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t-2">
                <button 
                  onClick={() => setMasailModal({ show: false, topic: '' })}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default EnhancedZakatCalculator;
