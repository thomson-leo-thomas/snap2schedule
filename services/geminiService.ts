import { GoogleGenAI, Type } from "@google/genai";
import { AiExtractionResponse } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractDetails = async (
  textInput: string,
  imageFile?: File
): Promise<AiExtractionResponse> => {
  const model = "gemini-2.5-flash";

  const parts: any[] = [];
  
  if (imageFile) {
    const imagePart = await fileToGenerativePart(imageFile);
    parts.push(imagePart);
  }

  if (textInput) {
    parts.push({ text: textInput });
  }

  const prompt = `
    Analyze the provided content (text and/or image). 
    Extract any potential calendar events and actionable tasks.
    
    For dates, assume the current year is ${new Date().getFullYear()} if not specified.
    If a relative date like "tomorrow" is used, calculate it based on today: ${new Date().toISOString()}.
    
    Return the response in strict JSON format matching the schema. Do not include markdown code blocks.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  start: { type: Type.STRING, description: "ISO 8601 Date String" },
                  end: { type: Type.STRING, description: "ISO 8601 Date String" },
                  location: { type: Type.STRING },
                  description: { type: Type.STRING },
                  allDay: { type: Type.BOOLEAN }
                },
                required: ["title", "start", "end", "allDay"]
              }
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
                  dueDate: { type: Type.STRING, description: "ISO 8601 Date String" }
                },
                required: ["title", "priority"]
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up potential markdown code blocks if the model ignores the instruction
    const jsonString = text.replace(/```json|```/g, '').trim();
    
    return JSON.parse(jsonString) as AiExtractionResponse;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};

export const analyzeSchedulingConflict = async (
    proposedTime: string,
    existingEvents: string
): Promise<string> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        I have a proposed meeting at ${proposedTime}.
        Here are my existing events: ${existingEvents}.
        Is there a conflict? If so, suggest 3 alternative times close to the proposed time.
        Keep the answer concise and friendly.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text || "Could not analyze schedule.";
};