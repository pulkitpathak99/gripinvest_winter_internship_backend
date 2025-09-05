// backend/src/api/schemas/product.schema.ts
import { z } from 'zod';

export const InvestmentTypeEnum = z.enum(['bond', 'etf', 'fd']);
export const RiskAppetiteEnum = z.enum(['low', 'medium', 'high']);

export const ProductSchema = z.object({
  name: z.string().min(3),
  investmentType: InvestmentTypeEnum,
  tenureMonths: z.number().positive(),
  annualYield: z.number().min(0).max(100),
  riskLevel: RiskAppetiteEnum,
  minInvestment: z.number().positive(),
  description: z.string().min(10),
});

export type ProductInput = z.infer<typeof ProductSchema>;
