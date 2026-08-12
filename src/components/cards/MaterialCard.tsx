import React from 'react';
import { Material } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Layers, MessageCircle } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onView: (id: string) => void;
  onInquire: (material: Material) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onView,
  onInquire,
}) => {
  return (
    <div className="group flex flex-col bg-[#F7F3EC] border border-[#E8DED0]/70 hover:border-[#A88963]/60 transition-all duration-500 overflow-hidden">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={material.images[0]}
          alt={material.name}
          aspectRatio="square"
          imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
          onClick={() => onView(material.id)}
        />

        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#171513]/90 backdrop-blur-xs text-[#F7F3EC] text-[9px] uppercase tracking-[0.25em] font-medium py-1 px-2.5">
            {material.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#A88963] font-medium mb-1">
            <Layers className="w-3 h-3" />
            <span>{material.availability}</span>
          </div>

          <h3
            onClick={() => onView(material.id)}
            className="font-serif text-lg text-[#171513] group-hover:text-[#A88963] transition-colors cursor-pointer"
          >
            {material.name}
          </h3>

          <p className="text-xs text-[#171513]/70 font-light mt-1.5 line-clamp-2 leading-relaxed">
            {material.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E8DED0] flex items-center justify-between gap-2">
          <button
            onClick={() => onView(material.id)}
            className="text-[11px] uppercase tracking-[0.2em] text-[#171513] font-medium hover:text-[#A88963] transition-colors"
          >
            View Material &rarr;
          </button>

          <button
            onClick={() => onInquire(material)}
            className="py-1.5 px-3 bg-[#A88963] text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#8C6D48] transition-colors flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
