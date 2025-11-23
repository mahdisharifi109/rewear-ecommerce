import { GoogleGenAI } from "@google/genai";

// Helper to generate description from name and details
export const generateProductDescription = async (
  productName: string,
  category: string,
  condition: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return "Could not generate description: Missing API Key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Write a compelling, fashion-forward sales description for a second-hand item.
      Item Name: ${productName}
      Category: ${category}
      Condition: ${condition}
      
      Tone: Professional yet inviting, emphasizing sustainability and style.
      Length: Short paragraph (approx 40-60 words).
      Do not include markdown formatting or quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description.");
  }
};
