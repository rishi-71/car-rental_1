import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { pusherServer } from "@/lib/pusher";
import { error } from "console";

export async function POST(req: Request){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json({ error: 'Unauthorized'}, { status: 401});
        }

        const body = await req.json();
        const {text, receiverId, carId} = body;
        const senderId = session.user.id;

        if(!text || !receiverId || !carId){
            return NextResponse.json({ error: 'Missing required fields'}, { status: 400});
        }
        await dbConnect();

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId,receiverId]},
            carId: carId
        });
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId],
                carId: carId
            });
        }else{
            conversation.lastMessageAt = new Date();
            await conversation.save();
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            senderId: senderId,
            text: text
        });

        const channelName = `chat-${conversation._id.toString()}`;

        await pusherServer.trigger(channelName,'new-message',{
            _id: newMessage._id.toString(),
            text: newMessage.text,
            senderId: newMessage.senderId.toString(),
            createdAt: newMessage.createAt,
        });

        return NextResponse.json(newMessage,{ status: 201});
    }catch(error){
        console.error('Message_post_error',error);
        return NextResponse.json({ error: "internal server Error"},{status: 500});
    }
}