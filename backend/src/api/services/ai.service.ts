// backend/src/api/services/ai.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

export const handleChat = async (userId: string, history: any[], userMessage: string, context: { path: string }) => {
  let contextInfo = `The user is currently on the "${context.path}" page.`;

  // --- CONTEXT-AWARE LOGIC ---
  if (context.path === '/dashboard/portfolio') {
    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { product: true },
    });
    const portfolioSummary = investments
      .map(inv => `- ${inv.product.name}: $${inv.amount}`)
      .join('\n');
    contextInfo += `\n\nHere is a summary of the user's current portfolio:\n${portfolioSummary}`;
  }
  // Add more context for other pages like /products later

  const prompt = `
    You are Finley, a friendly and knowledgeable AI investment analyst from Grip Invest. 
    Your tone is professional, helpful, and encouraging. Never give direct financial advice, 
    but you can educate and provide insights based on the data provided.

    CONTEXT: ${contextInfo}

    CONVERSATION HISTORY:
    ${history.map(h => `${h.role}: ${h.parts}`).join('\n')}

    USER'S NEW MESSAGE:
    ${userMessage}

    FINLEY'S RESPONSE:
  `;

  const result = await aiModel.generateContent(prompt);
  return result.response.text();
};