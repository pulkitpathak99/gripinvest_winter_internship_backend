// backend/src/api/routes/investment.routes.ts
import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import * as investmentService from "../services/investment.service";

const router = Router();
const prisma = new PrismaClient();

// POST /api/investments - Create a new investment
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { productId, amount } = req.body;
  const userId = req.user!.id; // We know user exists from authMiddleware

  try {
    const investment = await investmentService.createInvestment(
      userId,
      productId,
      amount,
    );
    res.status(201).json(investment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/investments/portfolio - Get user's portfolio
router.get(
  "/portfolio",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const portfolio = await prisma.investment.findMany({
      where: { userId },
      include: { product: true }, // Include product details with each investment!
    });
    res.json(portfolio);
  },
);

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    const investment = await prisma.investment.findFirst({
      where: { id, userId },
      include: { product: true },
    });
    if (!investment) {
      return res.status(404).json({ message: "Investment not found." });
    }
    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch investment details." });
  }
});

router.post(
  "/:id/cancel",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
      const updatedInvestment = await investmentService.cancelInvestment(
        id,
        userId,
      );
      res.json(updatedInvestment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

export default router;
