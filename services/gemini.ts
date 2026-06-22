
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBunPairing(mood: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is feeling "${mood}". Suggest the best cinnamon roll or jar from Bobby's Bun Factory. 
      Menu: Classic Bun, Strawberry Cloud, Blueberry Blast, Caramel Pecan Crunch, Secret Frosting Jar, Apple Filling Jar.
      Provide a 2-sentence whimsical recommendation that sounds like a premium bakery marketing copy.`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.8,
      }
    });
    return response.text || "You can't go wrong with our OG Classic!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Treat yourself to a warm, fluffy bun today!";
  }
}
