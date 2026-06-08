import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json({ error: 'Unauthorized'}, { status: 401});
        }
        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(session.user.id,
            { role: 'vendor'},
            {new: true }
        );

        if(!updatedUser) {
            return NextResponse.json({ error: 'User not found'}, {status: 404});
        }

        return NextResponse.json({ success: true, role: updatedUser.role}, {status: 200});
    } catch (error) {
        console.error("UPGRADE_ROLE_ERROR: ",error);
        return NextResponse.json({ error: 'Internal Server Error'}, {status: 500});
        
    }
}