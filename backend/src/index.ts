// backend/src/index.ts (updated)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./api/routes/auth.routes";
import productRoutes from "./api/routes/product.routes";
import investmentRoutes from "./api/routes/investment.routes";
import dashboardRoutes from "./api/routes/dashboard.routes";
import portfolioRoutes from "./api/routes/portfolio.routes";
import transactionRoutes from "./api/routes/transaction.routes";
import { loggingMiddleware } from "./api/middlewares/logging.middleware";
import { authMiddleware } from "./api/middlewares/auth.middleware";
import { profileRoutes } from "./api/routes/profile.routes";
import aiRoutes from "./api/routes/ai.routes";

import { PrismaClient } from "@prisma/client";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

dotenv.config();

console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      error: (error as Error).message,
    });
  }
});
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// 1. PUBLIC ROUTES - No middleware is applied here.
app.use("/api/auth", authRoutes);

// 2. APPLY MIDDLEWARE - Any router defined BELOW this point will be protected.
app.use(authMiddleware);
app.use(loggingMiddleware);

// 3. PROTECTED ROUTES
app.use("/api/products", productRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
