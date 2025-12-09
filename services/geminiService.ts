import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeProfile, Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

export const generateRecipe = async (
  method: string,
  profile: CoffeeProfile,
  emphasizedFlavors?: string[]
): Promise<Recipe> => {
  const flavorEmphasis = emphasizedFlavors && emphasizedFlavors.length > 0
    ? `The user specifically wants to emphasize the following flavors in the final cup: ${emphasizedFlavors.join(', ')}. Adjust the brewing variables (ratio, temperature, grind, agitation) to maximize these characteristics.`
    : '';

  const prompt = `
    Create a detailed coffee brewing recipe for a ${method}.
    The coffee bean profile is:
    Origin: ${profile.origin}
    Roast: ${profile.roastLevel}
    Process: ${profile.process || 'Unspecified'}
    Notes: ${profile.tastingNotes.join(', ')}

    ${flavorEmphasis}

    Adjust the temperature, grind size, and technique to best highlight these specific qualities.
    For example, if it's an Ethiopian light roast, aim for higher temps to extract acidity.
    If it's a Brazilian dark roast, lower temp to avoid bitterness.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          method: { type: Type.STRING },
          coffeeAmount: { type: Type.NUMBER, description: "Grams of coffee" },
          waterAmount: { type: Type.NUMBER, description: "Total grams of water" },
          waterTemp: { type: Type.NUMBER, description: "Temperature in Celsius" },
          grindSize: { type: Type.STRING, description: "e.g. Medium-Fine, Coarse" },
          ratio: { type: Type.STRING, description: "e.g. 1:16" },
          description: { type: Type.STRING, description: "Brief overview of why this recipe works for this bean" },
          flavorExpectation: { type: Type.STRING, description: "What flavors will be highlighted" },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeStart: { type: Type.NUMBER, description: "Second mark to start this step (0 based)" },
                duration: { type: Type.NUMBER, description: "Duration of the action in seconds" },
                action: { type: Type.STRING, description: "Short title like 'Bloom' or 'First Pour'" },
                description: { type: Type.STRING, description: "Detailed instruction" },
                waterAmount: { type: Type.NUMBER, description: "Target cumulative water weight at end of step (optional)" },
              },
              required: ["timeStart", "duration", "action", "description"]
            }
          }
        },
        required: ["method", "coffeeAmount", "waterAmount", "waterTemp", "grindSize", "steps", "ratio", "description", "flavorExpectation"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  const parsed = JSON.parse(text);
  // Ensure the type property is set for the Recipe interface
  return { ...parsed, type: 'recipe' } as Recipe;
};

export const explainFlavorProfile = async (profile: CoffeeProfile): Promise<string> => {
  const prompt = `
    Explain the flavor profile of a ${profile.roastLevel} roast coffee from ${profile.origin}.
    It has tasting notes of: ${profile.tastingNotes.join(', ')}.
    Explain WHY this origin and roast produce these flavors (e.g. altitude, soil, processing, Maillard reaction).
    Keep it engaging and educational, under 200 words.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
  });

  return response.text || "Could not generate explanation.";
};

export const getTutorResponse = async (history: {role: string, content: string}[], message: string): Promise<string> => {
  const chat = ai.chats.create({
    model: modelId,
    config: {
        systemInstruction: "You are a world-class coffee barista and sensory expert. You help users troubleshoot brew issues, understand extraction theory, and improve their coffee making. Keep answers practical and encouraging."
    },
    history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
    }))
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

// --- Video Generation ---

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const generateBrewVideo = async (imageSource: Blob | null, prompt: string): Promise<string> => {
  // IMPORTANT: Re-initialize AI client to ensure fresh API key if user just selected one
  const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let generationConfig: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  };

  if (imageSource) {
    const base64Data = await blobToBase64(imageSource);
    generationConfig.image = {
        imageBytes: base64Data,
        mimeType: imageSource.type || 'image/png',
    };
  }

  let operation = await veoAi.models.generateVideos(generationConfig);

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await veoAi.operations.getVideosOperation({operation: operation});
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed or no URI returned.");

  // Fetch the video content using the API key
  const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) throw new Error("Failed to download generated video.");
  
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};