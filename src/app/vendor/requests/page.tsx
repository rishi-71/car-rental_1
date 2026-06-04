import React from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Car from '@/models/Car'; 
import User from '@/models/User'; // Needed to populate the Customer's name
import Navbar from '@/components/Navbar';
import VendorBookingActions from '@/components/VendorBookingActions';


export const dynamic = 'force-dynamic';
export default async function VendorRequestsPage() {
  const session = await getServerSession(authOptions);
  const vendorId = session?.user?.id;

  if (!session || session.user.role !== 'vendor') {
    redirect('/login');
  }

  await dbConnect();

  // Fetch bookings where the vendorId matches the logged-in vendor
  // We populate both the Car details AND the Customer details
  const bookings = await Booking.find({ vendorId: session.user.id })
    .populate({ path: 'carId', model: Car }) 
    .populate({ path: 'customerId', model: User, select: 'name email' })// Only grab the customer's name and email
    .sort({ createdAt: -1 })
    .lean();

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Requests</h1>
          <p className="text-gray-600">Review and manage incoming reservations for your fleet.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No booking requests yet.</h3>
            <p className="text-gray-500">When customers book your cars, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking: any) => {
              const car = booking.carId;
              const customer = booking.customerId;

              return (
                <div key={booking._id.toString()} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                  
                  {/* Car Thumbnail */}
                  <div className="relative h-24 w-full md:w-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {car && <Image src={car.imageUrl} alt={car.carModel} fill className="object-cover" sizes="150px" />}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vehicle</p>
                      <h2 className="text-lg font-bold text-gray-900">{car ? `${car.make} ${car.carModel}` : 'Deleted Car'}</h2>
                      <p className="text-sm text-gray-600 mt-1">₹{booking.totalPrice} Total</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-sm font-bold text-gray-900">{customer ? customer.name : 'Unknown User'}</p>
                      <p className="text-sm text-gray-600">{customer ? customer.email : ''}</p>
                    </div>

                    <div className="md:col-span-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex gap-6 mt-2 inline-flex w-max">
                      <div>
                         <p className="text-xs text-gray-500 font-semibold">From</p>
                         <p className="text-sm font-medium text-gray-900">{formatDate(booking.startDate)}</p>
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 font-semibold">To</p>
                         <p className="text-sm font-medium text-gray-900">{formatDate(booking.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full md:w-auto md:pl-6 md:border-l border-gray-100 flex justify-end">
                    <VendorBookingActions 
                      bookingId={booking._id.toString()} 
                      currentStatus={booking.status}
                      vendorId={vendorId}
                      customerId={customer ? customer._id.toString():''} 
                      carId={car ? car._id.toString(): ''}
                    />
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