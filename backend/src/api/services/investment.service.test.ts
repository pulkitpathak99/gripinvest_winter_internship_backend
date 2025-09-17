// backend/src/api/services/investment.service.test.ts

import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Decimal } from "@prisma/client/runtime/library";
import { createInvestment, cancelInvestment } from "./investment.service";
import prismaClient from "../utils/prismaClient";

// Tell Jest to mock the prismaClient module
jest.mock("../utils/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// Cast the mocked client to our extended mock type for type safety
const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

// Reset mocks before each test to ensure test isolation
beforeEach(() => {
  prismaMock.investmentProduct.findUnique.mockReset();
  prismaMock.investment.create.mockReset();
  prismaMock.investment.findFirst.mockReset();
  prismaMock.investment.update.mockReset();
});

// Main test suite for the investment service
describe("Investment Service", () => {
  // Test suite for the createInvestment function
  describe("createInvestment", () => {
    // Test case setup: mock data
    const mockProduct: any = {
      id: "prod_1",
      minInvestment: new Decimal(1000),
      maxInvestment: new Decimal(10000),
      annualYield: new Decimal(8.5),
      tenureMonths: 12,
    };

    const userId = "user_1";
    const amount = 5000;

    test("✅ should create an investment successfully", async () => {
      // Arrange: mock the DB call to find a product
      prismaMock.investmentProduct.findUnique.mockResolvedValue(mockProduct);

      // Act: call the function we are testing
      await createInvestment(userId, mockProduct.id, amount);

      // Assert: check if prisma.investment.create was called with the correct data
      expect(prismaMock.investment.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.investment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId,
            productId: mockProduct.id,
            amount,
            expectedReturn: new Decimal(425), // 5000 * (8.5 / 100) * (12 / 12)
          }),
        }),
      );
    });

    test("❌ should throw an error if product is not found", async () => {
      // Arrange: mock the DB call to return null
      prismaMock.investmentProduct.findUnique.mockResolvedValue(null);

      // Act & Assert: expect the function to reject with a specific error
      await expect(
        createInvestment(userId, "prod_invalid", amount),
      ).rejects.toThrow("Product not found");
    });

    test("❌ should throw an error if amount is below minimum", async () => {
      // Arrange: no need to mock findUnique as it's not reached, use the same mockProduct
      const lowAmount = 500;
      prismaMock.investmentProduct.findUnique.mockResolvedValue(mockProduct);

      // Act & Assert
      await expect(
        createInvestment(userId, mockProduct.id, lowAmount),
      ).rejects.toThrow(
        `Investment amount is less than the minimum of ${mockProduct.minInvestment}`,
      );
    });

    test("❌ should throw an error if amount is above maximum", async () => {
      // Arrange
      const highAmount = 15000;
      prismaMock.investmentProduct.findUnique.mockResolvedValue(mockProduct);

      // Act & Assert
      await expect(
        createInvestment(userId, mockProduct.id, highAmount),
      ).rejects.toThrow(
        `Investment amount exceeds the maximum of ${mockProduct.maxInvestment}`,
      );
    });
  });

  // Test suite for the cancelInvestment function
  describe("cancelInvestment", () => {
    const userId = "user_1";
    const investmentId = "inv_1";

    test("✅ should cancel an active investment within 24 hours", async () => {
      // Arrange: create a mock investment made just now
      const mockInvestment: any = {
        id: investmentId,
        userId,
        status: "active",
        investedAt: new Date(),
      };
      prismaMock.investment.findFirst.mockResolvedValue(mockInvestment);

      // Act
      await cancelInvestment(investmentId, userId);

      // Assert
      expect(prismaMock.investment.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.investment.update).toHaveBeenCalledWith({
        where: { id: investmentId },
        data: { status: "cancelled" },
      });
    });

    test("❌ should throw an error if investment is not found", async () => {
      // Arrange
      prismaMock.investment.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(cancelInvestment(investmentId, userId)).rejects.toThrow(
        "Investment not found or you do not have permission to cancel it.",
      );
    });

    test("❌ should throw an error if investment is not active", async () => {
      // Arrange
      const mockInvestment: any = {
        id: investmentId,
        userId,
        status: "matured", // not 'active'
        investedAt: new Date(),
      };
      prismaMock.investment.findFirst.mockResolvedValue(mockInvestment);

      // Act & Assert
      await expect(cancelInvestment(investmentId, userId)).rejects.toThrow(
        "Only active investments can be cancelled.",
      );
    });

    test("❌ should throw an error if cancellation period has expired", async () => {
      // Arrange: create a mock investment made 2 days ago
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2);
      const mockInvestment: any = {
        id: investmentId,
        userId,
        status: "active",
        investedAt: oldDate,
      };
      prismaMock.investment.findFirst.mockResolvedValue(mockInvestment);

      // Act & Assert
      await expect(cancelInvestment(investmentId, userId)).rejects.toThrow(
        "Cancellation period has expired (24 hours).",
      );
    });
  });
});
