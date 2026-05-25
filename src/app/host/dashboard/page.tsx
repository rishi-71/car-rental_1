"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";

const mockStats = {
    monthlyEarnings : 1250,
    upcomingTrips : 3,
    pendingRequests : 2,
};

const mockRequests = [
    {
    id: 1,
    guestName: "Sarah Jenkins",
    guestImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    car: "2023 Tesla Model 3",
    dates: "Oct 12 - Oct 15",
    total: 360,
    status: "pending",
  },
  {
    id: 2,
    guestName: "Michael Chen",
    guestImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    car: "2021 BMW M3",
    dates: "Oct 20 - Oct 22",
    total: 450,
    status: "pending",
  },
]

const mockFleet = [
  {
    id: 1,
    name: "2023 Tesla Model 3",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
    status: "Active",
    trips: 12,
    rating: 4.9,
  },
  {
    id: 2,
    name: "2021 BMW M3",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
    status: "Active",
    trips: 8,
    rating: 5.0,
  },
];

export default function HostDashboardPage(){
    const [requests, setRequests] = useState(mockRequests);

    const handleAction = ( id : number, action: "approve" | "decline")=>{
        setRequests(requests.filter((req) => req.id !== id));
        alert(`Booking ${action}d successfullly`);
    }

    return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Car<span className="text-orange-500">Rental</span> <span className="text-slate-400 font-medium text-lg ml-2">Host</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/host/list-your-car">
              <Button variant="outline" size="sm">Add New Car</Button>
            </Link>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer">
              <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" alt="Host Profile" width={40} height={40} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Alex</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your fleet today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 mb-2">Monthly Earnings</h3>
            <p className="text-4xl font-extrabold text-slate-900">${mockStats.monthlyEarnings}</p>
            <p className="text-sm text-emerald-500 font-medium mt-2">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 mb-2">Upcoming Trips</h3>
            <p className="text-4xl font-extrabold text-slate-900">{mockStats.upcomingTrips}</p>
            <p className="text-sm text-slate-400 font-medium mt-2">Next trip in 2 days</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm bg-orange-50/50">
            <h3 className="text-sm font-semibold text-orange-600 mb-2">Pending Requests</h3>
            <p className="text-4xl font-extrabold text-orange-500">{mockStats.pendingRequests}</p>
            <p className="text-sm text-orange-600/80 font-medium mt-2">Requires your attention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Action Items (Booking Requests) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Booking Requests</h2>
            
            {requests.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center">
                <p className="text-slate-500 font-medium">You have no pending requests right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <Image src={request.guestImage} alt={request.guestName} width={60} height={60} className="rounded-full object-cover w-16 h-16" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{request.guestName}</h3>
                        <p className="text-slate-500 text-sm">{request.car} • {request.dates}</p>
                        <p className="text-orange-500 font-bold mt-1">Earnings: ${request.total}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button variant="ghost" className="w-full sm:w-auto" onClick={() => handleAction(request.id, "decline")}>Decline</Button>
                      <Button variant="primary" className="w-full sm:w-auto" onClick={() => handleAction(request.id, "approve")}>Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Fleet Management */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">My Fleet</h2>
              <Link href="/host/fleet" className="text-orange-500 font-semibold text-sm hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {mockFleet.map((car) => (
                <div key={car.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:border-orange-500 transition-colors">
                  <div className="relative h-32 w-full bg-slate-100">
                    <Image src={car.image} alt={car.name} fill className="object-cover" />
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {car.status}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">{car.name}</h3>
                      <p className="text-slate-500 text-xs mt-1">{car.trips} trips • ★ {car.rating}</p>
                    </div>
                    <span className="text-slate-400 group-hover:text-orange-500 transition-colors">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}