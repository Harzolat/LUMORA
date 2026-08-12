import React, { useState, useEffect } from 'react';
import { getMaterialById, getMaterials, fetchMaterialById } from '../services/catalogService';
import { Material } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { MessageCircle, ArrowLeft, Layers, Sparkles, CheckCircle } from 'lucide-react';
import { buildWhatsAppLink, PRICING_PRESENTATION } from '../config/brand';

interface MaterialDetailPageProps {
  materialId: string;
  onNavigate: (path: string) => void;
  onInquire: (material: Material) => void;
}

export const MaterialDetailPage: React.FC<MaterialDetailPageProps> = ({
  materialId,
  onNavigate,
  onInquire,
}) => {
  const [material, setMaterial] = useState<Material>(
    () => getMaterialById(materialId) || getMaterials()[0]
  );

  useEffect(() => {
    let isMounted = true;
    fetchMaterialById(materialId).then((m) => {
      if (isMounted && m) {
        setMaterial(m);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [materialId]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const whatsappMsg = `Hello Lumora, I am inquiring about the material "${material.name}". Please share pricing per yard and sample availability.`;
  const whatsappUrl = buildWhatsAppLink(whatsappMsg);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/shop/materials')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171513]/70 hover:text-[#A88963] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Materials Archive</span>
      </button>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#E8DED0]">
            <ImageWithFallback
              src={material.images[selectedImageIndex] || material.images[0]}
              alt={material.name}
              aspectRatio="square"
              priority
            />
          </div>

          {material.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {material.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`border transition-all overflow-hidden ${
                    selectedImageIndex === idx
                      ? 'border-[#A88963] ring-1 ring-[#A88963]'
                      : 'border-[#E8DED0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`${material.name} texture ${idx + 1}`} aspectRatio="square" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A88963] font-medium mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{material.category} Textile</span>
              <span>•</span>
              <span>{material.availability}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#171513] font-normal leading-tight">
              {material.name}
            </h1>

            {material.origin && (
              <p className="text-xs uppercase tracking-widest text-[#171513]/60 mt-1.5 font-mono">
                Origin: {material.origin}
              </p>
            )}

            {/* Price Presentation */}
            <div className="mt-4 pt-4 border-t border-[#E8DED0] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#171513]/60 font-medium block">
                  Yardage Rate
                </span>
                <span className="font-serif italic text-lg text-[#171513]">
                  {PRICING_PRESENTATION.label}
                </span>
              </div>
              <span className="text-[10px] text-[#A88963] uppercase tracking-widest font-mono">
                Exclusive Weave
              </span>
            </div>
          </div>

          {/* Color Variations */}
          {material.colors && material.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#171513]/80 font-medium">
                Available Tonal Palette
              </label>
              <div className="flex flex-wrap gap-2">
                {material.colors.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2 py-1.5 px-3 bg-white border border-[#E8DED0] text-xs text-[#171513]"
                  >
                    {c.hex && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Usage */}
          {material.recommendedFor && (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#171513]/80 font-medium">
                Recommended For
              </label>
              <div className="flex flex-wrap gap-1.5">
                {material.recommendedFor.map((item) => (
                  <span
                    key={item}
                    className="py-1 px-2.5 bg-[#E8DED0]/50 text-[#171513] text-[11px] font-light"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Texture Notes */}
          {material.textureNotes && (
            <div className="bg-[#E8DED0]/30 p-4 border-l-2 border-[#A88963] space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#A88963] font-medium block">
                Texture & Handfeel
              </span>
              <p className="text-xs text-[#171513]/80 font-light leading-relaxed">
                {material.textureNotes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onInquire(material)}
              className="w-full py-4 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#A88963] transition-colors flex items-center justify-center gap-3 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask About Material</span>
            </button>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 border border-[#171513] text-[#171513] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#171513] hover:text-[#F7F3EC] transition-colors flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-4 h-4 text-[#A88963]" />
                <span>WhatsApp Fabric Atelier</span>
              </a>
            )}
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-[#E8DED0] space-y-3">
            <h3 className="font-serif text-xl text-[#171513]">
              Fabric Overview
            </h3>
            <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
              {material.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
