// backend/src/api/routes/dashboard.routes.ts
import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// This route will be protected, only logged-in users can access it.
router.get('/summary', authMiddleware, getDashboardSummary);

export default router;