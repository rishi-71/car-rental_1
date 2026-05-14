import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only logged-in users can book (ideally customers)
    if (!session) {
      return NextResponse.json({ message: 'You must be logged in to book a car.' }, { status: 401 });
    }

    const body = await req.json();
    const { carId, vendorId, startDate, endDate, totalPrice } = body;

    if (!carId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ message: 'Missing required booking details.' }, { status: 400 });
    }

    await dbConnect();

    const newBooking = await Booking.create({
      carId,
      customerId: (session.user as any).id,
      vendorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: 'pending'
    });

    return NextResponse.json({ message: 'Booking requested successfully!', booking: newBooking }, { status: 201 });

  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ message: 'Failed to process booking.' }, { status: 500 });
  }
}