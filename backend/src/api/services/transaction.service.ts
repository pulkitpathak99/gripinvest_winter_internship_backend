// backend/src/api/services/transaction.service.ts
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Lazy / guarded AI init so missing key or library errors won't crash module import
let aiModel: any | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  } else {
    console.warn("GEMINI_API_KEY not provided — AI summaries will be disabled.");
  }
} catch (e) {
  aiModel = null;
  console.error("Failed to initialize Gemini AI client. AI summaries disabled.", e);
}

async function summarizeErrorsWithAI(errorLogs: any[]): Promise<string> {
  if (!aiModel) {
    return "AI summary not available (AI client not initialized).";
  }

  if (!errorLogs || errorLogs.length === 0) {
    return "No errors detected in the last 24 hours. The system is operating smoothly.";
  }

  const logSummary = errorLogs
    .map(log => `- Endpoint: ${log.httpMethod} ${log.endpoint}, Status: ${log.statusCode}, Error: ${String(log.errorMessage || '').slice(0, 120)}`)
    .join('\n');

  const prompt = `
    Analyze the following API error logs from an investment platform within the last 24 hours.
    Logs:
    ${logSummary}

    Provide a brief, human-readable summary (1-2 sentences) of the most important or frequent issues. Identify any critical patterns.
  `;

  try {
    // keep original call but guard against library differences
    const result = await aiModel.generateContent(prompt);
    // result.response may be a promise or property depending on SDK; handle safely
    if (result?.response) {
      const response = await result.response;
      return String(response?.text?.()).trim() || String(response?.text || "").trim() || "AI responded with empty summary.";
    }
    // fallback if API returns plain text
    return String(result?.text || result?.output || "").trim() || "AI returned no usable summary.";
  } catch (error) {
    console.error("Error invoking Gemini AI for transaction summaries:", error);
    return "Could not generate AI summary. The model is experience several traffic. Please wait and try again later.";
  }
}

// backend/src/api/services/transaction.service.ts

export const getTransactionLogs = async (userId: string) => {
  try {
    const logs = await prisma.transactionLog.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
      // CORRECTED: Select specific fields, including the user's email via the relation
      select: {
        id: true,
        statusCode: true,
        httpMethod: true,
        endpoint: true,
        createdAt: true,
        errorMessage: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentErrorLogs = logs.filter(
      (log) =>
        log.statusCode >= 400 && new Date(log.createdAt) > twentyFourHoursAgo
    );

    const aiErrorSummary = await summarizeErrorsWithAI(recentErrorLogs);

    return {
      logs,
      aiErrorSummary,
    };
  } catch (err) {
    console.error("Error in getTransactionLogs:", err);
    throw err;
  }
};