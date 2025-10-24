import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-primary-600 mb-4">
              🕌 Muslim Finance Tracker
            </h1>
            <h2 className="text-4xl font-bold text-primary-700 mb-6 bangla">
              মুসলিম ফিনান্স ট্র্যাকার
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Personal Finance Management System
            </p>
            <p className="text-lg text-gray-500 bangla">
              আপনার আর্থিক ব্যবস্থাপনা সহজ করুন
            </p>
            
            <div className="mt-8 p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-700 font-semibold">Frontend Running Successfully!</p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-gray-700 font-semibold">Backend Connected!</p>
              </div>
            </div>

            <footer className="mt-12 text-gray-600">
              <p className="font-semibold">Developed by Muslim Programmer</p>
              <p className="bangla">মুসলিম প্রোগ্রামার</p>
              <p className="text-sm mt-2">© 2024 All Rights Reserved</p>
            </footer>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;