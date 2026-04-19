import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {useProducts} from '../../feature/product/hooks/useProducts';
import ProductCard from '../components/productCard';

const HomePage = () => {
  const { handleGetAllProducts } = useProducts();
  const products = useSelector((state) => state.product.products);
  const isLoading = useSelector((state) => state.auth.isLoading);

  console.log(products);

  useEffect(() => {
    if (!products) {
      handleGetAllProducts();
    }
  }, [products, handleGetAllProducts]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Minimal Header */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-[#e8c97e] text-2xl font-serif tracking-widest uppercase">Snitch</h1>
        <div className="flex gap-4 text-sm text-[#888580] font-sans">
          <button className="hover:text-[#e8c97e] transition-colors">Cart</button>
          <button className="hover:text-[#e8c97e] transition-colors">Profile</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="flex justify-between items-end mb-8 animate-fade-up">
          <div>
            <h2 className="text-3xl font-serif text-[#f0ede8] mb-2">New Arrivals</h2>
            <p className="text-[#888580] font-sans text-sm">Discover our latest editorial collection</p>
          </div>
        </div>

        {/* Loading State or Content */}
        {isLoading && !products ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 border-2 border-[#e8c97e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#888580] font-sans">
            <p>No products available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;