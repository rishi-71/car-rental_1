import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Car from '@/models/Car'; // We need this so Mongoose knows what to populate
import Navbar from '@/components/Navbar';

export default async function MyBookingsPage() {
  // 1. Secure the page: Get the user's session
  const session = await getServerSession(authOptions);

  // 2. If they aren't logged in, kick them to the login page
  if (!session) {
    redirect('/login');
  }

  // 3. Connect to the database
  await dbConnect();

  // 4. Fetch the bookings for this specific user
  // .populate('carId') tells Mongoose to automatically fetch the Car details linked to this booking
  const bookings = await Booking.find({ customerId: session.user.id })
    .populate({ path: 'carId', model: Car }) 
    .sort({ createdAt: -1 })// Show newest bookings first
    .lean();

  // Helper function to format dates nicely
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your upcoming trips and rental history.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">You have no bookings yet.</h3>
            <p className="text-gray-500 mb-6">Ready for an adventure? Browse our fleet and find your perfect ride.</p>
            <Link href="/cars" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Explore Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => {
              const car = booking.carId; // The populated car data
              
              // Determine status badge color
              let statusColor = 'bg-yellow-100 text-yellow-800'; // Default pending
              if (booking.status === 'confirmed') statusColor = 'bg-green-100 text-green-800';
              if (booking.status === 'cancelled') statusColor = 'bg-red-100 text-red-800';

              return (
                <div key={booking._id.toString()} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                  
                  {/* Car Image (Smaller thumbnail) */}
                  <div className="relative h-32 w-full md:w-48 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {car ? (
                      <Image 
                        src={car.imageUrl} 
                        alt={car.carModel}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Car removed</div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {car ? `${car.make} ${car.carModel}` : 'Vehicle Unavailable'}
                        </h2>
                        <p className="text-sm text-gray-500">Booking ID: {booking._id.toString().slice(-6).toUpperCase()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Pick-up</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(booking.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Drop-off</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(booking.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="w-full md:w-auto md:pl-6 md:border-l border-gray-100 flex flex-col justify-center items-end gap-3 text-right">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                      <p className="text-2xl font-extrabold text-blue-600">₹{booking.totalPrice}</p>
                    </div>
                    
                    {/* Placeholder for future cancel logic */}
                    {booking.status === 'pending' && (
                      <button className="text-sm font-medium text-red-600 hover:text-red-800 transition underline">
                        Cancel Request
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}