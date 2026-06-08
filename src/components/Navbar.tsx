"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="p-6 flex justify-between items-center bg-white shadow-sm relative">
      {/* LEFT SIDE: Logo */}
      <Link href="/" className="text-2xl font-extrabold text-blue-600">
        CarWala
      </Link>

      {/* RIGHT SIDE: Navigation & Auth */}
      <div className="flex items-center gap-6">
        
        {/* LOGGED IN USER VIEW */}
        {status === "authenticated" && session?.user ? (
          <>
            {/* 1. Dynamic Call to Action based on Role */}
            {session.user.role === "customer" ? (
              <Link 
                href="/host" 
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Start Earning
              </Link>
            ) : (
             <div className="flex items-center gap-5 border-r border-slate-200 pr-5 mr-1">
                <Link 
                  href="/vendor/dashboard" 
                  className="text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  <span>+</span> Add Car
                </Link>
                <Link 
                  href="/vendor/requests" 
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Host Dashboard
                </Link>
              </div>
            )}

            {/* 2. Profile Avatar & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center border-2 border-transparent hover:border-blue-600 transition-all focus:outline-none"
              >
                {/* Show the first letter of their name */}
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-800 truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{session.user.role}</p>
                  </div>

                  <Link 
                    href="/bookings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  >
                    My Trips
                  </Link>

                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut({ callbackUrl: '/login' });
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* LOGGED OUT VIEW */
          <Link 
            href="/login" 
            className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}