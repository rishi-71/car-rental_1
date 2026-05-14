'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="p-6 flex justify-between items-center bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-600">CarWala</Link>
      
      <div className="flex items-center gap-4">
        {/* Loading State */}
        {status === 'loading' && <span className="text-sm text-gray-500">Loading...</span>}

        {/* Not Logged In */}
        {status === 'unauthenticated' && (
          <>
            <Link href="/login" className="text-gray-700 font-medium hover:text-blue-600 transition">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
              Register
            </Link>
          </>
        )}

        {/* Logged In */}
        {status === 'authenticated' && session?.user && (
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700 font-medium">
              Hello, {session.user.name} <span className="text-blue-600">({(session.user as any).role})</span>
            </span>

            {/* Role-Based Links */}
            {(session.user as any).role === 'vendor' && (
              <Link href="/vendor/dashboard" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition">
                My Dashboard
              </Link>
            )}
            
            {(session.user as any).role === 'customer' && (
              <Link href="/bookings" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition">
                My Bookings
              </Link>
            )}

            <button 
              onClick={() => signOut()} 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}