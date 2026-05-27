import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export async function POST(req: Request){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json({
                message : 'You must be logged in to leave a review'
            },{status : 401})
        }
        const body = await req.json();
        const {carId, rating, comment} = body;

        if(!carId || !rating || !comment){
            return NextResponse.json({
                message: "Missing required fields"
            }, { status: 400});
        }

        await dbConnect();

        const newReview = await Review.create({
            userId: session.user.id,
            carId: carId,
            rating: Number(rating),
            comment:comment,
        });

        return NextResponse.json({
            message:'Review submitted successfullly!', review: newReview
        },{ status : 201})
    }catch(error){
        console.error("Review submission error:",error);
        return NextResponse.json({
            message:"An unexpected error occured."
        },{ status: 500})
    }
}