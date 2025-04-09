'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Loading...');

  const FRAPPE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://demo.localhost:8002';

  useEffect(() => {
    const testApi = async () => {
      try {
        setStatus('Testing API connection...');
        
        const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.hello.hello`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log('API response status:', response.status);
        
        // Get response text
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        // Try to parse JSON
        try {
          const data = JSON.parse(responseText);
          
          // Handle error in message object
          if (data.message && data.message.error) {
            setError(data.message.error);
            setStatus('Error from server');
          } 
          // Handle regular message
          else if (data.message && typeof data.message === 'string') {
            setMessage(data.message);
            setStatus('Connected successfully!');
          } 
          // Handle other formats
          else {
            setMessage(JSON.stringify(data, null, 2));
            setStatus('Got response (see details)');
          }
        } catch (e) {
          setError(`Invalid JSON response: ${responseText}`);
          setStatus('Error');
        }
      } catch (error) {
        console.error('API test error:', error);
        setError(String(error));
        setStatus('Error');
      }
    };

    testApi();
  }, [FRAPPE_URL]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Frappe API Test</h1>
        
        {status && (
          <div className={`mb-4 p-2 text-center text-sm rounded-md ${
            status.includes('Error') ? 'bg-red-100 text-red-800' : 
            status.includes('success') ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </div>
        )}
        
        {message && (
          <div className="p-4 bg-green-100 rounded-md">
            <p><strong>Response:</strong> <pre>{message}</pre></p>
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