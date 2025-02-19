import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function createConversationChain(instruction: string, history: string[] = []) {
  return async function chat(input: string) {
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a highly precise AI assistant. Follow these strict guidelines:  
      - Answer **only** what is explicitly asked, without adding extra context, opinions, or unnecessary details.  
      - Do **not** ask follow-up questions or provide engagement phrases.  
      - Keep responses **concise and direct** while ensuring clarity.  
      - Use simple, structured sentences to avoid unnecessary elaboration.  
    
      Context for the response:  
      {instruction}  
    
      Previous conversation:  
      {history}  
    
      User: {input}  
      AI:
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
