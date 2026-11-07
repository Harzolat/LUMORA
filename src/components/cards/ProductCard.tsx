import React from 'react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { MessageCircle, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onView: (id: string) => void;
  onInquire: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onInquire,
}) => {
  return (
    <div className="group flex flex-col bg-[#F7F3EC] border border-[#E8DED0]/60 hover:border-[#A88963]/50 transition-all duration-500 overflow-hidden">
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          aspectRatio="portrait"
          imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
          onClick={() => onView(product.id)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.newArrival && (
            <span className="bg-[#171513] text-[#F7F3EC] text-[9px] uppercase tracking-[0.25em] font-medium py-1 px-2.5 shadow-sm">
              New Arrival
            </span>
          )}
          {product.availability === 'Made to Order' && (
            <span className="bg-[#A88963] text-white text-[9px] uppercase tracking-[0.25em] font-medium py-1 px-2.5 shadow-sm">
              Bespoke Order
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#171513]/80 via-[#171513]/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
          <button
            onClick={() => onView(product.id)}
            className="flex-1 py-2 px-3 bg-[#F7F3EC] text-[#171513] text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#171513] hover:text-[#F7F3EC] transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3 h-3" />
            <span>View Piece</span>
          </button>
          <button
            onClick={() => onInquire(product)}
            className="py-2 px-3 bg-[#A88963] text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#8C6D48] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#A88963] font-medium mb-1">
            <span>{product.clothingCategory}</span>
            <span>{product.availability}</span>
          </div>

          <h3
            onClick={() => onView(product.id)}
            className="font-serif text-lg text-[#171513] group-hover:text-[#A88963] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {product.subtitle && (
            <p className="text-xs text-[#171513]/60 font-light mt-0.5 line-clamp-1">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-2 border-t border-[#E8DED0]/60 flex items-center justify-between text-xs">
          <button
            onClick={() => onView(product.id)}
            className="text-[11px] uppercase tracking-[0.2em] text-[#171513] font-medium hover:text-[#A88963] transition-colors flex items-center gap-1"
          >
            <span>View Piece</span>
            <span className="text-[#A88963]">&rarr;</span>
          </button>

          <button
            onClick={() => onInquire(product)}
            className="text-[11px] uppercase tracking-[0.15em] text-[#A88963] font-medium hover:underline underline-offset-4 transition-all"
          >
            Ask About This Piece
          </button>
        </div>
      </div>
    </div>
  );
};
