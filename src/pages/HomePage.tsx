import React, { useState, useEffect } from 'react';
import {
  getCollections,
  getProducts,
  getMaterials,
  fetchCollections,
  fetchProducts,
  fetchMaterials,
} from '../services/catalogService';
import { ProductCard } from '../components/cards/ProductCard';
import { MaterialCard } from '../components/cards/MaterialCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ArrowRight, Sparkles, Scissors, Globe2, MessageCircle } from 'lucide-react';
import { Product, Material } from '../types';
import { buildWhatsAppLink } from '../config/brand';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onInquire: (item: Product | Material) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onInquire }) => {
  const [collections, setCollections] = useState(() => getCollections());
  const [products, setProducts] = useState(() => getProducts());
  const [materials, setMaterials] = useState(() => getMaterials());

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchCollections(), fetchProducts(), fetchMaterials()]).then(([cols, prods, mats]) => {
      if (isMounted) {
        if (cols.length) setCollections(cols);
        if (prods.length) setProducts(prods);
        if (mats.length) setMaterials(mats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredCollection = collections[0];
  const featuredProducts = products.slice(0, 3);
  const featuredMaterials = materials.slice(0, 3);

  const whatsappUrl = buildWhatsAppLink('Hello Lumora, I am exploring your website and would like to start a bespoke consultation.');

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#171513] text-[#F7F3EC] overflow-hidden">
        {/* Background Editorial Image */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=80"
            alt="LUMORA High Couture"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/50 to-transparent" />

        {/* Hero Content Overlay */}
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#A88963]/40 bg-[#171513]/60 backdrop-blur-md text-[10px] uppercase tracking-[0.3em] text-[#A88963]">
            <Sparkles className="w-3 h-3 text-[#A88963]" />
            <span>Lagos • High Couture • Worldwide</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-[0.15em] text-[#F7F3EC] uppercase font-normal leading-tight">
            LUMORA
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-light text-[#E8DED0]/90 max-w-2xl mx-auto leading-relaxed font-serif italic">
            Quiet luxury woven with contemporary African craftsmanship. Elegance designed for the global woman.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => onNavigate('/shop')}
              className="w-full sm:w-auto py-4 px-8 bg-[#F7F3EC] text-[#171513] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#A88963] hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/custom-sewing')}
              className="w-full sm:w-auto py-4 px-8 border border-[#E8DED0] text-[#F7F3EC] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#F7F3EC] hover:text-[#171513] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Scissors className="w-4 h-4 text-[#A88963]" />
              <span>Custom Sewing</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8DED0] pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
              Editorial Highlight
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171513] mt-1">
              {featuredCollection.title}
            </h2>
          </div>
          <button
            onClick={() => onNavigate(`/collections/${featuredCollection.id}`)}
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#171513] hover:text-[#A88963] transition-colors flex items-center gap-2"
          >
            <span>View Full Collection</span>
            <ArrowRight className="w-4 h-4 text-[#A88963]" />
          </button>
        </div>

        {/* Editorial Feature Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div
              onClick={() => onNavigate(`/collections/${featuredCollection.id}`)}
              className="cursor-pointer group relative overflow-hidden"
            >
              <ImageWithFallback
                src={featuredCollection.coverImage}
                alt={featuredCollection.title}
                aspectRatio="editorial"
                imageClassName="group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171513]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
                  {featuredCollection.season} • {featuredCollection.year}
                </span>
                <h3 className="font-serif text-2xl text-white mt-1">
                  {featuredCollection.subtitle}
                </h3>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A88963] font-medium block">
              The Story
            </span>
            <p className="font-serif italic text-2xl text-[#171513] leading-relaxed">
              "{featuredCollection.description}"
            </p>
            <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
              {featuredCollection.story}
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onNavigate(`/collections/${featuredCollection.id}`)}
                className="py-3 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors"
              >
                Discover Collection
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={(id) => onNavigate(`/product/${id}`)}
              onInquire={(p) => onInquire(p)}
            />
          ))}
        </div>
      </section>

      {/* 3. TWO CATEGORY PATHS (CLOTHING vs MATERIALS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
            Craftsmanship Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171513] mt-2">
            The Lumora World
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Clothing Category Card */}
          <div
            onClick={() => onNavigate('/shop/clothing')}
            className="group relative cursor-pointer overflow-hidden border border-[#A88963]/30 min-h-[400px] flex items-end p-8 bg-[#171513]"
          >
            <div className="absolute inset-0 opacity-70 group-hover:opacity-85 transition-opacity duration-700">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
                alt="Clothing Catalogue"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/40 to-transparent" />

            <div className="relative text-[#F7F3EC] space-y-3 z-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
                Ready-To-Wear & Bespoke
              </span>
              <h3 className="font-serif text-3xl text-[#F7F3EC] group-hover:text-[#A88963] transition-colors">
                CLOTHING
              </h3>
              <p className="text-xs font-light text-[#E8DED0]/80 max-w-md">
                Dresses, two-piece sets, traditional occasion wear, and evening couture tailored to perfection.
              </p>
              <div className="pt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F7F3EC]">
                <span>Explore Clothing Catalogue</span>
                <ArrowRight className="w-4 h-4 text-[#A88963] group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Materials Category Card */}
          <div
            onClick={() => onNavigate('/shop/materials')}
            className="group relative cursor-pointer overflow-hidden border border-[#A88963]/30 min-h-[400px] flex items-end p-8 bg-[#171513]"
          >
            <div className="absolute inset-0 opacity-70 group-hover:opacity-85 transition-opacity duration-700">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80"
                alt="Materials Catalogue"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/40 to-transparent" />

            <div className="relative text-[#F7F3EC] space-y-3 z-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
                Textiles & Fabrics
              </span>
              <h3 className="font-serif text-3xl text-[#F7F3EC] group-hover:text-[#A88963] transition-colors">
                MATERIALS
              </h3>
              <p className="text-xs font-light text-[#E8DED0]/80 max-w-md">
                French corded lace, 40mm mulberry silk, plush velvet, and bespoke African wax prints.
              </p>
              <div className="pt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F7F3EC]">
                <span>Explore Fabric Archive</span>
                <ArrowRight className="w-4 h-4 text-[#A88963] group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CUSTOM SEWING BANNER */}
      <section className="bg-[#171513] text-[#F7F3EC] py-20 border-y border-[#A88963]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
              Bespoke Atelier Service
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#F7F3EC] leading-tight">
              Made For You.
            </h2>
            <p className="text-base font-light text-[#E8DED0]/90 leading-relaxed max-w-xl font-serif italic">
              Experience the art of custom sewing. From personalized measurement fittings to hand-picked lace and silk selection, Lumora crafts garments tailored exclusively for your silhouette and occasion.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/custom-sewing')}
                className="py-4 px-8 bg-[#A88963] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#8C6D48] transition-colors flex items-center gap-3"
              >
                <Scissors className="w-4 h-4" />
                <span>Start Your Request</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-8 border border-[#E8DED0]/40 text-[#F7F3EC] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#F7F3EC] hover:text-[#171513] transition-colors flex items-center gap-3"
              >
                <MessageCircle className="w-4 h-4 text-[#A88963]" />
                <span>Bespoke Consultation</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
              alt="Custom Sewing Atelier"
              aspectRatio="editorial"
              className="border border-[#A88963]/30 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 5. FEATURED MATERIALS ARCHIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DED0] pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
              Curated Textiles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171513] mt-1">
              Featured Materials
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop/materials')}
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#171513] hover:text-[#A88963] transition-colors flex items-center gap-2"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-4 h-4 text-[#A88963]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onView={(id) => onNavigate(`/material/${id}`)}
              onInquire={(m) => onInquire(m)}
            />
          ))}
        </div>
      </section>

      {/* 6. INTERNATIONAL PRESENCE & NIGERIAN CRAFTSMANSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8DED0]/40 border border-[#A88963]/30 p-8 sm:p-12 text-center space-y-6">
          <Globe2 className="w-8 h-8 text-[#A88963] mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
            Nigeria to the World
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171513] max-w-2xl mx-auto">
            International Client Experience
          </h2>
          <p className="text-sm font-light text-[#171513]/80 max-w-2xl mx-auto leading-relaxed">
            Lumora delivers bespoke garments and luxury fabrics to clients across West Africa, North America, Europe, and the Middle East via express international couriers with virtual fit consultations.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/contact')}
              className="py-3 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors"
            >
              Inquire International Delivery
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
