import { Request, Response } from "express";
import { getTransactionLogs } from "../services/transaction.service";

export const handleGetTransactionLogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      // This sends a clear error instead of crashing
      return res
        .status(401)
        .json({ message: "Authentication error: User ID not found." });
    }

    const data = await getTransactionLogs(userId);
    res.status(200).json(data);
  } catch (error) {
    // This will now catch any error, including the one above if it happens
    console.error("Error in transaction controller:", error);
    res.status(500).json({ message: "Failed to fetch transaction logs" });
  }
};
