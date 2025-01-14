import { NextRequest, NextResponse } from "next/server";
import { chatbotModel } from "@/models/ChatModel";
import { setCachedChatbots } from "@/app/redis/redisFunction";

export interface ReqBody {
    userId: string;
    name: string;
    description: string;
    contextData: { [key: string]: string }; 
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { userId, name, description, contextData }: ReqBody = body;
    
    if(!userId || !name || !description || !contextData){
        return NextResponse.json({
            message: "All fields are neccessary!"
        }, {status: 500})
    }
    
    try {
        const newChatBot = new chatbotModel({
            userId: userId,
            name: name,
            description: description,
            contextData: contextData
        })
        await newChatBot.save();

        const updatedChatbots = await chatbotModel.find({ userId }).sort({ createdAt: -1 });

        // Update Redis cache with the new chatbots list
        await setCachedChatbots(userId, updatedChatbots);

        
        return NextResponse.json({
            message: "ChatBot successfully created"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Failed to create Chatbot"
        }, { status: 404 })
    }
}