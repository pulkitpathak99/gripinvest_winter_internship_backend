// backend/src/api/services/transaction.service.ts

import prisma from "../utils/prismaClient";
import { generateContentWithFallback } from "../utils/aiHelper";

interface AiSummary {
  text: string;
  status: "success" | "warning";
}

async function summarizeErrorsWithAI(errorLogs: any[]): Promise<AiSummary> {
  if (!errorLogs || errorLogs.length === 0) {
    return {
      text: "No errors detected in the last 24 hours. The system is operating smoothly.",
      status: "success",
    };
  }

  const logSummary = errorLogs
    .map(
      (log) =>
        `- Endpoint: ${log.httpMethod} ${log.endpoint}, Status: ${log.statusCode}, Error: ${String(log.errorMessage || "").slice(0, 120)}`,
    )
    .join("\n");

  const prompt = `
    Analyze the following API error logs from an investment platform within the last 24 hours.
    Logs:
    ${logSummary}
    Provide a brief, human-readable summary (1-2 sentences) of the most important or frequent issues.
  `;

  try {
    const summaryText = await generateContentWithFallback(prompt);
    return {
      text: summaryText,
      status: "warning",
    };
  } catch (error) {
    console.error("AI summary generation failed after fallback:", error);
    return {
      text: "Could not generate AI summary due to an issue with the AI service.",
      status: "warning",
    };
  }
}

export const getTransactionLogs = async (userId: string) => {
  try {
    const logs = await prisma.transactionLog.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        statusCode: true,
        httpMethod: true,
        endpoint: true,
        createdAt: true,
        errorMessage: true,
        user: { select: { email: true } },
      },
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentErrorLogs = logs.filter(
      (log) =>
        log.statusCode >= 400 && new Date(log.createdAt) > twentyFourHoursAgo,
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
