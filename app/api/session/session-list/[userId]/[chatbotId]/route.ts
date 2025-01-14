import { NextRequest, NextResponse } from "next/server";
import SessionModel from "@/models/SessionModel";
import dbConnect from "@/libs/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/actions/authOptions";
import { getCachedSessions, setCachedSessions } from "@/app/redis/redisFunction";

export async function GET(req: NextRequest, { params }: { params: { userId: string; chatbotId: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const { userId, chatbotId } = params;

    // Check Redis cache for the sessions
    const cachedSessions = await getCachedSessions(userId, chatbotId);
    if (cachedSessions) {
      return NextResponse.json(
        { sessions: cachedSessions, message: "Sessions fetched from cache" },
        { status: 200 }
      );
    }


    // Fetch sessions for the given userId and chatbotId
    const sessions = await SessionModel.find({ userId, chatbotId });

    if (!sessions || sessions.length === 0) {
      return NextResponse.json(
        { message: "No sessions found for this user and chatbot" },
        { status: 404 }
      );
    }

    // Cache the sessions in Redis
    await setCachedSessions(userId, chatbotId, sessions);

    return NextResponse.json(
      { sessions, message: "Sessions fetched successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching sessions:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}