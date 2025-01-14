// 1. First, create a service account configuration interface
interface ServiceAccountConfig {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}

// 2. Initialize the client with credentials in your API route
import { PredictionServiceClient } from '@google-cloud/aiplatform';

const initializeClient = () => {
    // For production (Vercel)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const credentials: ServiceAccountConfig = JSON.parse(
            process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
        );
        
        return new PredictionServiceClient({
            credentials: credentials,
            projectId: process.env.GOOGLE_PROJECT_ID
        });
    }
    
    // For local development
    return new PredictionServiceClient();
};

// 3. Modified askVertexAI function
export const askVertexAI = async (prompt: string, contextData: string) => {
    try {
        const client = initializeClient();
        const projectId = process.env.GOOGLE_PROJECT_ID;
        const location = process.env.GOOGLE_REGION;

        const request = {
            endpoint: `projects/${projectId}/locations/${location}/publishers/google/models/gemini`,
            instance: [
                {
                    content: prompt,
                    context: contextData
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

        const [response] = await client.predict(request);
        console.log('Response:', response.predictions);

        return response.predictions;
    } catch (error) {
        console.error('Error while calling Vertex AI:', error);
        throw error;
    }
}