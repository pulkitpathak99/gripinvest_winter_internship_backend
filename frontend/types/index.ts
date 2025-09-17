export interface Product {
  id: string;
  name: string;
  investmentType: string;
  annualYield: number;
  riskLevel: "low" | "moderate" | "high";
  tenureMonths: number;
  minInvestment: number;
  maxInvestment: number | null;
  description: string | null; // <-- ADD THIS LINE
}
