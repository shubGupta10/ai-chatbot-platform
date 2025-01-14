import { NextRequest, NextResponse } from "next/server";
import { chatbotModel } from "@/models/ChatModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/actions/authOptions";
import dbConnect from "@/libs/dbConnect";
import { getCachedChatbots, setCachedChatbots } from "@/app/redis/redisFunction";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ 
                message: "Unauthorized" 
            }, { status: 401 });
        }
        const userId = session.user.id;

        //check redis first for data
        const cachedChatbots = await getCachedChatbots(userId as string);
        if(cachedChatbots){
            return NextResponse.json({
                chatbots: cachedChatbots,
            }, { status: 200 });
        }

        //use our db if redis does not contain data
        const chatbots = await chatbotModel.find({ 
            userId: session.user.id 
        }).sort({ createdAt: -1 }); 

        await setCachedChatbots(userId as string, chatbots);

        return NextResponse.json({
            chatbots
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching chatbots:", error);
        return NextResponse.json({
            message: "Failed to fetch chatbots"
        }, { status: 500 });
    }
}