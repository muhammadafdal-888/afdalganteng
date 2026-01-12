
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Generates an automatic professional prompt for a product image.
   */
  async generateAutoPrompt(imageBase64: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageBase64,
              },
            },
            {
              text: "Describe this object in detail and then write a professional product photography prompt for it. The prompt should specify a luxurious or modern background, cinematic lighting, and sharp focus. Return ONLY the final prompt text without any introductory sentences.",
            },
          ],
        },
      ],
    });
    return response.text?.trim() || "Professional product shot with cinematic lighting and elegant background.";
  },

  /**
   * Transforms an existing image into a professional product photo.
   */
  async transformToProductPhoto(imageBase64: string, prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: 'image/png',
            },
          },
          {
            text: `Re-imagine this product in a professional commercial setting: ${prompt}. Maintain the product's core identity but enhance the lighting, shadows, and background to look high-end.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Failed to generate image.");
  }
};
