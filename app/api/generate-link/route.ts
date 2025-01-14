import dbConnect from "@/libs/dbConnect";
import { chatbotModel } from "@/models/ChatModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/actions/authOptions";
import UserModel from "@/models/userModel";
import { getCachedChatbots, setCachedChatbots } from "@/app/redis/redisFunction";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Get the user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const userId = session.user.id;

        // Parse the request body
        const { chatbotId, link } = await req.json();
        console.log('Request body:', { chatbotId, link });

        // If chatbotId and link are provided, update the user's link
        if (chatbotId && link) {
            const user = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { link: link } }, // Store only one link
                { new: true, strict: false }
            );

            console.log('Updated user:', user);

            if (!user) {
                return NextResponse.json(
                    { message: "User not found or not authorized." },
                    { status: 404 }
                );
            }
        }

        // Attempt to get chatbots from Redis cache
        const cachedChatbots = await getCachedChatbots(userId as string);
        if (cachedChatbots) {
            // If chatbots are found in cache, return them
            console.log("Returning chatbots from cache");
            return NextResponse.json({
                chatbots: cachedChatbots,
            }, { status: 200 });
        }

        // If no chatbots are found in cache, query the database
        console.log("Returning chatbots from database");
        const chatbots = await chatbotModel.find({ userId }).sort({ createdAt: -1 });

        // Cache the chatbots data for future use (24 hours)
        await setCachedChatbots(userId as string, chatbots);

        return NextResponse.json(
            { chatbots },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error handling chatbots:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
