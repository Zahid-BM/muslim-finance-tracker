import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Auto-redirect logged-in users to Dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center gap-1">
            <img 
              src="/logos/logo-full.png" 
              alt="Muslim Finance Tracker Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xs font-semibold text-green-600">
              Muslim Finance Tracker
            </span>
          </Link>
          <div className="flex gap-3">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                >
                  রেজিস্টার
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <img 
              src="/logos/logo-full.png" 
              alt="Muslim Finance Tracker" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Muslim Finance Tracker
          </h1>
          <h2 className="text-4xl font-bold text-green-700 mb-6 bangla">
            মুসলিম ফিন্যান্স ট্র্যাকার
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Personal Finance Management System
          </p>
          <p className="text-lg text-gray-500 mb-8 bangla">
            আপনার আর্থিক ব্যবস্থাপনা সহজ করুন - ইসলামিক নীতিমালা অনুযায়ী
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold mb-2">আয়-ব্যয় ব্যবস্থাপনা</h3>
              <p className="text-gray-600 bangla">
                আপনার সকল আয় এবং খরচ সহজে ট্র্যাক করুন
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">রিপোর্ট ও বিশ্লেষণ</h3>
              <p className="text-gray-600 bangla">
                PDF রিপোর্ট জেনারেট করুন QR কোড সহ
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">🕌</div>
              <h3 className="text-xl font-bold mb-2">যাকাত ক্যালকুলেটর</h3>
              <p className="text-gray-600 bangla">
                হানাফী মাযহাব অনুযায়ী যাকাত হিসাব করুন
              </p>
            </div>
          </div>

          {/* Zakat Calculator CTA */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-8">
            <div className="text-5xl mb-4">🕌</div>
            <h3 className="text-3xl font-bold mb-4 bangla">যাকাত ক্যালকুলেটর</h3>
            <p className="text-lg mb-6 opacity-90 bangla">
              লগইন ছাড়াই যাকাত হিসাব করুন - সম্পূর্ণ বিনামূল্যে
            </p>
            <Link
              to="/zakat"
              className="inline-block px-8 py-4 bg-white text-green-600 text-lg rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              যাকাত হিসাব করুন →
            </Link>
          </div>

          {/* CTA Buttons */}
          {!currentUser && (
            <div className="mt-12 flex gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-green-600 text-white text-lg rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                এখনই শুরু করুন →
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-green-600 text-lg rounded-xl font-bold border-2 border-green-600 hover:bg-green-50 transition-all"
              >
                লগইন করুন
              </Link>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 bangla">
            ওয়েবসাইট সম্পর্কে
          </h2>
          <div className="space-y-4 text-gray-700 bangla leading-relaxed">
            <p>
              <strong>মুসলিম ফিন্যান্স ট্র্যাকার</strong> একটি সম্পূর্ণ ফ্রি এবং ইসলামিক নীতিমালা
              অনুসরণকারী ব্যক্তিগত আর্থিক ব্যবস্থাপনা সিস্টেম।
            </p>
            <p>
              এই ওয়েবসাইটের মাধ্যমে আপনি:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>আপনার দৈনন্দিন আয়-ব্যয় রেকর্ড করতে পারবেন</li>
              <li>ঋণ এবং সম্পদের হিসাব রাখতে পারবেন</li>
              <li>বিস্তারিত রিপোর্ট PDF আকারে ডাউনলোড করতে পারবেন</li>
              <li>যাকাত, ফিতরা, কুরবানি হিসাব করতে পারবেন</li>
              <li>হানাফী মাযহাব অনুযায়ী ইসলামিক আর্থিক মাসায়েল জানতে পারবেন</li>
            </ul>
            <p className="mt-6 text-center font-semibold">
              Google বা ইমেইল দিয়ে রেজিস্টার করে এখনই ব্যবহার শুরু করুন!
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="font-semibold text-lg">Developed by Muslim Programmer</p>
          <p className="bangla text-xl font-bold text-green-700">মুসলিম প্রোগ্রামার</p>
          <p className="text-sm mt-2">© 2024 All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
