import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';
import Review from '@/models/Review';
import User from '@/models/User';

// 1. Define params as a Promise
export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. UNWRAP THE PROMISE HERE
  const resolvedParams = await params;
  const carId = resolvedParams.id;
  
  // 3. Connect to the database
  await dbConnect();

  console.log("Loading model to prevent tree-shaking", User.modelName);
  


    // 4. THIS IS THE CRITICAL LINE: Notice it is ONLY 'id', NOT 'params.id'
    const car = await Car.findById(carId).lean();



  // If no car is found, show 404
  if (!car) {
    return notFound();
  }
      const rawReviews = await Review.find({carId: carId})
     .populate('userId','name')
     .sort({ createdAt: -1})
     .lean();

    const reviews = JSON.parse(JSON.stringify(rawReviews));

    const averageRating = reviews.length > 0
    ? (reviews.reduce((acc: number, curr:  any) => acc + curr.rating, 0)/ reviews.length).toFixed(1): "New";

    const plainCar = JSON.parse(JSON.stringify(car));

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Animated Back Button */}
        <Link href="/cars" className="group inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT SIDE: Car Image and Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Premium Image Container */}
            <div className="relative h-[400px] md:h-[550px] w-full bg-slate-100 rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 group cursor-pointer">
              <Image 
                src={car.imageUrl} 
                alt={`${car.make} ${car.carModel}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              {/* Subtle bottom gradient to make the image pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-slate-900 shadow-sm uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                {car.year} Model
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
              
              <div className="mb-6">
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{car.make}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{car.carModel}</h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {car.location}
                </div>
                {/* Optional: Hardcoded a quick feature tag, you can add more if they exist in your DB */}
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Verified Host
                </div>
              </div>

              <div className="border-t border-slate-100 mt-10 pt-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Overview</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  This premium <span className="font-semibold text-slate-900">{car.make} {car.carModel}</span> is in excellent condition and ready for your next adventure. Maintained to the highest standards, it offers a smooth, comfortable ride whether you're navigating city streets or heading out on a road trip.
                </p>
              </div>

          {/* Add this section below your car details / booking widget */}

<div className="mt-16 border-t border-slate-200 pt-12">
  <div className="flex items-center gap-4 mb-8">
    <h3 className="text-2xl font-bold text-slate-900">Customer Reviews</h3>
    <div className="flex items-center bg-slate-100 px-3 py-1 rounded-full">
      <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="font-bold text-slate-900">{averageRating}</span>
      <span className="text-slate-500 text-sm ml-1">({reviews.length} reviews)</span>
    </div>
  </div>

  {reviews.length === 0 ? (
    <p className="text-slate-500 italic">No reviews yet. Be the first to rent this car!</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review: any) => (
        <div key={review._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="font-bold text-slate-900">{review.userId?.name || "Anonymous Guest"}</p>
                <p className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Display Stars */}
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-slate-200'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  )}
</div>

            </div>
          </div>

          {/* RIGHT SIDE: Booking Card */}
          <div className="lg:col-span-1">
            {/* The 'sticky' class makes the widget follow the user as they scroll down to read reviews */}
            <div className="sticky top-28">
              <BookingWidget car={plainCar} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}