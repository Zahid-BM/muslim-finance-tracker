import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Register with Email/Password
  const register = async (email, password, name) => {
    try {
      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 3. Send email verification
      await sendEmailVerification(userCredential.user);

      // 4. Sign out immediately (user must verify email first)
      await signOut(auth);

      // Note: Toast will be shown in Register.jsx after redirect
      
      return { 
        success: true, 
        needsVerification: true 
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে');
      } else if (error.code === 'auth/weak-password') {
        toast.error('পাসওয়ার্ড আরও শক্তিশালী করুন (কমপক্ষে ৬ অক্ষর)');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('সঠিক ইমেইল দিন');
      } else {
        toast.error('রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
      
      throw error;
    }
  };

  // Login with Email/Password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        toast.error('আগে ইমেইল verify করুন। আপনার inbox চেক করুন।');
        throw new Error('Email not verified');
      }
      
      toast.success('সফলভাবে লগইন হয়েছে!');
      return userCredential.user;
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Email not verified') {
        // Already showed toast above
        throw error;
      } else if (error.code === 'auth/user-not-found') {
        toast.error('এই ইমেইলের কোনো অ্যাকাউন্ট নেই');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('ভুল পাসওয়ার্ড');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('ভুল ইমেইল বা পাসওয়ার্ড');
      } else {
        toast.error('লগইন করতে সমস্যা হয়েছে');
      }
      
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      try {
        await axios.post(`${API_URL}/api/auth/social-login`, {
          name: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
          authProvider: 'firebase-google',
          firebaseUid: result.user.uid
        });
      } catch (backendError) {
        console.log('Backend save error (non-critical):', backendError);
      }

      toast.success('  Google দিয়ে সফলভাবে লগইন হয়েছে!');
      return result.user;
      
    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('  Google login বাতিল করা হয়েছে');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Do nothing
      } else {
        toast.error('  Google লগইন করতে সমস্যা হয়েছে');
      }
      
      throw error;
    }
  };

  // Logout - এখানে change করেছি
  const logout = async () => {
    try {
      await signOut(auth);
      // User state null হয়ে যাবে, onAuthStateChanged automatically handle করবে
      toast.success('  সফলভাবে লগআউট হয়েছে!');
      // কোনো navigate করছি না, component থেকে navigate হবে
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('  লগআউট করতে সমস্যা হয়েছে');
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        // Sync with MongoDB (Firebase handles auth, MongoDB stores profile)
        try {
          const provider = user.providerData[0]?.providerId;
          let authProvider = 'firebase-email';
          
          if (provider === 'google.com') {
            authProvider = 'firebase-google';
          } else if (provider === 'github.com') {
            authProvider = 'firebase-github';
          }
          
          await axios.post(`${API_URL}/api/auth/register`, {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            authProvider: authProvider,
            firebaseUid: user.uid,
            isEmailVerified: user.emailVerified
          });
          
          setCurrentUser(user);
        } catch (error) {
          console.error('MongoDB sync error:', error);
          // Continue - user can still use app even if MongoDB sync fails
          setCurrentUser(user);
        }
      } else if (user && !user.emailVerified) {
        // Email not verified for email/password users
        await signOut(auth);
        setCurrentUser(null);
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [API_URL]);

  const value = {
    currentUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
