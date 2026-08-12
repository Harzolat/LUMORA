import React, { useState, useEffect } from 'react';
import { getProductById, getProducts, fetchProductById } from '../services/catalogService';
import { Product } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { MessageCircle, ArrowLeft, Check, ShieldCheck, Ruler, Sparkles, Scissors } from 'lucide-react';
import { buildWhatsAppLink, PRICING_PRESENTATION } from '../config/brand';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
  onInquire: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onInquire,
}) => {
  const [product, setProduct] = useState<Product>(
    () => getProductById(productId) || getProducts()[0]
  );

  useEffect(() => {
    let isMounted = true;
    fetchProductById(productId).then((p) => {
      if (isMounted && p) {
        setProduct(p);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');

  const whatsappMsg = `Hello Lumora, I am interested in ${product.name}. I would like to know more about this piece. Color: ${selectedColor || 'Default'}, Size: ${selectedSize || 'Custom'}.`;
  const whatsappUrl = buildWhatsAppLink(whatsappMsg);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/shop/clothing')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171513]/70 hover:text-[#A88963] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Clothing Catalogue</span>
      </button>

      {/* Main Grid: Gallery Left, Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Gallery Left Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#E8DED0]">
            <ImageWithFallback
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              aspectRatio="portrait"
              priority
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`border transition-all overflow-hidden ${
                    selectedImageIndex === idx
                      ? 'border-[#A88963] ring-1 ring-[#A88963]'
                      : 'border-[#E8DED0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`${product.name} view ${idx + 1}`} aspectRatio="square" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Right Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#A88963] font-medium mb-2">
              <span>{product.clothingCategory}</span>
              <span className="py-0.5 px-2 bg-[#A88963]/15 text-[#8C6D48]">
                {product.availability}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#171513] font-normal leading-tight">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="text-sm font-serif italic text-[#171513]/70 mt-1">
                {product.subtitle}
              </p>
            )}

            {/* Price Presentation (Understated "Contact for Pricing") */}
            <div className="mt-4 pt-4 border-t border-[#E8DED0] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#171513]/60 font-medium block">
                  Price
                </span>
                <span className="font-serif italic text-lg text-[#171513]">
                  {PRICING_PRESENTATION.label}
                </span>
              </div>
              <span className="text-[10px] text-[#A88963] uppercase tracking-widest font-mono">
                Atelier Piece
              </span>
            </div>
          </div>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#171513]/80 font-medium">
                Color palette: <span className="text-[#171513] font-serif italic font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 py-1.5 px-3 text-xs border transition-all ${
                      selectedColor === c.name
                        ? 'border-[#171513] bg-[#171513] text-white'
                        : 'border-[#E8DED0] bg-white text-[#171513]/80 hover:border-[#A88963]'
                    }`}
                  >
                    {c.hex && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#171513]/80 font-medium">
                  Available Sizing
                </label>
                <button
                  onClick={() => onNavigate('/custom-sewing')}
                  className="text-[11px] text-[#A88963] hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Request Custom Fit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-3 text-xs text-center border transition-all ${
                      selectedSize === sz
                        ? 'border-[#A88963] bg-[#A88963] text-white font-medium'
                        : 'border-[#E8DED0] bg-white text-[#171513] hover:border-[#171513]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric & Material Note */}
          <div className="bg-[#E8DED0]/30 p-4 border-l-2 border-[#A88963] space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#A88963] font-medium block">
              Fabric Composition & Craft
            </span>
            <p className="text-xs text-[#171513]/80 font-light leading-relaxed">
              {product.materialInfo}
            </p>
          </div>

          {/* Primary Call to Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onInquire(product)}
              className="w-full py-4 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#A88963] transition-colors flex items-center justify-center gap-3 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask About This Piece</span>
            </button>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 border border-[#171513] text-[#171513] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#171513] hover:text-[#F7F3EC] transition-colors flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-4 h-4 text-[#A88963]" />
                <span>Inquire via WhatsApp</span>
              </a>
            )}
          </div>

          {/* Description & Narrative */}
          <div className="pt-6 border-t border-[#E8DED0] space-y-4">
            <h3 className="font-serif text-xl text-[#171513]">
              Atelier Notes & Details
            </h3>
            <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
              {product.description}
            </p>
            {product.editorialStory && (
              <p className="text-xs font-serif italic text-[#171513]/70 leading-relaxed bg-[#F7F3EC] p-3 border-l border-[#A88963]/50">
                "{product.editorialStory}"
              </p>
            )}
          </div>

          {/* Lumora Service Guarantee */}
          <div className="pt-4 border-t border-[#E8DED0] grid grid-cols-2 gap-4 text-xs text-[#171513]/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A88963]" />
              <span>100% Verified Craftsmanship</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#A88963]" />
              <span>Custom Alterations Available</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
