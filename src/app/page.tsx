import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      
  {/* 1. FIXED NAVBAR */}
   <Navbar/>

      {/* 2. MAIN HERO SECTION */}
      <main className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side: Text and Search */}
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Rent Your Dream Car Today
          </h2>
          <p className="text-lg text-gray-600">
            Simple, fast, and affordable car rentals.
          </p>
          
          {/* Simple Search Box */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 max-w-md border border-gray-100">
            <input 
              type="text" 
              placeholder="Enter pickup location..." 
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Search Cars
            </button>
          </div>
        </div>

        {/* Right Side: Image using next/image */}
        <div className="flex-1 w-full h-[300px] md:h-[400px] relative">
          {/* Replace this src with an image from your public folder like src="/car.jpg" */}
          <Image 
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop" 
            alt="Blue rental car"
            fill
            className="object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>
        
      </main>

    </div>
  );
}