// backend/src/api/routes/transaction.routes.ts
import { Router } from "express";
import { handleGetTransactionLogs } from "../controllers/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, handleGetTransactionLogs);

export default router;
