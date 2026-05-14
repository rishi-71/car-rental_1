import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';

// 1. This is a Server Component, so we can make it async
export default async function FleetPage() {
  
  // 2. Connect to the database and fetch all available cars
  await dbConnect();
  
  // .lean() converts Mongoose documents into plain JavaScript objects (better for performance)
  const cars = await Car.find({ isAvailable: true }).lean();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Premium Fleet</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of reliable, thoroughly inspected vehicles. Find the perfect ride for your next journey.
          </p>
        </div>

        {/* Show a message if no cars are in the database yet */}
        {cars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-medium text-gray-500">No cars available right now.</h3>
            <p className="text-gray-400 mt-2">Vendors are adding new inventory soon!</p>
          </div>
        ) : (
          /* 3. The Grid Layout for Car Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car: any) => (
              <div key={car._id.toString()} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                
                {/* Car Image Wrapper */}
                <div className="relative h-56 w-full bg-gray-100">
                  <Image 
                    src={car.imageUrl} 
                    alt={`${car.make} ${car.carModel}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                    ₹{car.pricePerDay} <span className="text-gray-500 text-xs font-medium">/ day</span>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{car.make}</p>
                      <h2 className="text-xl font-bold text-gray-900">{car.carModel}</h2>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                      {car.year}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 mt-4">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {car.location}
                  </div>

                  {/* Booking Button (We will wire this up next!) */}
                  <Link href={`/cars/${car._id.toString()}`} className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}