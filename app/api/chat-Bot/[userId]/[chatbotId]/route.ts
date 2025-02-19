import { createConversationChain } from "@/libs/langchain";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import { chatbotModel } from "@/models/ChatModel";
import rateLimit from "@/libs/rateLimit";
import { getContextData, setContextData } from "@/app/redis/redisFunction";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const chatbotChains = new Map(); 

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string; chatbotId: string } }
) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";
    await limiter.check(NextResponse.next(), 10, ip);

    const { userId, chatbotId } = await params;
    if (!userId || !chatbotId) {
      return NextResponse.json({ error: "Invalid URL parameters" }, { status: 400 });
    }

    const { message, history = [] } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let contextDataFromRedis = await getContextData(`Context data: ${userId}`);
    if (!contextDataFromRedis) {
      await dbConnect();
      const chatbotFromDb = await chatbotModel.findOne({
        _id: chatbotId,
        userId,
      });
      if (chatbotFromDb) {
        contextDataFromRedis = chatbotFromDb.contextData;
        await setContextData(`Context data: ${userId}`, contextDataFromRedis, 0);
      }
    }

    if (!contextDataFromRedis) {
      return NextResponse.json(
        { error: "No context data found for this chatbot" },
        { status: 400 }
      );
    }

    let instruction = "";
    if (typeof contextDataFromRedis === "string") {
      instruction = contextDataFromRedis;
    } else if (typeof contextDataFromRedis === "object" && contextDataFromRedis !== null) {
      instruction = Object.entries(contextDataFromRedis)
        .map(([key, value]) => `${key} is ${value}`)
        .join(". ");
    } else {
      return NextResponse.json({ error: "Invalid context data for this chatbot" }, { status: 400 });
    }

    if (!instruction) {
      return NextResponse.json({ error: "No context data found for this chatbot" }, { status: 400 });
    }


    let chat;
    if (chatbotChains.has(chatbotId)) {
      chat = chatbotChains.get(chatbotId);
    } else {
      chat = await createConversationChain(instruction, history);
      chatbotChains.set(chatbotId, chat);
    }

    const response = await chat(message);

    const conversationStarters = [
      "Is there anything else you would like to know?",
      "What do you think about that?",
      "Pretty interesting, right?",
      "Does that help? Let me know if you need more details!",
    ];
    const randomStarter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];

    const enhancedResponse = `${response.response} ${randomStarter}`;

    return NextResponse.json({ response: enhancedResponse }, { status: 200 });
  } catch (error) {
    console.error("Error handling chat request:", error);
    if (error instanceof Error && "statusCode" in error && error.statusCode === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }
    let errorMessage = "Oops! Something went wrong on our end. Could you try that again?";
    if (error instanceof Error) {
      errorMessage = `I'm having trouble processing that request. Here's what happened: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
