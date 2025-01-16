import { GoogleAuth } from 'google-auth-library';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Authenticate with Google
export const authenticateGoogle = async () => {
  const credentialsEnv = process.env.GOOGLE_VERTEX_AI_WEB_CREDENTIALS;
  if (!credentialsEnv) {
    throw new Error('GOOGLE_VERTEX_AI_WEB_CREDENTIALS environment variable is not defined');
  }
  const credentials = JSON.parse(credentialsEnv);

  const auth = new GoogleAuth({
    credentials,  // Pass the parsed credentials object
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],  // Scope for Google Cloud APIs
  });

  const client = await auth.getClient();
  return client;
};

// Initialize LangChain with Google Vertex AI
export const createConversationChain = (instruction: string) => {
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: 'history',
    inputKey: 'input',
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are an AI assistant with a friendly and engaging personality. Your responses should be:
    - Warm and conversational, as if chatting with a good friend
    - Informative and detailed, sharing relevant information from your knowledge base
    - Natural-sounding, using contractions, casual language, and occasional expressions
    - Engaging, asking follow-up questions or making relevant comments to keep the conversation flowing
    - Structured with short paragraphs and occasional bullet points for clarity
    - Empathetic, acknowledging the user's feelings or perspective when appropriate

    Important context about the user or topic:
    {instruction}

    Previous conversation:
    {history}

    Human: {input}
    AI: Hey there! Great to chat with you about this. Here's what I know:
  `);

  const chain = RunnableSequence.from([
    {
      input: (initialInput) => initialInput.input,
      history: () => memory.loadMemoryVariables({}).then((res) => res.history),
      instruction: () => instruction,
    },
    prompt,
    new ChatVertexAI({
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9,
    }),
    new StringOutputParser(),
    (output: string) => {
      return output
        .replace(/\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s/g, '')
        .replace(/\b(user|individual|person)\b/g, 'they')
        .replace(/\.([\s\n])/g, '.$1 ')
        .trim();
    },
  ]);

  return {
    call: async (input: { input: string }) => {
      const response = await chain.invoke(input);
      await memory.saveContext(input, { output: response });
      return { response };
    },
    memory,
  };
};
