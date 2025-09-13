// backend/src/api/services/profile.service.ts
import { PrismaClient, RiskAppetite } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


/**
 * Fetches a user's profile data, excluding the password hash.
 */
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      riskAppetite: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Updates a user's profile data.
 */
export const updateUserProfile = async (userId: string, data: { firstName?: string; lastName?: string; riskAppetite?: RiskAppetite }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      riskAppetite: data.riskAppetite,
    },
    select: { // Return the updated data safely
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      riskAppetite: true,
    },
  });
  return user;
};

export const changeUserPassword = async (userId: string, oldPass: string, newPass: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found.');
  }

  const isPasswordValid = await bcrypt.compare(oldPass, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Incorrect current password.');
  }

  const newPasswordHash = await bcrypt.hash(newPass, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
};

/**
 * Generates AI-powered product recommendations based on risk appetite.
 */
export const getAiProfileRecommendations = async (riskAppetite: RiskAppetite) => {
  // Find products that match the user's risk level
  const products = await prisma.investmentProduct.findMany({
    where: {
      riskLevel: { in: riskAppetite === 'high' ? ['high', 'moderate'] : (riskAppetite === 'moderate' ? ['moderate', 'low'] : ['low']) }
    },
    orderBy: { annualYield: 'desc' },
    take: 5,
  });

  if (products.length === 0) {
    return {
      summary: "No specific products match your profile right now, but check out our general listings!",
      products: [],
    };
  }

  const productSummary = products.map(p => `- ${p.name} (Yield: ${p.annualYield}%, Type: ${p.investmentType}, Risk: ${p.riskLevel})`).join('\n');

  const prompt = `
    A user has a "${riskAppetite}" risk appetite. Based on the following available products, provide a short, encouraging summary (1 sentence) and then list the top 2-3 most suitable products for them.
    Available Products:
    ${productSummary}

    Format the output as a JSON object with two keys: "summary" (string) and "products" (an array of product names as strings). Example: {"summary": "...", "products": ["Product A", "Product B"]}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error with Gemini API in profile service:", error);
    // Fallback if AI fails
    return {
        summary: `Here are some top products matching your ${riskAppetite} profile.`,
        products: products.slice(0, 3).map(p => p.name)
    };
  }
};
 