// frontend/app/dashboard/products/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import InvestmentModal from "@/components/products/InvestmentModal";
import { Product } from "@/types";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  // Dynamically calculate the max yield from the fetched products
  const maxYield = useMemo(() => {
    if (products.length === 0) return 25; // A default max if no products are loaded
    const highestYield = Math.max(...products.map((p) => p.annualYield));
    return Math.ceil(highestYield / 5) * 5; // Round up to the nearest 5 for a clean slider
  }, [products]);

  // The full state for all filters
  const [filters, setFilters] = useState({
    type: "All",
    risk: "All",
    yieldRange: [0, maxYield],
  });

  // This effect ensures the filter's max range updates when products are loaded
  useEffect(() => {
    setFilters((f) => ({ ...f, yieldRange: [0, maxYield] }));
  }, [maxYield]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (key: "type" | "risk", value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleYieldChange = (newRange: number[]) => {
    setFilters((prev) => ({ ...prev, yieldRange: newRange }));
  };

  const handleAiRecommend = () => {
    if (user?.riskAppetite) {
      setFilters((prev) => ({ ...prev, risk: user.riskAppetite }));
      toast.info(
        `Showing products that match your "${user.riskAppetite}" risk appetite!`,
      );
    } else {
      toast.error(
        "Could not determine your risk appetite. Please set it in your profile.",
      );
    }
  };

  // The new handler to reset all filters to their default state
  const handleResetFilters = () => {
    setFilters({
      type: "All",
      risk: "All",
      yieldRange: [0, maxYield],
    });
    toast.info("Filters have been reset.");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const typeMatch =
        filters.type === "All" ||
        product.investmentType.toLowerCase() === filters.type.toLowerCase();
      const riskMatch =
        filters.risk === "All" || product.riskLevel === filters.risk;
      const yieldMatch =
        product.annualYield >= filters.yieldRange[0] &&
        product.annualYield <= filters.yieldRange[1];
      return typeMatch && riskMatch && yieldMatch;
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
    return (
      <div className="text-center text-gray-300">
        Loading Investment Products...
      </div>
    );
  }

  return (
    <div>
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onAiRecommend={handleAiRecommend}
        onYieldChange={handleYieldChange}
        onResetFilters={handleResetFilters}
        maxYield={maxYield}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <h3 className="text-xl font-semibold">No Products Found</h3>
          <p>
            Try adjusting your filters to find more investment opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link href={`/dashboard/products/${product.id}`} key={product.id}>
              <ProductCard
                product={product}
                onInvestClick={(e) => {
                  e.preventDefault();
                  setSelectedProduct(product);
                }}
              />
            </Link>
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
