// backend/src/api/controllers/investment-portfolio.routes.test.ts

import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

// Import routers
import investmentRoutes from "./investment.routes";
import portfolioRoutes from "./portfolio.routes";

// Import services to be mocked
import * as investmentService from "../services/investment.service";
import * as portfolioService from "../services/portfolio.service";
import prismaClient from "../utils/prismaClient";

// --- Mocks Setup ---
jest.mock("../utils/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));
jest.mock("../services/investment.service");
jest.mock("../services/portfolio.service");

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;
const investmentServiceMock = investmentService as jest.Mocked<
  typeof investmentService
>;
const portfolioServiceMock = portfolioService as jest.Mocked<
  typeof portfolioService
>;

// --- Test App Setup ---
const app = express();
app.use(express.json());
// Mount the real routers
app.use("/investments", investmentRoutes);
app.use("/portfolio", portfolioRoutes);

describe("Investment and Portfolio Routes", () => {
  let userToken: string;
  const userId = "user-123";

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    userToken = jwt.sign({ userId }, process.env.JWT_SECRET);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the DB lookup for the authMiddleware
    prismaMock.user.findUnique.mockResolvedValue({
      id: userId,
      role: "USER",
    } as any);
  });

  describe("POST /investments", () => {
    const investmentData = { productId: "prod-1", amount: 5000 };

    test("❌ should return 401 if user is not authenticated", async () => {
      const res = await request(app).post("/investments").send(investmentData);
      expect(res.status).toBe(401);
    });

    test("✅ should return 201 and the new investment on success", async () => {
      // Arrange
      const mockInvestment = { id: "inv-1", ...investmentData, userId };
      investmentServiceMock.createInvestment.mockResolvedValue(
        mockInvestment as any,
      );

      // Act
      const res = await request(app)
        .post("/investments")
        .set("Authorization", `Bearer ${userToken}`)
        .send(investmentData);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockInvestment);
      expect(investmentServiceMock.createInvestment).toHaveBeenCalledWith(
        userId,
        investmentData.productId,
        investmentData.amount,
      );
    });

    test("❌ should return 400 if the investment service throws an error", async () => {
      // Arrange
      investmentServiceMock.createInvestment.mockRejectedValue(
        new Error("Product not found"),
      );

      // Act
      const res = await request(app)
        .post("/investments")
        .set("Authorization", `Bearer ${userToken}`)
        .send(investmentData);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Product not found");
    });
  });

  describe("GET /portfolio/details", () => {
    test("❌ should return 401 if user is not authenticated", async () => {
      const res = await request(app).get("/portfolio/details");
      expect(res.status).toBe(401);
    });

    test("✅ should return 200 and portfolio data on success", async () => {
      // Arrange
      const mockPortfolio = { kpis: { totalValue: 10000 } };
      portfolioServiceMock.getPortfolioDetails.mockResolvedValue(
        mockPortfolio as any,
      );

      // Act
      const res = await request(app)
        .get("/portfolio/details")
        .set("Authorization", `Bearer ${userToken}`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockPortfolio);
      expect(portfolioServiceMock.getPortfolioDetails).toHaveBeenCalledWith(
        userId,
      );
    });
  });
});
