import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface WorkflowPlan {
  topic: string;
  theory: {
    overview: string;
    recommendedMaterials: string[];
  };
  basics: {
    definitionAndIdentity: string;
    utilityAndPotential: string;
  };
  apply: {
    immediateTaskTitle: string;
    immediateTaskDescription: string;
  };
  practical: {
    projectTitle: string;
    projectDescription: string;
    executionSteps: string[];
  };
}

export async function generateMasteryWorkflow(topic: string): Promise<WorkflowPlan> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a 4-step ultimate mastery workflow for the following subject/topic: "${topic}".
    
The 4 steps are:
1. Learn Theory: Before you build, gather materials. Provide an overview and a list of recommended materials.
2. Understand Basics & Concepts: Answer the two golden questions: What is it? (Definition & Identity) and What can it do? (Utility & Potential).
3. Apply Immediately: Bridge the gap between knowing and doing. Provide one very immediate task (solve one problem, write one line of code) right after theory.
4. Perform Practical: Put away the guide and build something from scratch. Provide a small but comprehensive practical project idea with execution steps.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: {
            type: Type.STRING,
            description: "The name of the topic being mastered.",
          },
          theory: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING, description: "A brief overview of the theory to be learned." },
              recommendedMaterials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific books, docs, or types of tutorials to gather." },
            },
            required: ["overview", "recommendedMaterials"],
          },
          basics: {
            type: Type.OBJECT,
            properties: {
              definitionAndIdentity: { type: Type.STRING, description: "Answer 'What is it?'. Focus on Definition & Identity" },
              utilityAndPotential: { type: Type.STRING, description: "Answer 'What can it do?'. Focus on Utility & Potential" },
            },
            required: ["definitionAndIdentity", "utilityAndPotential"],
          },
          apply: {
            type: Type.OBJECT,
            properties: {
              immediateTaskTitle: { type: Type.STRING, description: "Title of the quick task." },
              immediateTaskDescription: { type: Type.STRING, description: "Detailed description of the quick, immediate practice." },
            },
            required: ["immediateTaskTitle", "immediateTaskDescription"],
          },
          practical: {
            type: Type.OBJECT,
            properties: {
              projectTitle: { type: Type.STRING, description: "The title of the practical project to build from scratch." },
              projectDescription: { type: Type.STRING, description: "Description of the project." },
              executionSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Steps to build the project." },
            },
            required: ["projectTitle", "projectDescription", "executionSteps"],
          },
        },
        required: ["topic", "theory", "basics", "apply", "practical"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate workflow. No text in response.");
  }

  try {
    const plan = JSON.parse(response.text) as WorkflowPlan;
    return plan;
  } catch (error) {
    throw new Error("Failed to parse the generated workflow.");
  }
}
