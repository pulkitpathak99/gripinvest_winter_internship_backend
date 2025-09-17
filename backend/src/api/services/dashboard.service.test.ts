// backend/src/api/services/dashboard.service.test.ts

import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { fetchDashboardSummary } from "./dashboard.service";
import prismaClient from "../utils/prismaClient";
import { generateContentWithFallback } from "../utils/aiHelper";

// Mock Prisma and the AI Helper's named export
jest.mock("../utils/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock("../utils/aiHelper", () => ({
  __esModule: true,
  generateContentWithFallback: jest.fn(),
}));

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;
const generateContentWithFallbackMock =
  generateContentWithFallback as jest.Mock;

describe("Dashboard Service", () => {
  let mathRandomSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Math.random for predictable 'valueChange' calculation
    // Let's make it return 0.75, so valueChange will be (0.75 * 2 - 1) = 0.5
    mathRandomSpy = jest.spyOn(global.Math, "random").mockReturnValue(0.75);
  });

  afterEach(() => {
    // Restore the original Math.random function after each test
    mathRandomSpy.mockRestore();
  });

  describe("fetchDashboardSummary", () => {
    const userId = "user_with_investments";

    test("✅ should return full summary for a user with investments", async () => {
      // Arrange
      const mockInvestments = [
        {
          amount: 6000,
          investedAt: new Date("2025-09-10"),
          product: { investmentType: "bond", name: "Bond A" },
        },
        {
          amount: 4000,
          investedAt: new Date("2025-09-12"),
          product: { investmentType: "etf", name: "ETF B" },
        },
      ];
      prismaMock.investment.findMany.mockResolvedValue(mockInvestments as any);
      generateContentWithFallbackMock.mockResolvedValue("Mock AI Insight");

      // Act
      const result = await fetchDashboardSummary(userId);

      // Assert
      expect(result.totalValue).toBe(10000);
      expect(result.valueChange).toBe(0.5); // Based on Math.random mock

      expect(result.assetDistribution).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "BOND", value: 60.0 }),
          expect.objectContaining({ name: "ETF", value: 40.0 }),
        ]),
      );

      expect(result.recentActivity).toHaveLength(2);
      // Check sorting (most recent first)
      expect(result.recentActivity[0].product).toBe("ETF B");

      expect(result.aiInsight).toBe("Mock AI Insight");
      expect(generateContentWithFallbackMock).toHaveBeenCalledTimes(1);
    });

    test("✅ should return empty state for a user with no investments", async () => {
      // Arrange
      prismaMock.investment.findMany.mockResolvedValue([]);

      // Act
      const result = await fetchDashboardSummary("new_user_id");

      // Assert
      expect(result.totalValue).toBe(0);
      expect(result.assetDistribution).toEqual([]);
      expect(result.recentActivity).toEqual([]);
      expect(result.aiInsight).toBe(
        "You haven't made any investments yet. Explore our products to get started!",
      );

      // Ensure AI helper is not called for new users
      expect(generateContentWithFallbackMock).not.toHaveBeenCalled();
    });

    test("✅ should return fallback AI insight when generation fails", async () => {
      // Arrange
      const mockInvestments = [
        {
          amount: 1000,
          investedAt: new Date(),
          product: { investmentType: "bond", name: "Bond A" },
        },
      ];
      prismaMock.investment.findMany.mockResolvedValue(mockInvestments as any);
      generateContentWithFallbackMock.mockRejectedValue(
        new Error("AI Service Down"),
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const result = await fetchDashboardSummary(userId);

      // Assert
      expect(result.aiInsight).toBe(
        "Your portfolio is looking good! Keep an eye on market trends for new opportunities.",
      );
      expect(generateContentWithFallbackMock).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
