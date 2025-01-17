import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function createConversationChain(instruction: string, history: string[] = []) {
  return async function chat(input: string) {
    const promptTemplate = PromptTemplate.fromTemplate(`
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

    const prompt = await promptTemplate.format({
      instruction,
      history: history.join("\n"),
      input,
    });

    try {
      const result = await model.generateContent(prompt);

      return {
        response: result.response.text(), 
      };
    } catch (error: any) {
      console.error("Error generating content:", error);
      throw new Error("Failed to get a response from Gemini.");
    }
  };
}
