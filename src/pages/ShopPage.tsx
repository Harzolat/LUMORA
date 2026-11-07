import React from 'react';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

interface ShopPageProps {
  onNavigate: (path: string, extra?: { filter?: string }) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
          Editorial Catalogue
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#171513]">
          The Lumora Collections
        </h1>
        <p className="text-sm font-light text-[#171513]/80 leading-relaxed font-serif italic">
          Select a category to explore our contemporary ready-to-wear garments, bespoke traditional attire, or curated fabric archive.
        </p>
      </div>

      {/* Main Two Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Clothing Card */}
        <div className="group relative bg-[#171513] text-[#F7F3EC] border border-[#A88963]/30 min-h-[460px] flex flex-col justify-between p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-60 group-hover:opacity-75 transition-opacity duration-700">
            <img
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80"
              alt="Lumora Clothing"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/50 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 py-1 px-3 bg-[#A88963] text-white text-[9px] uppercase tracking-[0.25em] font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Garments & Bespoke</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="font-serif text-4xl text-[#F7F3EC]">
              CLOTHING
            </h2>
            <p className="text-xs font-light text-[#E8DED0]/90 leading-relaxed">
              Explore sculpted gowns, tailored two-piece suits, traditional Iro & Buba sets, and occasion wear.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {['Dresses', 'Two-Piece', 'Traditional', 'Occasion Wear'].map((cat) => (
                <button
                  key={cat}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('/shop/clothing', { filter: cat });
                  }}
                  className="py-1 px-3 bg-[#F7F3EC]/10 hover:bg-[#A88963] text-[#F7F3EC] text-[10px] uppercase tracking-wider transition-colors border border-[#E8DED0]/20"
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('/shop/clothing')}
              className="w-full py-3.5 bg-[#F7F3EC] text-[#171513] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] hover:text-white transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>View Clothing Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Materials Card */}
        <div className="group relative bg-[#171513] text-[#F7F3EC] border border-[#A88963]/30 min-h-[460px] flex flex-col justify-between p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-60 group-hover:opacity-75 transition-opacity duration-700">
            <img
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80"
              alt="Lumora Materials"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/50 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 py-1 px-3 bg-[#A88963] text-white text-[9px] uppercase tracking-[0.25em] font-medium">
              <Layers className="w-3 h-3" />
              <span>Luxury Fabrics</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="font-serif text-4xl text-[#F7F3EC]">
              MATERIALS
            </h2>
            <p className="text-xs font-light text-[#E8DED0]/90 leading-relaxed">
              Curated French corded lace, pure 40mm mulberry silk, cotton-silk velvet, and custom African prints.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {['Lace', 'Silk', 'Velvet', 'Ankara', 'Chiffon'].map((mat) => (
                <button
                  key={mat}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('/shop/materials', { filter: mat });
                  }}
                  className="py-1 px-3 bg-[#F7F3EC]/10 hover:bg-[#A88963] text-[#F7F3EC] text-[10px] uppercase tracking-wider transition-colors border border-[#E8DED0]/20"
                >
                  {mat}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('/shop/materials')}
              className="w-full py-3.5 bg-[#F7F3EC] text-[#171513] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] hover:text-white transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>View Materials Archive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
