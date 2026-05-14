'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form State
  const [make, setMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // E.g., a link from Unsplash

  // Protection: Kick out non-vendors
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'vendor') {
      router.push('/');
    }
  }, [status, session, router]);

  const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ make, carModel, year, pricePerDay, location, imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('🚗 Car successfully added to your fleet!');
        // Clear the form
        setMake(''); setCarModel(''); setYear(''); setPricePerDay(''); setLocation(''); setImageUrl('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Show a loading screen while NextAuth checks their role
  if (status === 'loading') return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}. Add a new car to your fleet below.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 border-b pb-4">List a New Car</h2>
          
          {message && (
            <div className={`p-4 rounded-md mb-6 text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAddCar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Make (Brand)</label>
              <input type="text" required value={make} onChange={e => setMake(e.target.value)} placeholder="e.g., Hyundai" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Model</label>
              <input type="text" required value={carModel} onChange={e => setCarModel(e.target.value)} placeholder="e.g., Creta" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <input type="number" required value={year} onChange={e => setYear(e.target.value)} placeholder="2023" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Price Per Day (₹)</label>
              <input type="number" required value={pricePerDay} onChange={e => setPricePerDay(e.target.value)} placeholder="2500" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Location (City/Area)</label>
              <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Vijay Nagar, Indore" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400" />
              <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image of the car.</p>
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold p-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400">
                {loading ? 'Adding Car...' : 'List Car for Rent'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}