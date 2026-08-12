import React, { useState, useEffect } from 'react';
import { getProducts, fetchProducts } from '../services/catalogService';
import { ProductCard } from '../components/cards/ProductCard';
import { ClothingCategory, Product } from '../types';

interface ClothingCataloguePageProps {
  initialFilter?: ClothingCategory;
  onNavigate: (path: string) => void;
  onInquire: (product: Product) => void;
}

export const ClothingCataloguePage: React.FC<ClothingCataloguePageProps> = ({
  initialFilter = 'All',
  onNavigate,
  onInquire,
}) => {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>(initialFilter);
  const [products, setProducts] = useState<Product[]>(() => getProducts());

  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((prods) => {
      if (isMounted && prods.length) {
        setProducts(prods);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories: ClothingCategory[] = [
    'All',
    'Dresses',
    'Two-Piece',
    'Traditional',
    'Occasion Wear',
    'New Arrivals',
    'Featured',
  ];

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'New Arrivals') return product.newArrival;
    if (activeCategory === 'Featured') return product.featured;
    return product.clothingCategory === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#E8DED0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
            Clothing Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171513] mt-1">
            Ready-to-Wear & Bespoke
          </h1>
        </div>

        <p className="text-xs text-[#171513]/70 font-light max-w-md font-serif italic">
          Every piece is handcrafted in Lagos. Inquire for bespoke measurements and color customization.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8DED0]/50">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 px-4 text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-[#171513] text-[#F7F3EC]'
                  : 'bg-[#F7F3EC] text-[#171513]/70 border border-[#E8DED0] hover:border-[#171513] hover:text-[#171513]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={(id) => onNavigate(`/product/${id}`)}
              onInquire={onInquire}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#E8DED0]/20 border border-[#E8DED0] p-8 space-y-3">
          <p className="font-serif italic text-xl text-[#171513]">
            No pieces currently listed in this category.
          </p>
          <p className="text-xs text-[#171513]/70 font-light">
            We offer bespoke custom sewing for any style preference.
          </p>
          <button
            onClick={() => onNavigate('/custom-sewing')}
            className="mt-2 py-2.5 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors"
          >
            Start Custom Request
          </button>
        </div>
      )}
    </div>
  );
};
