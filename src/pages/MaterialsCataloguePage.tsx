import React, { useState, useEffect } from 'react';
import { getMaterials, fetchMaterials } from '../services/catalogService';
import { MaterialCard } from '../components/cards/MaterialCard';
import { MaterialCategory, Material } from '../types';

interface MaterialsCataloguePageProps {
  initialFilter?: MaterialCategory;
  onNavigate: (path: string) => void;
  onInquire: (material: Material) => void;
}

export const MaterialsCataloguePage: React.FC<MaterialsCataloguePageProps> = ({
  initialFilter = 'All',
  onNavigate,
  onInquire,
}) => {
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>(initialFilter);
  const [materials, setMaterials] = useState<Material[]>(() => getMaterials());

  useEffect(() => {
    let isMounted = true;
    fetchMaterials().then((mats) => {
      if (isMounted && mats.length) {
        setMaterials(mats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories: MaterialCategory[] = [
    'All',
    'Lace',
    'Ankara',
    'Silk',
    'Chiffon',
    'Velvet',
    'Other',
  ];

  const filteredMaterials = materials.filter((mat) => {
    if (activeCategory === 'All') return true;
    return mat.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#E8DED0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
            Fabric Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171513] mt-1">
            Materials & Luxury Textiles
          </h1>
        </div>

        <p className="text-xs text-[#171513]/70 font-light max-w-md font-serif italic">
          High-grade textiles available by the yard or reserved for bespoke Lumora custom tailoring.
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

      {/* Material Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onView={(id) => onNavigate(`/material/${id}`)}
              onInquire={onInquire}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#E8DED0]/20 border border-[#E8DED0] p-8 space-y-3">
          <p className="font-serif italic text-xl text-[#171513]">
            No fabrics currently listed in this specific weave.
          </p>
          <p className="text-xs text-[#171513]/70 font-light">
            Inquire directly for private fabric sourcing options.
          </p>
          <button
            onClick={() => onNavigate('/contact')}
            className="mt-2 py-2.5 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors"
          >
            Contact Fabric Atelier
          </button>
        </div>
      )}
    </div>
  );
};
