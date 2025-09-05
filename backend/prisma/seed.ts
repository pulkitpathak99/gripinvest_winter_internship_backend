// backend/prisma/seed.ts
import { PrismaClient, InvestmentType, RiskAppetite } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.investmentProduct.createMany({
    data: [
      {
        name: 'Corporate Bonds Series A',
        investmentType: InvestmentType.bond,
        tenureMonths: 24,
        annualYield: 8.5,
        riskLevel: RiskAppetite.low,
        minInvestment: 5000,
        description: 'Stable corporate bonds with a fixed return. Ideal for conservative investors.',
      },
      {
        name: 'High-Growth Tech ETF',
        investmentType: InvestmentType.etf,
        tenureMonths: 60,
        annualYield: 14.2,
        riskLevel: RiskAppetite.high,
        minInvestment: 1000,
        description: 'An exchange-traded fund focused on high-growth technology sector stocks.',
      },
      {
        name: 'Secure Fixed Deposit',
        investmentType: InvestmentType.fd,
        tenureMonths: 36,
        annualYield: 7.1,
        riskLevel: RiskAppetite.low,
        minInvestment: 10000,
        description: 'A secure fixed deposit with a guaranteed interest rate.',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });