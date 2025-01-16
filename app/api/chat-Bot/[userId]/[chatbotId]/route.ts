import { createConversationChain } from '@/libs/langchain';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/libs/dbConnect';
import { chatbotModel } from '@/models/ChatModel';
import rateLimit from '@/libs/rateLimit';

const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500, 
});

export async function POST(
  req: any,
  { params }: { params: { userId: string; chatbotId: string } }
) {
  try {
    const ip = req.ip ?? '127.0.0.1';
    await limiter.check(NextResponse.next(), 10, ip); 

    await dbConnect();

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

    let instruction = '';
    if (typeof chatbot.contextData === 'string') {
      instruction = chatbot.contextData;
    } else if (typeof chatbot.contextData === 'object' && chatbot.contextData !== null) {
      instruction = Object.entries(chatbot.contextData)
        .map(([key, value]) => `${key} is ${value}`)
        .join('. ');
    } else {
      return NextResponse.json({ error: 'Invalid context data for this chatbot' }, { status: 400 });
    }

    if (!instruction) {
      return NextResponse.json({ error: 'No context data found for this chatbot' }, { status: 400 });
    }

    console.log("Processed Instruction:", instruction);

    const conversationChain = createConversationChain(instruction);

    const response = await conversationChain.call({ input: message });

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
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    let errorMessage = 'Oops! Something went wrong on our end. Could you try that again?';
    if (error instanceof Error) {
      errorMessage = `I'm having trouble processing that request. Here's what happened: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

