// src/app/doctypes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DocType {
  name: string;
  module: string;
  modified: string;
}

export default function DocTypesPage() {
  const [doctypes, setDoctypes] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const FRAPPE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://demo.localhost:8002';
  
  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${FRAPPE_URL}/api/method/demo.api.doctype.get_doctypes`, {
          method: 'GET',
          credentials: 'include',
        });
        
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Raw response:', text);
        
        const data = JSON.parse(text);
        
        // Frappe API wraps responses in a message property
        if (data.message && Array.isArray(data.message)) {
          setDoctypes(data.message);
        } else if (data.error || (data.message && data.message.error)) {
          setError(data.error || data.message.error);
        } else {
          setError('Invalid response format');
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching DocTypes:', error);
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocTypes();
  }, [FRAPPE_URL]);
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-md">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Frappe DocTypes</h1>
          <p className="text-center text-gray-600 mt-2">
            Showing standard DocTypes from your Frappe system
          </p>
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:text-blue-700">
              ← Back to Home
            </Link>
          </div>
        </header>
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4">Loading DocTypes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-800">
            <h3 className="font-bold">Error Loading DocTypes</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">Total DocTypes: {doctypes.length}</p>
              <div className="flex space-x-2">
                <select className="border rounded-md p-2 text-sm">
                  <option value="">All Modules</option>
                  {Array.from(new Set(doctypes.map(dt => dt.module))).map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {doctypes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">DocType Name</th>
                      <th className="border p-2 text-left">Module</th>
                      <th className="border p-2 text-left">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctypes.map((doctype, index) => (
                      <tr key={doctype.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border p-2">{doctype.name}</td>
                        <td className="border p-2">{doctype.module}</td>
                        <td className="border p-2">{new Date(doctype.modified).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p>No DocTypes found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}