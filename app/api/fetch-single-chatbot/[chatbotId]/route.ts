import { NextRequest, NextResponse } from "next/server";
import { chatbotModel } from "@/models/ChatModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/actions/authOptions";
import dbConnect from "@/libs/dbConnect";
import { getSingleChatbot, SetSingleChatbot } from "@/app/redis/redisFunction";

export async function GET(req: NextRequest, { params }: { params: { chatbotId: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ 
                message: "Unauthorized" 
            }, { status: 401 });
        }
        const userId = session.user.id;
        const {chatbotId} = await params;

         // Check Redis for cached single chatbot
        const cachedChatbot = await getSingleChatbot(userId as string, chatbotId);
        if(cachedChatbot){
            return NextResponse.json({
                chatbot: cachedChatbot,
            }, {status: 200})
        }
        
        //use db
        const chatbot = await chatbotModel.findOne({ 
            _id: chatbotId,
            userId: userId
        });

        //store in redis db
        await SetSingleChatbot(userId as string, chatbot, chatbotId);

        if (!chatbot) {
            return NextResponse.json({
                message: "Chatbot not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            chatbot
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching chatbot:", error);
        return NextResponse.json({
            message: "Failed to fetch chatbot"
        }, { status: 500 });
    }
}

