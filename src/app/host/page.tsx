'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";

export default function BecomeHostPage(){
    const [carValue, setCarValue] = useState(25000);
    const [daysRented, setDaysRented] = useState(15);

    const estimatedEarnings = Math.round((carValue* 0.002)* daysRented);

    return (
    <div className="min-h-screen bg-white pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-black text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop" 
            alt="Person handing over car keys" 
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Turn your car into an <span className="text-orange-500">earning engine.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of hosts who are covering their car payments, insurance, and more by sharing their vehicle when they aren't using it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/host/list-your-car">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg shadow-orange-500/30">
                  List Your Car Today
                </Button>
              </Link>
              <Button size="lg" variant="glass" className="w-full sm:w-auto">
                How it Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE EARNINGS ESTIMATOR */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">See what you could earn</h2>
            <p className="text-slate-500 text-lg">Estimate your monthly income based on your car's value and availability.</p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
            
            {/* Sliders */}
            <div className="w-full md:w-1/2 space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-slate-700">Estimated Car Value</label>
                  <span className="font-bold text-orange-500">${carValue.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" max="100000" step="1000"
                  value={carValue}
                  onChange={(e) => setCarValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-slate-700">Days Rented per Month</label>
                  <span className="font-bold text-orange-500">{daysRented} days</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="30" step="1"
                  value={daysRented}
                  onChange={(e) => setDaysRented(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="w-full md:w-1/2 bg-slate-900 rounded-2xl p-8 text-center text-white transform transition-transform hover:scale-105">
              <p className="text-slate-400 font-medium mb-2">Your Estimated Earnings</p>
              <h3 className="text-6xl font-extrabold text-orange-500 mb-4">
                ${estimatedEarnings.toLocaleString()}
              </h3>
              <p className="text-sm text-slate-400">per month</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Value Proposition) */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Sharing made simple</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">We handle the insurance, the verification, and the payments. You just hand over the keys.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            
            <div className="p-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Create your listing</h3>
              <p className="text-slate-600 leading-relaxed">Upload high-quality photos, write a catchy description, and set your daily price. It's completely free to list.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accept bookings</h3>
              <p className="text-slate-600 leading-relaxed">Guests are verified by our team. Review their profiles and accept the trips that work for your schedule.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Earn and repeat</h3>
              <p className="text-slate-600 leading-relaxed">Meet the guest, check their ID, and hand over the keys. You get paid directly to your bank account via Stripe.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}