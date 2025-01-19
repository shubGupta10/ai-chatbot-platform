'use client'

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function DisplayDataofUsers() {
  const [data, setData] = useState<{ count: number; users: { name: string; email: string }[] }>({
    count: 0,
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/displayUsers');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const result = await response.json();
        setData({ count: result.message.match(/\d+/)[0], users: result.users });
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl mt-24 font-bold text-[#b168f6] mb-6">User Data Overview</h1>
          {loading ? (
            <div className="text-center text-xl ">
              <Loader2Icon className='h-8 w-8 animate-spin' />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div>
              <div className="mb-6">
                <p className="text-xl font-semibold">
                  Total Users: <span className="text-[#b168f6]">{data.count}</span>
                </p>
              </div>
              <table className="w-full table-auto border-collapse bg-gray-800 text-left">
                <thead>
                  <tr className="text-[#b168f6] border-b border-gray-700">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-4 py-2">{user.name || 'N/A'}</td>
                      <td className="px-4 py-2">{user.email || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DisplayDataofUsers;
