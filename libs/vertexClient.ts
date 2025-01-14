import { PredictionServiceClient} from '@google-cloud/aiplatform'

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_REGION

const client = new PredictionServiceClient();

export const  askVertexAI = async (prompt: string, contextData: string) => {
    try {
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