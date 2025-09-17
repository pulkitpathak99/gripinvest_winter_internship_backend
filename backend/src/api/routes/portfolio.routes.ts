// backend/src/api/routes/portfolio.routes.ts
import { Router } from "express";
import { handleGetPortfolioDetails } from "../controllers/portfolio.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Defines the GET /details endpoint for the /api/portfolio path
// It's protected by the authMiddleware to ensure only logged-in users can access it.
router.get("/details", authMiddleware, handleGetPortfolioDetails);

// We can add other portfolio-related routes here later
export default router;
