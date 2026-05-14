import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export const geminiService = {
  async getBusinessInsights(context: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert business consultant for a small business management platform called OmniBiz. 
        Given the following business state, provide 3 short, actionable insights or recommendations.
        Format your response as a JSON array of objects with "title", "insight", and "impact" (High/Medium/Low).
        
        Business Context:
        ${context}
        `,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error('Error getting business insights:', error);
      return [];
    }
  },

  async askAssistant(question: string, context: string) {
    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are OmniAssistant, the intelligent helper for the OmniBiz management platform. 
          You have access to the business's current state. 
          Help the user with their questions about their business, inventory, staff, or customers.
          Be professional, helpful, and concise.
          
          Context: ${context}`,
        },
      });

      const response = await chat.sendMessage({ message: question });
      return response.text;
    } catch (error) {
      console.error('Error asking assistant:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again soon.";
    }
  }
};
