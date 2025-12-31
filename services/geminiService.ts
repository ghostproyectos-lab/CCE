
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProjectTasks = async (projectName: string): Promise<SuggestionResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest a list of 5 initial tasks for a project named: "${projectName}". Include a clear title and a brief description for each.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
              },
              required: ['title', 'description', 'priority']
            }
          }
        },
        required: ['tasks']
      }
    }
  });

  return JSON.parse(response.text || '{"tasks": []}');
};

export const suggestSubtasks = async (taskTitle: string, taskDescription: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Given the task "${taskTitle}" with description "${taskDescription}", suggest 3 to 5 actionable subtasks.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subtasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['subtasks']
      }
    }
  });

  const data = JSON.parse(response.text || '{"subtasks": []}');
  return data.subtasks;
};
