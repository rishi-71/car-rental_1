"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ReviewForm from "@/components/ReviewForm";
import ChatBox from "@/components/ChatBox";
import { useRouter } from "next/navigation";

const loadScript = (src: string) =>{
   return new Promise((resolve) =>{
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror= () => resolve(false);
    document.body.appendChild(script);
   });
};

export default function BookingsClient({
  initialBookings,
  currentUserId,
}: {
  initialBookings: any[];
  currentUserId: string;
}) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const router = useRouter();

  const formatData = (dateString: string) => {
    if (!dateString) return "TBD";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Confirmed
          </span>
        );
      case "cancelled":
      case "declined":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  const handlePayment = async (booking: any) => {
    try {

      const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if(!isLoaded){
        alert("Razorpay SDK failed to load. Please check your internet connection or disable adblockers");
        return;
      }


      //asks backend to create a secure order
      const OrderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id }),
      });

      const orderData = await OrderRes.json();

      if (!OrderRes.ok) {
        alert(orderData.error || "failed to initialize payment");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CarWala",
        description: `Booking for ${booking.carId?.make} ${booking.carId?.carModel}`,
        order_id: orderData.id,

        //this function runs automatically when the payment is successful
        handler: async function (response: any) {
          try{
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id,
              }),
            });

            const verifyData = await verifyRes.json();

            if(verifyData.ok){
              alert("payment verified & booking confirmed!!");
              router.refresh();
            }else {
              alert(verifyData.error);
            }
          }catch(error) {
            alert(verifyData?.error || "Payment verification failed. Please contact support");
          }
        },



        prefill: {
          name: "Customer",
          email: "test@example.com",
          contact:"+919999999999"
        },
        theme: {
          color: "#2563EB",
        },
      };

      //@ts-ignore
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error: ", error);
      alert("Something went wrong with the payment gateway.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
     
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Manage your upcoming trips and rental history.
          </p>
        </div>
        {!initialBookings || initialBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No bookings found
            </h3>
            <p className="text-slate-500">
              You haven't requested any cars yet, or your database query
              returned 0 results.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {initialBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col p-6"
              >
                {/* Top Row: Car Info & Status */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="relative h-32 w-full md:w-48 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        booking.carId?.imageUrl ||
                        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"
                      }
                      alt="Car"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {booking.carId?.make} {booking.carId?.carModel}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Booking ID: {booking._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="flex gap-8 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                          Pick-up
                        </p>
                        <p className="text-slate-900 font-semibold">
                          {formatData(booking.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                          Drop-off
                        </p>
                        <p className="text-slate-900 font-semibold">
                          {formatData(booking.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Price & Actions */}
                  <div className="flex flex-col items-end justify-center md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                    <p className="text-sm text-slate-500 font-medium">
                      Total Amount
                    </p>
                    <p className="text-blue-600 font-extrabold text-3xl mb-4">
                      ₹{booking.totalPrice}
                    </p>

                    {booking.status === "pending" && (
                      <button className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
                        Cancel Request
                      </button>
                    )}

                    {/* THE NEW PAYMENT BUTTON */}
                    {booking.status === "awaiting_payment" && (
                      <button
                        onClick={() => handlePayment(booking)}
                        className="w-full text-center text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors py-3 px-4 rounded-xl shadow-md animate-pulse"
                      >
                        Pay ₹{booking.totalPrice} to Confirm
                      </button>
                    )}

                    {/* The Rate Trip Button */}
                    {booking.status === "confirmed" && (
                      <div className="flex flex-col gap-2 w-full">
                        {/* THE NEW CHAT BUTTON */}
                        <button
                          onClick={() =>
                            setActiveChatId(
                              activeChatId === booking._id ? null : booking._id,
                            )
                          }
                          className="w-full text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg shadow-sm"
                        >
                          {activeChatId === booking._id
                            ? "Close Chat"
                            : "Chat with Host"}
                        </button>

                        {/* Your existing Rate Trip Button */}
                        <button
                          onClick={() => {
                            const form = document.getElementById(
                              `review-form-${booking._id}`,
                            );
                            form?.classList.toggle("hidden");
                          }}
                          className="w-full text-center text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors py-2 px-4 rounded-lg"
                        >
                          Rate Trip
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* THE CHAT BOX CONTAINER */}
                {activeChatId === booking._id && (
                  <div className="mt-6 border-t border-slate-100 pt-6 flex justify-center fade-in">
                    <ChatBox
                      currentUserId={currentUserId}
                      // Depending on how deeply nested vendorId is from your populate,
                      // it might be an object or a string. We extract the ID safely.
                      receiverId={
                        booking.carId?.vendorId?._id ||
                        booking.carId?.vendorId ||
                        ""
                      }
                      carId={booking.carId?._id}
                    />
                  </div>
                )}

                {/* The Hidden Review Form wrapper */}
                <div
                  id={`review-form-${booking._id}`}
                  className="hidden transition-all mt-4 border-t border-slate-100 pt-4"
                >
                  <ReviewForm
                    carId={booking.carId?._id}
                    onSuccess={() =>
                      document
                        .getElementById(`review-form-${booking._id}`)
                        ?.classList.add("hidden")
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
