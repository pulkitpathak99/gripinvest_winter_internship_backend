// backend/src/api/validation/product.validation.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  investmentType: z.enum(['bond', 'etf', 'fd']), // matches your Prisma enum
  tenureMonths: z.number().int().positive(),
  annualYield: z.number().positive(),
  riskLevel: z.enum(['low', 'medium', 'high']), // matches your Prisma enum
  minInvestment: z.number().int().positive(),
  maxInvestment: z.number().int().positive().optional(), // added this line
  description: z.string().min(10, 'Description must be at least 10 characters long'),
});

export const updateProductSchema = createProductSchema.partial();
