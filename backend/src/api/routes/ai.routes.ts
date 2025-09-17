// backend/src/api/routes/ai.routes.ts
import { Router, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import { handleChat } from "../services/ai.service";

const router = Router();

router.post(
  "/chat",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { history, message, context } = req.body;

    try {
      const response = await handleChat(userId, history, message, context);
      res.json({ response });
    } catch (error) {
      console.error("Error with AI chat:", error);
      res.status(500).json({ message: "Failed to get response from AI." });
    }
  },
);

export default router;
