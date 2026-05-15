'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorBookingActions({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // This tells Next.js to refresh the Server Component and fetch the new data!
        router.refresh(); 
      } else {
        alert('Failed to update booking.');
      }
    } catch (error) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // If the booking is already handled, just show the status
  if (currentStatus !== 'pending') {
    return (
      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
        currentStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {currentStatus}
      </span>
    );
  }

  // If pending, show the Action Buttons
  return (
    <div className="flex gap-3">
      <button 
        onClick={() => handleUpdate('confirmed')}
        disabled={loading}
        className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50 shadow-sm"
      >
        {loading ? '...' : 'Approve'}
      </button>
      <button 
        onClick={() => handleUpdate('cancelled')}
        disabled={loading}
        className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition disabled:opacity-50"
      >
        {loading ? '...' : 'Reject'}
      </button>
    </div>
  );
}