import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      try {
        await axios.post(`${API_URL}/auth/register`, {
          name: name,
          email: email,
          authProvider: 'local',
          firebaseUid: userCredential.user.uid
        });
      } catch (backendError) {
        console.log('Backend save error (non-critical):', backendError);
      }

      toast.success('✅ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      return userCredential.user;
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('❌ এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে');
      } else if (error.code === 'auth/weak-password') {
        toast.error('❌ পাসওয়ার্ড আরও শক্তিশালী করুন');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('❌ সঠিক ইমেইল দিন');
      } else {
        toast.error('❌ রেজিস্ট্রেশন করতে সমস্যা হয়েছে');
      }
      
      throw error;
    }
  };

  // Login with Email/Password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('✅ সফলভাবে লগইন হয়েছে!');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('❌ এই ইমেইলের কোনো অ্যাকাউন্ট নেই');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('❌ ভুল পাসওয়ার্ড');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('❌ ভুল ইমেইল বা পাসওয়ার্ড');
      } else {
        toast.error('❌ লগইন করতে সমস্যা হয়েছে');
      }
      
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      try {
        await axios.post(`${API_URL}/auth/social-login`, {
          name: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
          authProvider: 'google',
          firebaseUid: result.user.uid
        });
      } catch (backendError) {
        console.log('Backend save error (non-critical):', backendError);
      }

      toast.success('✅ Google দিয়ে সফলভাবে লগইন হয়েছে!');
      return result.user;
      
    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('❌ Google login বাতিল করা হয়েছে');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Do nothing
      } else {
        toast.error('❌ Google লগইন করতে সমস্যা হয়েছে');
      }
      
      throw error;
    }
  };

  // Logout - এখানে change করেছি
  const logout = async () => {
    try {
      await signOut(auth);
      // User state null হয়ে যাবে, onAuthStateChanged automatically handle করবে
      toast.success('✅ সফলভাবে লগআউট হয়েছে!');
      // কোনো navigate করছি না, component থেকে navigate হবে
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('❌ লগআউট করতে সমস্যা হয়েছে');
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
