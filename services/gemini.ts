
import { GoogleGenAI, Type } from "@google/genai";
import { Prompt } from "../types";

export const GeminiService = {
  generateDailyPrompt: async (): Promise<Partial<Prompt>> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a controversial but fun daily poll question for a general Reddit community. The question should be engaging, spark debate, and have 4 distinct, popular options. Return the result in JSON format.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 options"
            }
          },
          required: ["question", "options"]
        }
      }
    });

    try {
      const data = JSON.parse(response.text);
      return {
        question: data.question,
        options: data.options,
      };
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return {
        question: "Which office supply is the most superior?",
        options: ["Mechanical Pencil", "Gel Pen", "Stapler", "Highlighter"]
      };
    }
  }
};
