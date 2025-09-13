// backend/src/api/validation/product.validation.ts
import { z } from 'zod';

// Base schema with all the fields from your form
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  investmentType: z.enum(['bond', 'etf', 'fd', 'mf', 'other']),
  tenureMonths: z.number().int().positive("Tenure must be a positive number of months"),
  annualYield: z.number().positive("Annual yield must be a positive number"),
  riskLevel: z.enum(['low', 'moderate', 'high']),
  minInvestment: z.number().positive("Minimum investment must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters long").optional(),
});

// Schema for creating a product (all fields are required)
export const createProductSchema = productSchema;

// Schema for updating a product (all fields are optional)
export const updateProductSchema = productSchema.partial();