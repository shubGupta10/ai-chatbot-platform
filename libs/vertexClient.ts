// app/api/chat-Bot/[userId]/[chatbotId]/route.ts
import { NextResponse } from 'next/server';
import { PredictionServiceClient } from '@google-cloud/aiplatform';

// Initialize Google Cloud credentials
const initializeGoogleCloud = () => {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    throw new Error('Missing Google Cloud credentials in environment variables');
  }

  if (!process.env.GOOGLE_PROJECT_ID) {
    throw new Error('Missing GOOGLE_PROJECT_ID in environment variables');
  }

  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  
  return new PredictionServiceClient({
    credentials: credentials,
    projectId: process.env.GOOGLE_PROJECT_ID
  });
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string; chatbotId: string } }
) {
  try {
    const body = await request.json();
    const { message } = body;
    
    // Initialize the client with proper credentials
    const client = initializeGoogleCloud();
    
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const location = process.env.GOOGLE_REGION || 'us-central1';

    const predictionRequest = {
      endpoint: `projects/${projectId}/locations/${location}/publishers/google/models/gemini`,
      instance: [
        {
          content: message,
          // Add your context data here if needed
        },
      ],
      parameters: {
        structValue: {
          fields: {
            temperature: { numberValue: 0.7 },
            maxOutputTokens: { numberValue: 512 },
          },
        },
      },
    };

    const [response] = await client.predict(predictionRequest);
    
    return NextResponse.json({
      success: true,
      data: response.predictions
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Project Id')) {
        return NextResponse.json({
          success: false,
          error: 'Google Cloud Project ID is not properly configured'
        }, { status: 500 });
      }
      
      if (error.message.includes('credentials')) {
        return NextResponse.json({
          success: false,
          error: 'Google Cloud credentials are not properly configured'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'An error occurred while processing your request'
    }, { status: 500 });
  }
}