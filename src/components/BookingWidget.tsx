'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BookingWidget({ car }: { car: any }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [minDate,setMinDate] = useState('');

 React.useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []); 

// const getLocalToday = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     setMinDate(`${year}-${month}-${day}`);
    
//   };

//   const today = getLocalToday();
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if(endDate && newStartDate > endDate){
      setEndDate('');
    }
  }

  // Calculate total days and price dynamically
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * car.pricePerDay : 0;
  };

  const totalPrice = calculateTotal();

  const handleBooking = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!startDate || !endDate) {
      setMessage('Please select both dates.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          vendorId: car.vendorId,
          startDate,
          endDate,
          totalPrice
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Booking requested successfully!');
        setStartDate('');
        setEndDate('');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
      <div className="mb-6">
        <span className="text-4xl font-extrabold text-blue-600">₹{car.pricePerDay}</span>
        <span className="text-gray-500 font-medium"> / day</span>
      </div>

      {message && (
        <div className={`p-3 rounded-md mb-4 text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pick-up Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={minDate}
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder-gray-400" 
          />
        </div>
        
<div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Drop-off Date</label>
          <input 
            type="date" 
            value={endDate}
            min={startDate || minDate} // RULE 2: Must be after start date (or today if start date is empty)
            disabled={!startDate}    // RULE 3: Lock this input until they pick a start date!
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400" 
          />
        </div>

        {totalPrice > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center mt-4">
            <span className="text-gray-600 font-medium">Total Price:</span>
            <span className="text-xl font-bold text-gray-900">₹{totalPrice}</span>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mt-6">
          <button 
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md disabled:bg-blue-400"
          >
            {loading ? 'Processing...' : 'Request to Book'}
          </button>
          <p className="text-xs text-center text-gray-500 mt-4">
            You won't be charged yet.
          </p>
        </div>
      </div>
    </div>
  );
}