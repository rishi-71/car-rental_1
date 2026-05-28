"use client";

import React, {useState} from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import ReviewForm from '@/components/ReviewForm';

export default function BookingsClient({ initialBookings }: {initialBookings: any[]}){
    
    const formatData = (dateString: string) =>{
        if(!dateString) return "TBD";
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric'};
        return new Date(dateString).toLocaleDateString('en-US',options);
    };

    const getStatusBadge = (status: string) =>{
        switch(status?.toLowerCase()){
            case 'confirmed':
return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>;
            case 'cancelled':
            case 'declined':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
    
        }
    };

    return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-lg text-slate-500 mt-2">Manage your upcoming trips and rental history.</p>
        </div>
       {!initialBookings || initialBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-500">You haven't requested any cars yet, or your database query returned 0 results.</p>
          </div>
        ) :(
        <div className="space-y-6">
          {initialBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col p-6">
              
              {/* Top Row: Car Info & Status */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="relative h-32 w-full md:w-48 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <Image 
                    src={booking.carId?.imageUrl || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"} 
                    alt="Car" 
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {booking.carId?.make} {booking.carId?.carModel}
                      </h3>
                      <p className="text-slate-400 text-sm">Booking ID: {booking._id.slice(-6).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex gap-8 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pick-up</p>
                      <p className="text-slate-900 font-semibold">{formatData(booking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Drop-off</p>
                      <p className="text-slate-900 font-semibold">{formatData(booking.endDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Price & Actions */}
                <div className="flex flex-col items-end justify-center md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                  <p className="text-sm text-slate-500 font-medium">Total Amount</p>
                  <p className="text-blue-600 font-extrabold text-3xl mb-4">₹{booking.totalPrice}</p>
                  
                  {booking.status === 'pending' && (
                    <button className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
                      Cancel Request
                    </button>
                  )}

                  {/* The Rate Trip Button */}
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => {
                        const form = document.getElementById(`review-form-${booking._id}`);
                        form?.classList.toggle('hidden');
                      }}
                      className="w-full text-center text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors py-2 px-4 rounded-lg"
                    >
                      Rate Trip
                    </button>
                  )}
                </div>
              </div>

              {/* The Hidden Review Form wrapper */}
              <div id={`review-form-${booking._id}`} className="hidden transition-all mt-4 border-t border-slate-100 pt-4">
                <ReviewForm 
                  carId={booking.carId?._id} 
                  onSuccess={() => document.getElementById(`review-form-${booking._id}`)?.classList.add('hidden')} 
                />
              </div>

            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  );
};