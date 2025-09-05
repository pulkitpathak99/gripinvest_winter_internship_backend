// backend/src/api/services/investment.service.ts
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const createInvestment = async (userId: string, productId: string, amount: number) => {
  const product = await prisma.investmentProduct.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error('Product not found');
  }

  // Business Rule: Check min/max investment
  if (new Decimal(amount).lessThan(product.minInvestment)) {
    throw new Error(`Investment amount is less than the minimum of ${product.minInvestment}`);
  }
  if (product.maxInvestment && new Decimal(amount).greaterThan(product.maxInvestment)) {
    throw new Error(`Investment amount exceeds the maximum of ${product.maxInvestment}`);
  }

  // Calculate maturity date and expected return
  const investedAt = new Date();
  const maturityDate = new Date(investedAt);
  maturityDate.setMonth(investedAt.getMonth() + product.tenureMonths);

  const expectedReturn = new Decimal(amount)
    .mul(product.annualYield.div(100))
    .mul(product.tenureMonths / 12);

  const investment = await prisma.investment.create({
    data: {
      userId,
      productId,
      amount,
      investedAt,
      maturityDate,
      expectedReturn,
    },
  });

  return investment;
};