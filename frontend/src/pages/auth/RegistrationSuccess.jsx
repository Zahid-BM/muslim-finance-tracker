import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCheckCircle, MdEmail, MdRefresh } from 'react-icons/md';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/register', { replace: true });
    }
  }, [location, navigate]);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        toast.success('Verification email পুনরায় পাঠানো হয়েছে!');
      } else {
        toast.error('অনুগ্রহ করে আবার register করুন');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Email পাঠাতে সমস্যা হয়েছে। পরে চেষ্টা করুন।');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <MdCheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            রেজিস্ট্রেশন সফল!
          </h1>
          <p className="text-gray-600">
            আপনার account সফলভাবে তৈরি হয়েছে
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <MdEmail className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                ইমেইল verification প্রয়োজন
              </h3>
              <p className="text-sm text-gray-600">
                আমরা <span className="font-semibold">{email}</span> এ একটি verification link পাঠিয়েছি
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-semibold">📧 পরবর্তী পদক্ষেপ:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>আপনার email inbox চেক করুন</li>
              <li>Inbox-এ না থাকলে <span className="font-semibold">Spam/Junk</span> folder দেখুন</li>
              <li>Verification link-এ click করুন</li>
              <li>তারপর login করুন</li>
            </ol>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Login Page-এ যান
          </button>
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MdRefresh className={resending ? 'animate-spin' : ''} size={20} />
            {resending ? 'পাঠানো হচ্ছে...' : 'Email পুনরায় পাঠান'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Email পাননি? Spam folder check করুন অথবা পুনরায় পাঠান
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
