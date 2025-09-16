import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ProductService } from './product.service';
import prismaClient from '../utils/prismaClient';
import { generateContentWithFallback } from '../utils/aiHelper';

jest.mock('../utils/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock('../utils/aiHelper', () => ({
  __esModule: true,
  generateContentWithFallback: jest.fn(),
}));

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;
const generateContentWithFallbackMock = generateContentWithFallback as jest.Mock;

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
    productService = new ProductService();
  });

  describe('createProduct', () => {
    // Define the variable here
    let productData: { name: string; investmentType: string; annualYield: number; riskLevel: string; tenureMonths: number };

    // Use beforeEach to reset the data before every test in this block
    beforeEach(() => {
      productData = { name: 'Test Bond', investmentType: 'bond', annualYield: 5, riskLevel: 'low', tenureMonths: 24 };
    });

    test('✅ should create a product directly if description is provided', async () => {
      const dataWithDesc = { ...productData, description: 'A solid description.' };
      await productService.createProduct(dataWithDesc);

      expect(generateContentWithFallbackMock).not.toHaveBeenCalled();
      expect(prismaMock.investmentProduct.create).toHaveBeenCalledWith({ data: dataWithDesc });
    });

    test('✅ should generate a description if one is not provided', async () => {
      const mockDescription = 'AI Generated Description';
      generateContentWithFallbackMock.mockResolvedValue(mockDescription);

      await productService.createProduct(productData);

      expect(generateContentWithFallbackMock).toHaveBeenCalledTimes(1);
      expect(prismaMock.investmentProduct.create).toHaveBeenCalledWith({
        data: { ...productData, description: mockDescription },
      });
    });
    
    test('✅ should use a fallback description if AI generation fails', async () => {
      generateContentWithFallbackMock.mockRejectedValue(new Error('AI failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await productService.createProduct(productData);
      
      const expectedFallbackDesc = `This is a bond named "Test Bond" with a risk level of low. It offers an annual yield of 5% over a period of 24 months.`;
      
      expect(generateContentWithFallbackMock).toHaveBeenCalledTimes(1);
      expect(prismaMock.investmentProduct.create).toHaveBeenCalledWith({
        data: { ...productData, description: expectedFallbackDesc },
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Simple CRUD methods', () => {
    test('✅ getAllProducts should call prisma.findMany', async () => {
      await productService.getAllProducts();
      expect(prismaMock.investmentProduct.findMany).toHaveBeenCalledTimes(1);
    });

    test('✅ getProductById should call prisma.findUnique', async () => {
      const productId = 'prod_123';
      await productService.getProductById(productId);
      expect(prismaMock.investmentProduct.findUnique).toHaveBeenCalledWith({ where: { id: productId } });
    });

    test('✅ updateProduct should call prisma.update', async () => {
      const productId = 'prod_123';
      const updateData = { name: 'Updated Name' };
      await productService.updateProduct(productId, updateData);
      expect(prismaMock.investmentProduct.update).toHaveBeenCalledWith({ where: { id: productId }, data: updateData });
    });

    test('✅ deleteProduct should call prisma.delete', async () => {
      const productId = 'prod_123';
      await productService.deleteProduct(productId);
      expect(prismaMock.investmentProduct.delete).toHaveBeenCalledWith({ where: { id: productId } });
    });
  });

  describe('AI Methods', () => {
    const productId = 'prod_123';
    const mockProduct = { id: productId, name: 'Test ETF' } as any;

    test('✅ getAIAnalysis should return parsed JSON on success', async () => {
      const mockAnalysis = { pros: ['Diversified'], cons: ['Market risk'] };
      const rawJsonResponse = '```json\n' + JSON.stringify(mockAnalysis) + '\n```';
      
      prismaMock.investmentProduct.findUnique.mockResolvedValue(mockProduct);
      generateContentWithFallbackMock.mockResolvedValue(rawJsonResponse);

      const result = await productService.getAIAnalysis(productId);
      
      expect(result).toEqual(mockAnalysis);
      expect(prismaMock.investmentProduct.findUnique).toHaveBeenCalledWith({ where: { id: productId } });
    });

    test('❌ getAIAnalysis should throw an error if product not found', async () => {
      prismaMock.investmentProduct.findUnique.mockResolvedValue(null);
      await expect(productService.getAIAnalysis(productId)).rejects.toThrow('Product not found');
    });

    test('✅ getAIAnalysis should return fallback data if AI fails', async () => {
      prismaMock.investmentProduct.findUnique.mockResolvedValue(mockProduct);
      generateContentWithFallbackMock.mockRejectedValue(new Error('AI failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await productService.getAIAnalysis(productId);
      
      expect(result).toEqual({
        pros: ["Matches market standards", "Offers steady returns"],
        cons: ["Market volatility can affect performance", "Consider long-term goals"],
      });

      consoleSpy.mockRestore();
    });
  });
});