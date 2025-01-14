// langchain.ts
import { ChatVertexAI } from "@langchain/google-vertexai";
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const initializeLLM = () => {
  try {
    if (!process.env.GOOGLE_CREDENTIALS_BASE64) {
      throw new Error('Google credentials not found');
    }

    const credentials = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString();
    const parsedCredentials = JSON.parse(credentials);

    return new ChatVertexAI({
      authOptions: { credentials: parsedCredentials },
      model: "gemini-1.5-flash",
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9,
    });
  } catch (error) {
    console.error('Error initializing LLM:', error);
    throw error;
  }
};

export const createConversationChain = (instruction: string) => {
  const llm = initializeLLM();
  
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
    inputKey: "input",
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
    llm,
    new StringOutputParser(),
    (output: string) => {
      // Post-process the output to ensure a more natural, conversational tone
      return output
        .replace(/\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s/g, '') // Remove formal titles
        .replace(/\b(user|individual|person)\b/g, 'they') // Replace formal terms with pronouns
        .replace(/\.([\s\n])/g, '.$1 ') // Ensure proper spacing after periods
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