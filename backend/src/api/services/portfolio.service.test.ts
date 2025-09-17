// backend/src/api/services/portfolio.service.test.ts

import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { getPortfolioDetails } from "./portfolio.service";
import prismaClient from "../utils/prismaClient";

// Mock Prisma
jest.mock("../utils/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

describe("Portfolio Service", () => {
  let mathRandomSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    mathRandomSpy = jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  describe("getPortfolioDetails", () => {
    test("✅ should calculate portfolio details correctly with mock data", async () => {
      const userId = "user_1";
      const mockInvestments = [
        {
          id: "inv_1",
          amount: 10000,
          status: "active",
          investedAt: new Date(),
          expectedReturn: 800,
          maturityDate: new Date(),
          product: { name: "Corporate Bond A", investmentType: "bond" },
        },
        {
          id: "inv_2",
          amount: 5000,
          status: "active",
          investedAt: new Date(),
          expectedReturn: 400,
          maturityDate: new Date(),
          product: { name: "Tech ETF", investmentType: "etf" },
        },
        {
          id: "inv_3",
          amount: 2000,
          status: "active",
          investedAt: new Date(),
          expectedReturn: 160,
          maturityDate: new Date(),
          product: { name: "Corporate Bond B", investmentType: "bond" },
        },
      ];

      prismaMock.investment.findMany.mockResolvedValue(mockInvestments as any);

      // Act: Call the service function
      const result = await getPortfolioDetails(userId);

      // Assert: Verify calculations based on our predictable Math.random() = 0.5
      // The random factor is 1 + (0.5 - 0.4) * 0.2 = 1.02
      // The performance chart random factor is (0.5 - 0.45) * 0.05 = 0.0025

      // 1. KPIs
      expect(result.kpis.totalInvested).toBe(17000); // 10000 + 5000 + 2000
      expect(result.kpis.totalValue).toBe(17340); // (17000 * 1.02)
      expect(result.kpis.overallGain).toBe(340); // 17340 - 17000

      // 2. Asset Allocation
      expect(result.assetAllocation).toHaveLength(2);
      const bondAllocation = result.assetAllocation.find(
        (a) => a.name === "BOND",
      );
      const etfAllocation = result.assetAllocation.find(
        (a) => a.name === "ETF",
      );
      expect(bondAllocation?.value).toBe(12240); // (10000 + 2000) * 1.02
      expect(etfAllocation?.value).toBe(5100); // 5000 * 1.02

      // 3. Investment List
      expect(result.investmentList).toHaveLength(3);
      expect(result.investmentList[0].currentValue).toBe(10200); // 10000 * 1.02

      // 4. Performance Data (just check structure and length)
      expect(result.performanceData["1M"]).toHaveLength(2);
      expect(result.performanceData["6M"]).toHaveLength(7);
      expect(result.performanceData["1Y"]).toHaveLength(12);
    });
  });
});
