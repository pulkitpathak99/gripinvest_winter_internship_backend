import { Request, Response } from 'express';
import { getPortfolioDetails } from '../services/portfolio.service';

export const handleGetPortfolioDetails = async (req: Request, res: Response) => {
    // The user ID is attached to the request by our authMiddleware
    const userId = (req as any).user.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const portfolioDetails = await getPortfolioDetails(userId);
        res.status(200).json(portfolioDetails);
    } catch (error) {
        console.error('Error fetching portfolio details:', error);
        res.status(500).json({ message: 'Failed to fetch portfolio details.' });
    }
};