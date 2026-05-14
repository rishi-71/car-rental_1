import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure this path matches your auth.ts location
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

export async function POST(req: Request) {
  try {
    // 1. Verify the user is logged in and is a vendor
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized. Only vendors can add cars.' }, { status: 403 });
    }

    // 2. Parse the car details from the frontend
    const body = await req.json();
    const { make, carModel, year, pricePerDay, imageUrl, location } = body;

    if (!make || !carModel || !year || !pricePerDay || !imageUrl || !location) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 3. Connect to DB and save the car
    await dbConnect();

    const newCar = await Car.create({
      vendorId: (session.user as any).id, // Link the car to this specific vendor
      make,
      carModel,
      year: Number(year),
      pricePerDay: Number(pricePerDay),
      imageUrl,
      location,
      isAvailable: true,
    });

    return NextResponse.json({ message: 'Car added successfully!', car: newCar }, { status: 201 });

  } catch (error) {
    console.error('Error adding car:', error);
    return NextResponse.json({ message: 'Failed to add car' }, { status: 500 });
  }
}