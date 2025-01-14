import dbConnect from "@/libs/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/actions/authOptions";
import UserModel from "@/models/userModel";
import SessionModel from "@/models/SessionModel";
import { chatbotModel } from "@/models/ChatModel";

export async function GET(req: NextRequest) {
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
        console.log(session);
        const userId = session.user.id;
        

        // Fetch the user's saved chatbot link from UserModel
        const user = await UserModel.findById(userId).select("link");
        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }
        console.log("User data model", user);
        

        // Extract the chatbotId from the link (assumes the ID is the last part of the link)
        const chatbotId = user.link.split('/').pop();
        
        // Fetch the selected chatbot's data from chatbotModel
        const chatbot = await chatbotModel.findOne({ _id: chatbotId });
        if (!chatbot) {
            return NextResponse.json(
                { message: "Chatbot not found." },
                { status: 404 }
            );
        }
        console.log("Chatbot model data", chatbot);
        

        // Fetch the session data for the chatbot and user from SessionModel
        const sessions = await SessionModel.find({
            userId: session.user.id,
            chatbotId: chatbot._id,
        });

        // Aggregate analytics
        const totalSessions = sessions.length;
        const totalDuration = sessions.reduce((acc, session) => acc + (session?.duration ?? 0), 0);
        const averageDuration = totalSessions ? totalDuration / totalSessions : 0;
        const userActions = sessions.map(session => session.userAction);
        
        // Create an analytics object to return
        const analytics = {
            chatbotId: chatbot._id,
            totalSessions,
            totalDuration,
            averageDuration,
            userActions,
            chatbotName: chatbot.name,
            chatbotLink: chatbot.chatbotLink,
            userId: session.user.id,
            userName: session.user.name,
        };
        console.log("Whole returned object", analytics);
        

        // Return the aggregated analytics data
        return NextResponse.json(
            { analytics },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching chatbot analytics:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
