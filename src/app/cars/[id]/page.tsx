import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';

// 1. Define params as a Promise
export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. UNWRAP THE PROMISE HERE
  const { id } = await params; 
  
  // 3. Connect to the database
  await dbConnect();
  
  let car = null;
  try {
    // 4. THIS IS THE CRITICAL LINE: Notice it is ONLY 'id', NOT 'params.id'
    car = await Car.findById(id).lean();
  } catch (error) {
    return notFound();
  }

  // If no car is found, show 404
  if (!car) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        
        {/* Back Button */}
        <Link href="/cars" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-8 transition">
          ← Back to Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT SIDE: Car Image and Details */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="relative h-[400px] md:h-[500px] w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <Image 
                src={car.imageUrl} 
                alt={`${car.make} ${car.carModel}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                {car.year} Model
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{car.make} {car.carModel}</h1>
              <p className="text-lg text-gray-500 flex items-center gap-2">
                📍 {car.location}
              </p>

              <div className="border-t border-gray-100 mt-8 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  This premium {car.make} {car.carModel} is in excellent condition and ready for your next adventure. Maintained to the highest standards, it offers a smooth, comfortable ride whether you're navigating city streets or heading out on a road trip.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Booking Card */}
         <div className='lg:col-span-1'>
            <BookingWidget car = {car}/>
         </div>

        </div>
      </main>
    </div>
  );
}