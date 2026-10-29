
import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string | undefined => {
  try {
    return typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
  } catch {
    return undefined;
  }
};

export const generateBio = async (): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Just here for the vibes ✨. Sharing moments and making friends. Send a gift to say hi!";
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a short, fun, and witty user bio for a live streaming app. Make it one or two sentences long. Be creative and engaging.',
    });
    return response.text?.trim() || "Streaming live & sharing positive energy! Join the party ✨";
  } catch (error) {
    console.error("Error generating bio with Gemini:", error);
    return "Streaming live & sharing positive energy! Join the party ✨";
  }
};
