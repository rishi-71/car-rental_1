"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HostLandingPage() {
  const { data: session, update} = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBecomeHost = async () => {
   try {
    const res = await fetch('/api/user/upgrade', {method: 'POST'});

    if(res.ok){
      await update({ role: "vendor"});

      router.push('/vendor/requests');
    }else {
      alert("Something went wrong. Please try again.");
    }
   } catch (error) {
    console.error("Upgrade error: ", error);
    alert("Network error.");
   } finally {
    setIsLoading(false);
   }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Turn Your Idle Car Into Extra Income
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          Join CarWala as a Host. Share your vehicle when you are not using it and earn money to cover your EMIs, maintenance, or fund your next vacation.
        </p>
        
        <button 
          onClick={handleBecomeHost}
          disabled={isLoading}
          className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-slate-10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Upgrading Profile..." : "Become a Host Today"}
        </button>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            🛡️
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">You are in control</h3>
          <p className="text-slate-600">You decide the daily price, the availability rules, and you approve every single booking request.</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            💸
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Secure Payments</h3>
          <p className="text-slate-600">Get paid securely directly to your bank account via Razorpay as soon as a booking is confirmed.</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            💬
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Real-Time Chat</h3>
          <p className="text-slate-600">Communicate directly with your renters before handing over the keys using our built-in messenger.</p>
        </div>
      </div>
    </div>
  );
}