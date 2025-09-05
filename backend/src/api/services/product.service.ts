// backend/src/api/services/product.service.ts
import { PrismaClient, InvestmentProduct } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts(): Promise<InvestmentProduct[]> {
    return prisma.investmentProduct.findMany();
  }

  async getProductById(id: string): Promise<InvestmentProduct | null> {
    return prisma.investmentProduct.findUnique({
      where: { id },
    });
  }

  async createProduct(data: Omit<InvestmentProduct, 'id'>): Promise<InvestmentProduct> {
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
