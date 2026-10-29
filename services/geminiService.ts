
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateBio = async (): Promise<string> => {
  if (!API_KEY) {
    return "AI is currently unavailable. Please check the API key configuration.";
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a short, fun, and witty user bio for a live streaming app. Make it one or two sentences long. Be creative and engaging.',
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating bio with Gemini:", error);
    return "Failed to generate a bio. Please try again later.";
  }
};
