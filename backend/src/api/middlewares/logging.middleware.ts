import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "./auth.middleware";

const prisma = new PrismaClient();

export const loggingMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const originalSend = res.send;
  let responseBody: any = null;

  res.send = function (body) {
    responseBody = body;
    return originalSend.apply(res, arguments as any);
  };

  res.on("finish", async () => {
    // This now directly uses the user object if it exists
    const { method, originalUrl, user } = req;
    const statusCode = res.statusCode;

    let errorMessage: string | null = null;
    if (statusCode >= 400 && responseBody) {
      try {
        const parsedBody = JSON.parse(responseBody);
        errorMessage = parsedBody.message || JSON.stringify(parsedBody);
      } catch (e) {
        errorMessage = responseBody as string;
      }
    }

    await prisma.transactionLog.create({
      data: {
        // --- THIS IS THE FIX ---
        // We log the user's ID directly, which is more reliable and efficient.
        // The email is not necessary for a transaction log.
        userId: user?.id || null,
        email: null, // We can remove the email lookup entirely

        endpoint: originalUrl,
        httpMethod: method as any,
        statusCode: statusCode,
        errorMessage: errorMessage,
      },
    });
  });

  next();
};
