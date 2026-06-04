import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
//INITIALIZE RAZORPAY WITH OUR KEYS
const razorpay = new Razorpay({
    key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request){
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json({ error: 'Unauthorized '}, { status: 401 });
        }

        const { bookingId } = await req.json();

        if(!bookingId) {
            return NextResponse.json({error: 'Booking ID is required '}, { status: 400 });
        }

        await dbConnect();

        //security check we are fetching the bookings from the database we never trust the frontend to tell the price

        const booking = await Booking.findOne({
            _id: bookingId,
            customerId: session.user.id,
        })

        if(!booking){
            return NextResponse.json({ error: "Booking not found"},{status: 404});
        }

        if(booking.status !== 'awaiting_payment'){
            return NextResponse.json({ error: 'This booking is not awaiting payment'}, {status: 400});
        }
        //prepare the order options
        //so razorpay expects the amount in paise
        const amountInPaise = booking.totalPrice * 100;

        const options = {
            amount : amountInPaise,
            currency: 'INR',
            receipt: `receipt_${booking._id}`,
        };

        //asking razorpay to create the order
        const order = await razorpay.orders.create(options);

        //saving that orderid in database to track

        booking.razonpayOrderId = order.id;
        await booking.save();

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        }, { status: 200});



    } catch (error) {
        console.error("RAZORPAY_ORDER_ERROR: ", error);
        return NextResponse.json({ error: 'Internal server error'}, {status: 500});
        
    }
}