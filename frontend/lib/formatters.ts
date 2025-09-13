// frontend/lib/formatters.ts
export function formatCurrency(
  amount: number | bigint,
  currency: string = 'INR' 
): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}