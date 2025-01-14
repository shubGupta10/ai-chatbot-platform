import { NextRequest, NextResponse } from "next/server";
import { chatbotModel } from "@/models/ChatModel";
import dbConnect from "@/libs/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/actions/authOptions";
import { setCachedChatbots } from "@/app/redis/redisFunction";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const userId = session.user.id;
        const { id } = params;
        console.log(id);
        
        const chatbot = await chatbotModel.findOne({
            _id: id,
            userId: session.user.id
        });
        console.log(chatbot);
        
        if (!chatbot) {
            return NextResponse.json({
                message: "Chatbot not found or unauthorized"
            }, { status: 404 })
        }

        await chatbotModel.findByIdAndDelete(id);

        const updatedChatbots = await chatbotModel.find({ userId }).sort({ createdAt: -1 });

        // Update Redis cache with the new chatbots list
        await setCachedChatbots(userId as string, updatedChatbots);
        
        return NextResponse.json({
            message: "ChatBot deleted"
        }, { status: 200 })
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}

