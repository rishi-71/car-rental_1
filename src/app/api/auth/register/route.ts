import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb'; // Adjust the import path if your lib is elsewhere
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    // 1. Grab the data from the frontend request
    const body = await req.json();
    const { name, email, password, role } = body;

    // 2. Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    await dbConnect();

    // 4. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already registered' }, 
        { status: 409 }
      );
    }

    // 5. Hash the password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save the new user to the database
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer', // Default to customer if not provided
    });

    return NextResponse.json(
      { message: 'Account created successfully!' }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration.' }, 
      { status: 500 }
    );
  }
}