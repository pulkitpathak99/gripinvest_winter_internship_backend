// backend/src/api/routes/investment.routes.ts
import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import * as investmentService from '../services/investment.service';

const router = Router();
const prisma = new PrismaClient();

// POST /api/investments - Create a new investment
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { productId, amount } = req.body;
    const userId = req.user!.id; // We know user exists from authMiddleware

    try {
        const investment = await investmentService.createInvestment(userId, productId, amount);
        res.status(201).json(investment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/investments/portfolio - Get user's portfolio
router.get('/portfolio', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const portfolio = await prisma.investment.findMany({
        where: { userId },
        include: { product: true }, // Include product details with each investment!
    });
    res.json(portfolio);
});

export default router;