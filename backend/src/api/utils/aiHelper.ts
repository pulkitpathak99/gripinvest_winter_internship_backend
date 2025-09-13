// backend/src/api/utils/aiHelper.ts
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';

const PRIMARY_MODEL = 'gemini-1.5-flash-latest';
const FALLBACK_MODEL = 'gemini-1.5-pro-latest'; // A stable and powerful fallback

export async function generateContentWithFallback(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. AI features disabled.");
    throw new Error("AI service is not configured.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // 1. Attempt to use the fast, primary model first
    const primaryModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
    const result = await primaryModel.generateContent(prompt);
    return (await result.response).text().trim();
  } catch (error) {
    console.error(`Primary AI model (${PRIMARY_MODEL}) failed:`, error);

    // 2. If it was a "Service Unavailable" error, try the fallback model
    if (error instanceof GoogleGenerativeAIFetchError && error.status === 503) {
      console.warn(`Primary model overloaded. Attempting fallback with ${FALLBACK_MODEL}...`);
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
        const fallbackResult = await fallbackModel.generateContent(prompt);
        return (await fallbackResult.response).text().trim();
      } catch (fallbackError) {
        console.error(`Fallback AI model (${FALLBACK_MODEL}) also failed:`, fallbackError);
        throw new Error("AI service is temporarily unavailable due to high demand.");
      }
    }
    
    // 3. For any other type of error, re-throw it to be handled by the calling service
    throw error;
  }
}