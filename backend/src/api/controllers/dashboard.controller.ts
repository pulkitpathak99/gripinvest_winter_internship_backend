// backend/src/api/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import { fetchDashboardSummary } from '../services/dashboard.service';

export const getDashboardSummary = async (req: Request, res: Response) => {
    // The user ID is attached to the request by our authMiddleware
    const userId = (req as any).user.id; 

    try {
        const summaryData = await fetchDashboardSummary(userId);
        res.status(200).json(summaryData);
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard summary.' });
    }
};