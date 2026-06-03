'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBox from './ChatBox'; // Make sure this import is here!

export default function VendorBookingActions({ bookingId, currentStatus, vendorId, customerId, carId }: any) {
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  return (
    <div className="w-full flex flex-col items-end gap-3 relative">
      
      {/* 1. Show Approve/Reject if Pending, OR show Badge if already handled */}
      {currentStatus === 'pending' ? (
        <div className="flex gap-3 w-full justify-end">
          <button 
            onClick={() => handleUpdate('confirmed')}
            disabled={loading}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
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
      ) : (
        <span className={`px-4 py-2 text-center rounded-full text-xs font-bold uppercase tracking-wider ${
          currentStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
        }`}>
          {currentStatus}
        </span>
      )}

      {/* 2. Show Chat Button ONLY if the booking is Confirmed */}
      {currentStatus === 'confirmed' && (
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-full md:w-auto text-center text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors py-2 px-6 rounded-xl"
        >
          {isChatOpen ? 'Close Chat' : '💬 Chat with Customer'}
        </button>
      )}

      {/* 3. The Chat Box Container (Floats above everything when opened) */}
      {isChatOpen && currentStatus === 'confirmed' && (
        <div className="mt-2 w-full md:w-[380px] absolute top-full right-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
          <ChatBox 
            currentUserId={vendorId}
            receiverId={customerId}
            carId={carId}
          />
        </div>
      )}

    </div>
  );
}