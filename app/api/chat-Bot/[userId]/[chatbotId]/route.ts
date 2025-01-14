// app/api/chat-Bot/[userId]/[chatbotId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/libs/dbConnect';
import { chatbotModel } from '@/models/ChatModel';
import rateLimit from '@/libs/rateLimit';
import { createConversationChain } from '@/libs/langchain';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(
  req: any,
  { params }: { params: { userId: string; chatbotId: string } }
) {
  try {
    // Rate limiting
    const ip = req.ip ?? '127.0.0.1';
    await limiter.check(NextResponse.next(), 10, ip);

    // Connect to database
    await dbConnect();
    console.log("Already Connected to the database");

    const { userId, chatbotId } = params;

    if (!userId || !chatbotId) {
      return NextResponse.json({ error: 'Invalid URL parameters' }, { status: 400 });
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Find the chatbot
    const chatbot = await chatbotModel.findOne({
      _id: chatbotId,
      userId
    });
    
    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Process context data
    let instruction = '';
    if (typeof chatbot.contextData === 'string') {
      instruction = chatbot.contextData;
    } else if (typeof chatbot.contextData === 'object' && chatbot.contextData !== null) {
      instruction = Object.entries(chatbot.contextData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    } else {
      return NextResponse.json({ error: 'Invalid context data for this chatbot' }, { status: 400 });
    }

    if (!instruction) {
      return NextResponse.json({ error: 'No context data found for this chatbot' }, { status: 400 });
    }

    console.log("Processed Instruction:", { instruction });

    // Create conversation chain with the processed instruction
    const conversationChain = createConversationChain(instruction);

    // Get response from the chain
    const response = await conversationChain.call({ input: message });

    // Add conversation starters
    const conversationStarters = [
      "Is there anything else you'd like to know?",
      "What do you think about that?",
      "Pretty interesting, right?",
      "Does that help? Let me know if you need more details!",
    ];
    const randomStarter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];

    const enhancedResponse = `${response.response} ${randomStarter}`;

    return NextResponse.json({ response: enhancedResponse }, { status: 200 });

  } catch (error) {
    console.error('Error handling chat request:', error);

    // Rate limit error handling
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 429) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      }, { status: 429 });
    }

    // Generic error handling with more informative message
    let errorMessage = 'Oops! Something went wrong on our end. Could you try that again?';
    if (error instanceof Error) {
      errorMessage = `I'm having trouble processing that request. Here's what happened: ${error.message}`;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}