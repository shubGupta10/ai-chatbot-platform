import { NextRequest, NextResponse } from "next/server";
import SessionModel from "@/models/SessionModel";
import dbConnect from "@/libs/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/actions/authOptions";
import { getCachedSessionDetails, setCachedSessionDetails } from "@/app/redis/redisFunction";

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "User is unauthorized" },
        { status: 401 }
      );
    }

    const sessionId = params.sessionId;

    const cachedSessionDetails = await getCachedSessionDetails(sessionId);
    if (cachedSessionDetails) {
      return NextResponse.json(
        { sessions: cachedSessionDetails, message: "Session details fetched from cache" },
        { status: 200 }
      );
    }

    // Find all records for the given sessionId
    const sessionDetails = await SessionModel.find({ sessionId }).sort({ sessionStart: 1 }); // Sort by sessionStart

    if (!sessionDetails || sessionDetails.length === 0) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    // Cache the session details in Redis
    await setCachedSessionDetails(sessionId, sessionDetails);

    return NextResponse.json(
      { sessions: sessionDetails, message: "Session details fetched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching session details:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
