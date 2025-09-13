"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import ProductFormModal from '@/components/admin/ProductFormModal'; // Import the modal

// Expanded Product interface to match the form
interface Product {
  id: string;
  name: string;
  investmentType: 'bond' | 'etf' | 'fd' | 'mf' | 'other';
  annualYield: number;
  riskLevel: 'low' | 'moderate' | 'high';
  tenureMonths: number;
  minInvestment: number;
  description: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State to control the modal's visibility and data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Handlers for Modal ---
  const handleCreate = () => {
    setEditingProduct(null); // Clear any previous editing data
    setIsModalOpen(true);
  };
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Set the product to be edited
    setIsModalOpen(true);
  };
  
  const handleSuccess = () => {
    setIsModalOpen(false); // Close the modal
    fetchProducts();     // Refresh the product list to show changes
  };
  
  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success("Product deleted successfully.");
        fetchProducts(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete product.");
      }
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <>
      <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Manage Products</h2>
          <button 
            onClick={handleCreate} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            <PlusCircle size={18} />
            Create Product
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-400">Name</th>
              <th className="p-3 text-sm font-medium text-gray-400">Type</th>
              <th className="p-3 text-sm font-medium text-gray-400">Yield</th>
              <th className="p-3 text-sm font-medium text-gray-400">Risk</th>
              <th className="p-3 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="p-3 text-white font-medium">{product.name}</td>
                <td className="p-3 text-gray-300">{product.investmentType.toUpperCase()}</td>
                <td className="p-3 text-gray-300">{product.annualYield}%</td>
                <td className="p-3 text-gray-300 capitalize">{product.riskLevel}</td>
                <td className="p-3">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditionally render the modal based on isModalOpen state */}
      {isModalOpen && (
        <ProductFormModal
          initialData={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}