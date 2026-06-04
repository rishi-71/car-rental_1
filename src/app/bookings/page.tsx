// src/app/bookings/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import connectToDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { redirect } from "next/navigation";
import BookingsClient from "./BookingsClient";
import Car from "@/models/Car";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  await connectToDB();

  console.log("Models loaded: ",Car.modelName, User.modelName);

  console.log("Logged in User id:",session.user.id);

  // 1. Fetch bookings from the database
  const myBookings = await Booking.find({ customerId: session.user.id })
    .populate('carId', 'make carModel imageUrl pricePerDay location vendorId')
    .sort({ createdAt: -1 })
    .lean();

    console.log("Bookings found:",myBookings.length);

   const serializedBookings = JSON.parse(JSON.stringify(myBookings));

  // 3. Pass the clean data to the interactive Client UI
  return <BookingsClient initialBookings={serializedBookings} currentUserId={session.user.id}/>;
}