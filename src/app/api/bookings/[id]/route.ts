import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

// PATCH is the standard HTTP method for updating a specific field
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // Security Check: Only logged-in vendors can update bookings
    if (!session || (session.user as any).role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 403 });
    }

    const { status } = await req.json();

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });
    }

    await dbConnect();

    // Update the booking, ensuring it belongs to THIS specific vendor
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: id, vendorId: (session.user as any).id },
      { status: status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking updated!', booking: updatedBooking }, { status: 200 });

  } catch (error) {
    console.error('Update Booking Error:', error);
    return NextResponse.json({ message: 'Failed to update booking.' }, { status: 500 });
  }
}