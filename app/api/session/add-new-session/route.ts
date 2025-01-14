import { NextResponse, NextRequest } from "next/server";
import SessionModel from "@/models/SessionModel";
import dbConnect from "@/libs/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      sessionId,
      userId,
      chatbotId,
      userAction,
      sessionStart,
      sessionEnd,
      duration
    } = await req.json();

    if (!sessionId || !userId || !chatbotId || !userAction) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = new SessionModel({
      sessionId,
      userId,
      chatbotId,
      userAction,
      sessionStart: sessionStart || Date.now(),
      sessionEnd,
      duration
    });

    await session.save();

    return NextResponse.json(
      { session, message: "Session stored successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error storing session:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}