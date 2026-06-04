import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import {  NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

        //Mathematical Signature Verification - we combine the order_id and payment_id, and hash it using our secret key.
        //if our result matches Razorpay's signature, the payment is 100% authentic.

        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const generated_signature = crypto.createHmac('sha256', secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

        if(generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "payment verification failed. Invalid signature."},{ status: 400});
        }

        await dbConnect();
        await Booking.findByIdAndUpdate(bookingId, {
            status: 'confirmed',
            razorpayPaymentId: razorpay_payment_id,
        });

        return NextResponse.json({success: true, message: "Payment verified successfully"}, {status:200});;
    } catch (error) {
        console.error("verification_error", error);
        return NextResponse.json({ error: 'Internal server error'}, {status:500});
    }
}