// backend/src/api/services/investment.service.ts

import prisma  from '../utils/prismaClient';
import { Decimal } from '@prisma/client/runtime/library';

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

export const cancelInvestment = async (investmentId: string, userId: string) => {
  const investment = await prisma.investment.findFirst({
    where: { id: investmentId, userId },
  });

  if (!investment) {
    throw new Error('Investment not found or you do not have permission to cancel it.');
  }

  if (investment.status !== 'active') {
    throw new Error('Only active investments can be cancelled.');
  }

  // Business Rule: 24-hour cool-off period
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (new Date().getTime() - new Date(investment.investedAt).getTime() > twentyFourHours) {
    throw new Error('Cancellation period has expired (24 hours).');
  }

  return prisma.investment.update({
    where: { id: investmentId },
    data: { status: 'cancelled' },
  });
};