// backend/src/api/services/dashboard.service.ts
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Initialize the Google Gemini client with your API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

async function getAiInsight(distribution: any[]): Promise<string> {
    if (distribution.length === 0) {
        return "You haven't made any investments yet. Explore our products to get started!";
    }

    const portfolioSummary = distribution.map(d => `${d.value}% in ${d.name}`).join(', ');
    const prompt = `
        Analyze the following investment portfolio distribution for a user on an investment platform.
        The user's portfolio consists of: ${portfolioSummary}.
        Provide a concise, encouraging, and actionable insight in 1-2 sentences. 
        Focus on diversification, risk, or potential opportunities for growth. 
        Do not use markdown or formatting.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Your portfolio is looking good! Keep an eye on market trends for new opportunities.";
    }
}

export const fetchDashboardSummary = async (userId: string) => {
    const investments = await prisma.investment.findMany({
        where: { userId: userId, status: 'active' },
        include: {
            product: true, // This correctly includes the InvestmentProduct model
        },
    });

    const totalValue = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);

    if (totalValue === 0) {
        return {
            totalValue: 0,
            valueChange: 0,
            assetDistribution: [],
            aiInsight: "You haven't made any investments yet. Explore our products to get started!",
            recentActivity: [],
        };
    }
    
    const distributionMap = new Map<string, number>();
    investments.forEach(inv => {
        // CORRECTED: from inv.product.investment_type to inv.product.investmentType
        const type = inv.product.investmentType;
        const currentAmount = distributionMap.get(type) || 0;
        distributionMap.set(type, currentAmount + Number(inv.amount));
    });

    const assetDistribution = Array.from(distributionMap.entries()).map(([name, value]) => ({
        name: name.toUpperCase(),
        value: parseFloat(((value / totalValue) * 100).toFixed(2)),
        color: name === 'bond' ? '#3b82f6' : name === 'etf' ? '#14b8a6' : '#f97316',
    }));
    
    const recentActivity = investments
        // CORRECTED: from b.invested_at and a.invested_at
        .sort((a, b) => new Date(b.investedAt).getTime() - new Date(a.investedAt).getTime())
        .slice(0, 5)
        .map(inv => ({
            id: inv.id,
            product: inv.product.name,
            // CORRECTED: from inv.product.investment_type
            type: inv.product.investmentType.toUpperCase(),
            status: inv.status,
            amount: Number(inv.amount),
        }));

    const aiInsight = await getAiInsight(assetDistribution);
    const valueChange = parseFloat((Math.random() * 2 - 1).toFixed(2));

    return {
        totalValue,
        valueChange,
        assetDistribution,
        aiInsight,
        recentActivity,
    };
};