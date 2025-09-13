// frontend/app/dashboard/products/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { useAuth } from '@/context/AuthContext'; // <-- Import useAuth

// Import components
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import InvestmentModal from '@/components/InvestmentModal';

// Product interface remains the same
interface Product {
  id: string;
  name: string;
  investmentType: string;
  annualYield: number;
  riskLevel: 'low' | 'moderate' | 'high';
  tenureMonths: number;
  minInvestment: number;
  maxInvestment?: number | null;
}

export default function ProductsPage() {
  const { user } = useAuth(); // <-- Get user for AI recommendation
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  // --- NEW: State for filters ---
  const [filters, setFilters] = useState({
    type: 'All',
    risk: 'All',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- NEW: Handler for filter changes ---
  const handleFilterChange = (key: 'type' | 'risk', value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  // --- NEW: Handler for AI Recommendation button ---
  const handleAiRecommend = () => {
    if (user?.riskAppetite) {
      setFilters(prev => ({ ...prev, risk: user.riskAppetite}));
      toast.info(`Showing products that match your "${user.riskAppetite}" risk appetite!`);
    } else {
      toast.error("Could not determine your risk appetite. Please set it in your profile.");
    }
  };

  // --- NEW: Memoized filtering logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const typeMatch = filters.type === 'All' || product.investmentType.toLowerCase() === filters.type.toLowerCase();
      const riskMatch = filters.risk === 'All' || product.riskLevel === filters.risk; 
      return typeMatch && riskMatch ;
    });
  }, [products, filters]);

  const handleInvestmentSuccess = () => {
    setSelectedProduct(null);
    toast.success("Investment successful! 🎉 Your portfolio is updated.");
    setTimeout(() => {
      router.push("/dashboard/portfolio");
    }, 1200);
  };

  if (loading) {
    return <div className="text-center text-gray-300">Loading Investment Products...</div>;
  }
  
  return (
    <div>
      {/* Pass state and handlers down to the filter component */}
      <ProductFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onAiRecommend={handleAiRecommend}
      />
      
      {/* If no products match, show a message */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p>Try adjusting your filters to find more investment opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map over the filtered list, not the original one */}
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onInvestClick={() => setSelectedProduct(product)} 
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <InvestmentModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  );
}