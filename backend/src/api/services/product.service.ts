//backend/src/api/services/product.service.ts

import { PrismaClient, InvestmentProduct } from '@prisma/client';
import { generateContentWithFallback } from '../utils/aiHelper'; // <-- Import our new helper

const prisma = new PrismaClient();

// This helper function now uses the centralized AI logic
async function generateDescription(product: any): Promise<string> {
  const prompt = `
    Generate a compelling, one-paragraph product description for an investment product with the following details:
    - Name: ${product.name}
    - Type: ${product.investmentType}
    - Annual Yield: ${product.annualYield}%
    - Risk Level: ${product.riskLevel}
    - Tenure: ${product.tenureMonths} months
    The description should be professional, encouraging, and highlight the key benefits for a potential investor.
  `;

  try {
    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("AI description generation failed:", error);
    // Fallback to a simple, structured description if AI fails
    return `This is a ${product.investmentType} named "${product.name}" with a risk level of ${product.riskLevel}. It offers an annual yield of ${product.annualYield}% over a period of ${product.tenureMonths} months.`;
  }
}

export class ProductService {
  async getAllProducts(): Promise<InvestmentProduct[]> {
    return prisma.investmentProduct.findMany();
  }

  async getAIAnalysis(productId: string): Promise<{ pros: string[]; cons: string[] }> {
  const product = await prisma.investmentProduct.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const prompt = `
    Analyze this investment product: ${JSON.stringify(product)}.
    Provide a balanced view by identifying 2-3 potential "pros" (advantages) and 2-3 potential "cons" (risks or disadvantages) for an investor.
    Format the output as a JSON object with two keys: "pros" (an array of strings) and "cons" (an array of strings).
  `;

  try {
    const rawResponse = await generateContentWithFallback(prompt);
    const cleanedText = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Analysis generation failed:", error);
    // Fallback if AI or parsing fails
    return {
      pros: ["Matches market standards", "Offers steady returns"],
      cons: ["Market volatility can affect performance", "Consider long-term goals"],
    };
  }
}

  async generateAIDescription(data: { name: string; investmentType: string; annualYield: number; riskLevel: string; tenureMonths: number }): Promise<{ description: string }> {
    const description = await generateDescription(data);
    return { description };
  }

  async getProductById(id: string): Promise<InvestmentProduct | null> {
    return prisma.investmentProduct.findUnique({ where: { id } });
  }

  async createProduct(data: any): Promise<InvestmentProduct> {
    if (!data.description || data.description.length < 10) {
      data.description = await generateDescription(data);
    }
    return prisma.investmentProduct.create({ data });
  }

  async updateProduct(id: string, data: Partial<InvestmentProduct>): Promise<InvestmentProduct> {
    return prisma.investmentProduct.update({ where: { id }, data });
  }

  async deleteProduct(id: string): Promise<InvestmentProduct> {
    return prisma.investmentProduct.delete({ where: { id } });
  }
}