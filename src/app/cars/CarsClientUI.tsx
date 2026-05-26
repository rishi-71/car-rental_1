"use client";

import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface CarType {
    _id: string;
    make: string;
    carModel: string;
    year: number;
    pricePerDay: number;
    location: string;
    imageUrl: string;
}

export default function CarsClientUI({initialCars}:{initialCars: CarType[]}){
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCars = initialCars.filter((car) =>{
        const searchLower = searchQuery.toLocaleLowerCase();
        const make = car.make?.toLowerCase() || "";
        const model = car.carModel?.toLowerCase() || "";
        const location = car.location?.toLowerCase() || "";

        return(
            make.includes(searchLower) ||
            model.includes(searchLower) ||
            location.includes(searchLower)
        )
    })

    return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Navbar />

      {/* Premium Hero & Search Section */}
      <div className="bg-white border-b border-slate-200 pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Find your perfect drive.
          </h1>
          
          <div className="max-w-2xl relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by make, model, or city (e.g., Indore, Hyundai)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 text-slate-900 text-lg shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Cars Grid */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
          </h2>
        </div>

        {filteredCars.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No cars found</h3>
            <p className="text-slate-500">Try adjusting your search terms or exploring a different city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map((car) => (
              <Link href={`/cars/${car._id}`} key={car._id} className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                
                {/* Image Container */}
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <Image 
                    src={car.imageUrl || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"} 
                    alt={`${car.make} ${car.carModel}`} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    {car.year}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mb-1">{car.make}</p>
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{car.carModel}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-2 font-medium">
                      <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {car.location}
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900">₹{car.pricePerDay}</span>
                      <span className="text-slate-500 text-sm font-medium"> / day</span>
                    </div>
                    <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      Book Now
                    </span>
                  </div>
                </div>
                
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}