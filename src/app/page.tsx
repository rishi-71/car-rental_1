import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

export default async function Landing() {
  // Fetch up to 3 available cars to feature on the homepage
  await dbConnect();
  const featuredCars = await Car.find({ isAvailable: true }).limit(3).lean();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-b from-blue-50/50 to-white pt-20 pb-32">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          
          {/* Left Text & Widget */}
          <div className="space-y-8 z-10">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              🚗 #1 Car Rental in Indore
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Rent Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Dream Car</span> Today.
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Experience the freedom of the open road. Choose from our premium fleet of thoroughly inspected vehicles for your next adventure.
            </p>
            
            {/* Sleek Visual Search Widget */}
            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row gap-4 max-w-xl">
              <div className="flex-1 px-4 py-2 border-r border-gray-100 hidden md:block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm font-medium text-gray-900">Indore, MP</p>
              </div>
              <div className="flex-1 px-4 py-2 hidden md:block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dates</p>
                <p className="text-sm font-medium text-gray-900">Select Dates</p>
              </div>
              <Link href="/cars" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-md hover:shadow-lg">
                Browse Fleet →
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] lg:h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
            {/* You can keep your existing unsplash image here */}
            <Image 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop" 
              alt="Luxury rental car"
              fill
              sizes='(max-width : 768px) 100vw, 50vw'
              className="object-cover"
              priority
            />
            {/* Stylish overlay element */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hidden md:flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Fully Insured</p>
                <p className="text-sm text-gray-500">Zero hidden fees</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How CarWala Works</h2>
            <p className="text-gray-600">Get behind the wheel in three simple steps. We've optimized the process so you spend less time booking and more time driving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">1</div>
              <h3 className="text-xl font-bold text-gray-900">Choose a Car</h3>
              <p className="text-gray-600">Browse our extensive catalog of verified vehicles to find the perfect match for your needs.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">2</div>
              <h3 className="text-xl font-bold text-gray-900">Pick Your Dates</h3>
              <p className="text-gray-600">Select your pick-up and drop-off dates. Our pricing is transparent with no hidden charges.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">3</div>
              <h3 className="text-xl font-bold text-gray-900">Book & Drive</h3>
              <p className="text-gray-600">Confirm your booking instantly. Meet the vendor, grab the keys, and enjoy your ride!</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED FLEET (Live Data from DB) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Featured Vehicles</h2>
              <p className="text-gray-600">A sneak peek at our most popular rentals.</p>
            </div>
            <Link href="/cars" className="hidden md:inline-flex text-blue-600 font-bold hover:text-blue-800 transition items-center gap-2">
              View All Cars →
            </Link>
          </div>

          {featuredCars.length === 0 ? (
             <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
               <p className="text-gray-500">No cars available right now. Check back soon!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car: any) => (
                <div key={car._id.toString()} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                    <Image 
                      src={car.imageUrl} 
                      alt={`${car.make} ${car.carModel}`}
                      fill
                      sizes='(max-width : 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                      ₹{car.pricePerDay} <span className="text-gray-500 text-xs font-medium">/ day</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{car.make}</p>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-4">{car.carModel} <span className="text-sm text-gray-400 font-medium ml-2">({car.year})</span></h3>
                    <Link href={`/cars/${car._id.toString()}`} className="block w-full text-center bg-gray-50 text-gray-900 font-bold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
             <Link href="/cars" className="inline-flex text-blue-600 font-bold hover:text-blue-800 transition items-center gap-2">
              View All Cars →
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-white mb-6">Car<span className="text-blue-500">Wala</span></div>
          <p className="max-w-md mx-auto mb-6 text-sm">Providing premium, reliable, and affordable car rentals across Indore. Your journey starts here.</p>
          <div className="border-t border-gray-800 pt-8 text-xs">
            © {new Date().getFullYear()} CarWala Demo. Built with Next.js & Tailwind.
          </div>
        </div>
      </footer>

    </div>
  );
}