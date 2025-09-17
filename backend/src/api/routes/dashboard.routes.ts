// backend/src/api/routes/dashboard.routes.ts
import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.get("/summary", authMiddleware, getDashboardSummary);

export default router;
