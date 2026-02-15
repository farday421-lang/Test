import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  isConfigured() {
    return !!this.ai;
  }

  async generateBio(name: string, skills: string[], tone: string = 'professional'): Promise<string> {
    if (!this.ai) return "API Key not configured. Please add your Gemini API Key.";

    try {
      const model = "gemini-3-flash-preview";
      const prompt = `Write a ${tone} professional bio (max 80 words) for a portfolio website. 
      Name: ${name}
      Skills: ${skills.join(', ')}
      Focus on being engaging and highlighting expertise.`;

      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text?.trim() || "Could not generate bio.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error generating bio. Please try again.";
    }
  }

  async enhanceDescription(text: string): Promise<string> {
    if (!this.ai) return text;

    try {
      const model = "gemini-3-flash-preview";
      const prompt = `Rewrite the following project description to be more punchy, professional, and result-oriented. Keep it under 50 words.
      Original: "${text}"`;

      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text?.trim() || text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return text;
    }
  }
}

export const gemini = new GeminiService();