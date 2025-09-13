// backend/prisma/seed.ts
import { PrismaClient, InvestmentType, RiskAppetite } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  const adminEmail = 'admin@gripinvest.com';
  const adminPassword = 'AdminPassword123!'; // Use a strong password

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'ADMIN', // Explicitly set the role to ADMIN
        riskAppetite: 'moderate',
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log('Admin user already exists.');
  }

  await prisma.investmentProduct.createMany({
    data: [
      {
        name: 'Corporate Bond Series A',
        investmentType: InvestmentType.bond,
        tenureMonths: 24,
        annualYield: 8.5,
        riskLevel: RiskAppetite.low,
        minInvestment: 5000,
        maxInvestment: 1000000,
        description: 'Stable corporate bonds with a fixed return. Ideal for conservative investors.',
      },
      {
        name: 'Government Treasury Bond',
        investmentType: InvestmentType.bond,
        tenureMonths: 60,
        annualYield: 6.2,
        riskLevel: RiskAppetite.low,
        minInvestment: 10000,
        maxInvestment: 2000000,
        description: 'Government-backed long-term bonds for low-risk investors.',
      },
      {
        name: 'Municipal Development Bond',
        investmentType: InvestmentType.bond,
        tenureMonths: 48,
        annualYield: 7.1,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 2000,
        maxInvestment: 100000,
        description: 'Bond issued by municipalities to fund infrastructure projects.',
      },
      {
        name: 'Corporate Bond Series B',
        investmentType: InvestmentType.bond,
        tenureMonths: 36,
        annualYield: 9.3,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 10000,
        maxInvestment: 500000,
        description: 'High-yield corporate bonds with moderate risk.',
      },
      {
        name: 'High-Yield Junk Bond',
        investmentType: InvestmentType.bond,
        tenureMonths: 72,
        annualYield: 14.0,
        riskLevel: RiskAppetite.high,
        minInvestment: 50000,
        maxInvestment: 5000000,
        description: 'Risky bonds offering very high returns for aggressive investors.',
      },
      {
        name: 'Secure Fixed Deposit - 1 Year',
        investmentType: InvestmentType.fd,
        tenureMonths: 12,
        annualYield: 5.5,
        riskLevel: RiskAppetite.low,
        minInvestment: 1000,
        maxInvestment: 200000,
        description: 'Short-term FD with guaranteed returns.',
      },
      {
        name: 'Secure Fixed Deposit - 3 Years',
        investmentType: InvestmentType.fd,
        tenureMonths: 36,
        annualYield: 6.7,
        riskLevel: RiskAppetite.low,
        minInvestment: 5000,
        maxInvestment: 1000000,
        description: 'Safe FD with moderate returns for medium-term savings.',
      },
      {
        name: 'Senior Citizen FD',
        investmentType: InvestmentType.fd,
        tenureMonths: 60,
        annualYield: 7.5,
        riskLevel: RiskAppetite.low,
        minInvestment: 5000,
        maxInvestment: 500000,
        description: 'Higher interest FD plan tailored for senior citizens.',
      },
      {
        name: 'High-Return Fixed Deposit',
        investmentType: InvestmentType.fd,
        tenureMonths: 120,
        annualYield: 8.2,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 10000,
        maxInvestment: 2000000,
        description: 'Long-term FD with higher interest for moderate risk takers.',
      },
      {
        name: 'Index Mutual Fund',
        investmentType: InvestmentType.mf,
        tenureMonths: 60,
        annualYield: 11.2,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 1000,
        maxInvestment: 300000,
        description: 'Mutual fund tracking NIFTY 50 index.',
      },
      {
        name: 'Green Energy Mutual Fund',
        investmentType: InvestmentType.mf,
        tenureMonths: 48,
        annualYield: 12.0,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 5000,
        maxInvestment: 400000,
        description: 'Fund focusing on renewable energy sector investments.',
      },
      {
        name: 'Healthcare Sector Mutual Fund',
        investmentType: InvestmentType.mf,
        tenureMonths: 72,
        annualYield: 13.8,
        riskLevel: RiskAppetite.high,
        minInvestment: 5000,
        maxInvestment: 500000,
        description: 'High-growth potential mutual fund in healthcare companies.',
      },
      {
        name: 'Balanced Hybrid Mutual Fund',
        investmentType: InvestmentType.mf,
        tenureMonths: 36,
        annualYield: 9.5,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 2000,
        maxInvestment: 200000,
        description: 'Balanced fund with a mix of equity and debt instruments.',
      },
      {
        name: 'International Equity Mutual Fund',
        investmentType: InvestmentType.mf,
        tenureMonths: 84,
        annualYield: 15.0,
        riskLevel: RiskAppetite.high,
        minInvestment: 10000,
        maxInvestment: 1000000,
        description: 'Mutual fund investing in global equity markets.',
      },
      {
        name: 'Tech Growth ETF',
        investmentType: InvestmentType.etf,
        tenureMonths: 60,
        annualYield: 14.2,
        riskLevel: RiskAppetite.high,
        minInvestment: 1000,
        maxInvestment: 500000,
        description: 'ETF focused on high-growth technology sector stocks.',
      },
      {
        name: 'Banking Sector ETF',
        investmentType: InvestmentType.etf,
        tenureMonths: 48,
        annualYield: 12.5,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 2000,
        maxInvestment: 400000,
        description: 'ETF tracking performance of major banking companies.',
      },
      {
        name: 'Global Diversified ETF',
        investmentType: InvestmentType.etf,
        tenureMonths: 72,
        annualYield: 10.3,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 5000,
        maxInvestment: 2000000,
        description: 'ETF tracking global stock indices for diversified growth.',
      },
      {
        name: 'Real Estate REIT ETF',
        investmentType: InvestmentType.etf,
        tenureMonths: 96,
        annualYield: 9.0,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 10000,
        maxInvestment: 5000000,
        description: 'ETF investing in real estate investment trusts.',
      },
      {
        name: 'AI Innovation ETF',
        investmentType: InvestmentType.etf,
        tenureMonths: 84,
        annualYield: 16.2,
        riskLevel: RiskAppetite.high,
        minInvestment: 5000,
        maxInvestment: 1000000,
        description: 'ETF investing in companies leading AI innovation.',
      },
      {
        name: 'Commodities Basket Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 36,
        annualYield: 8.0,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 5000,
        maxInvestment: 200000,
        description: 'Diversified commodity investments including gold and oil.',
      },
      {
        name: 'Crypto Index Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 24,
        annualYield: 25.0,
        riskLevel: RiskAppetite.high,
        minInvestment: 1000,
        maxInvestment: 100000,
        description: 'High-risk crypto-based investment index fund.',
      },
      {
        name: 'Private Equity Growth Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 120,
        annualYield: 18.0,
        riskLevel: RiskAppetite.high,
        minInvestment: 50000,
        maxInvestment: 5000000,
        description: 'Fund investing in high-growth private companies.',
      },
      {
        name: 'Infrastructure Development Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 96,
        annualYield: 12.0,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 20000,
        maxInvestment: 2000000,
        description: 'Fund targeting infrastructure and public utility projects.',
      },
      {
        name: 'Gold Savings Scheme',
        investmentType: InvestmentType.other,
        tenureMonths: 60,
        annualYield: 6.5,
        riskLevel: RiskAppetite.low,
        minInvestment: 1000,
        maxInvestment: 100000,
        description: 'Scheme allowing monthly gold accumulation with small investments.',
      },
      {
        name: 'Agriculture Growth Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 48,
        annualYield: 11.0,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 5000,
        maxInvestment: 250000,
        description: 'Investment fund focused on agriculture and food tech.',
      },
      {
        name: 'Space Exploration Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 180,
        annualYield: 20.0,
        riskLevel: RiskAppetite.high,
        minInvestment: 100000,
        maxInvestment: 10000000,
        description: 'Speculative fund targeting space and aerospace startups.',
      },
      {
        name: 'Healthcare REIT',
        investmentType: InvestmentType.other,
        tenureMonths: 120,
        annualYield: 9.5,
        riskLevel: RiskAppetite.moderate,
        minInvestment: 50000,
        maxInvestment: 3000000,
        description: 'Real estate investment trust focused on healthcare facilities.',
      },
      {
        name: 'Climate Impact Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 84,
        annualYield: 13.5,
        riskLevel: RiskAppetite.high,
        minInvestment: 20000,
        maxInvestment: 1500000,
        description: 'Impact-driven fund supporting businesses with positive climate initiatives.',
      },
      {
        name: 'AI Startup Accelerator Fund',
        investmentType: InvestmentType.other,
        tenureMonths: 96,
        annualYield: 22.0,
        riskLevel: RiskAppetite.high,
        minInvestment: 50000,
        maxInvestment: 5000000,
        description: 'High-risk, high-return fund investing in AI startups.',
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
