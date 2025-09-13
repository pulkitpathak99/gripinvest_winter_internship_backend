// backend/src/api/services/product.service.ts
import { PrismaClient, InvestmentProduct } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// A function to safely get the AI model instance only when needed
async function getModelInstance() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. AI features will be disabled.");
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
    return genAI.getGenerativeModel({ model: modelName });
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
    return null;
  }
}

// Helper function to generate a product description with AI
async function generateDescription(product: any): Promise<string> {
  const model = await getModelInstance();
  if (!model) { // If model failed to initialize, return fallback
    return `This is a ${product.investmentType} named "${product.name}" with a risk level of ${product.riskLevel}. It offers an annual yield of ${product.annualYield}% over a period of ${product.tenureMonths} months.`;
  }

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
    const result = await model.generateContent(prompt);
    return (await result.response).text().trim();
  } catch (error) {
    console.error("AI description generation failed:", error);
    // Fallback to a simple, structured description if AI fails
    return `This is a ${product.investmentType} named "${product.name}" with a risk level of ${product.riskLevel}. It offers an annual yield of ${product.annualYield}% over a period of ${product.tenureMonths} months.`;
  }
}
// ... the rest of your ProductService class


export class ProductService {
  async getAllProducts(): Promise<InvestmentProduct[]> {
    return prisma.investmentProduct.findMany();
  }

  async generateAIDescription(data: { name: string; investmentType: string; annualYield: number; riskLevel: string; tenureMonths: number }): Promise<{ description: string }> {
    const description = await generateDescription(data);
    return { description };
  }

  async getProductById(id: string): Promise<InvestmentProduct | null> {
    return prisma.investmentProduct.findUnique({
      where: { id },
    });
  }

  async createProduct(data: any): Promise<InvestmentProduct> {
    if (!data.description || data.description.length < 10) {
      data.description = await generateDescription(data);
    }
    return prisma.investmentProduct.create({ data });
  }


  async updateProduct(id: string, data: Partial<InvestmentProduct>): Promise<InvestmentProduct> {
    return prisma.investmentProduct.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<InvestmentProduct> {
    return prisma.investmentProduct.delete({
      where: { id },
    });
  }
}
