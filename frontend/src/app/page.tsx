'use client';

import { useState, useEffect, FormEvent } from 'react';
import { customLogin, getCurrentUser, customLogout, testConnection } from '@/utils/frappe';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [user, setUser] = useState<string | null>(null);

  // Test connection on load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('Testing connection...');
        await testConnection();
        setConnectionStatus(`Connected to Frappe server: ${process.env.NEXT_PUBLIC_FRAPPE_URL}`);
        
        // Also check if user is already logged in
        try {
          const userData = await getCurrentUser();
          console.log('User data:', userData);
          if (userData.message && userData.message.user && userData.message.user !== 'Guest') {
            setUser(userData.message.user);
            setStatus('Already logged in');
          }
        } catch (userError) {
          console.log('Not logged in yet:', userError);
        }
      } catch (error) {
        setConnectionStatus('Failed to connect to Frappe server');
        console.error('Connection test error:', error);
      }
    };

    checkConnection();
  }, []);

// Update the handleLogin function in src/app/page.tsx
const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setStatus('Logging in...');
  
  try {
    const result = await customLogin(username, password);
    console.log('Login result:', result);
    
    // Check for message property in the response
    if (result.message === "Logged In" || 
        (result.message && typeof result.message === 'object' && result.message.message === "Logged In")) {
      // Get the user from wherever it is in the response structure
      const user = result.user || 
                  (result.message && result.message.user) || 
                  username;
      
      setUser(user);
      setStatus('Logged in successfully');
    } else if (result.error) {
      throw new Error(result.error);
    } else {
      throw new Error('Login failed with unknown error');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError('Login failed: ' + (error instanceof Error ? error.message : String(error)));
    setStatus('');
  }
};

  const handleLogout = async () => {
    try {
      setStatus('Logging out...');
      
      const result = await customLogout();
      console.log('Logout result:', result);
      
      if (result.message === 'Logged Out' || result.message === 'Not logged in') {
        setUser(null);
        setStatus('Logged out successfully');
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error('Logout failed with unknown error');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Frappe Next.js Integration</h1>
        
        {connectionStatus && (
          <div className={`mb-4 p-2 text-center text-sm rounded-md ${
            connectionStatus.includes('Failed') ? 'bg-red-100 text-red-800' : 
            connectionStatus.includes('Connected') ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {connectionStatus}
          </div>
        )}
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 rounded-md">
              <p>Logged in as: <strong>{user}</strong></p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              Login
            </button>
          </form>
        )}
        
        {status && (
          <div className={`mt-4 p-2 text-center text-sm rounded-md ${
            status.includes('failed') ? 'bg-red-100 text-red-800' : 
            status.includes('success') ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-2 text-center text-sm bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
