import React from 'react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Sparkles, Globe, Scissors, Shield } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Editorial Header */}
      <section className="relative py-20 bg-[#171513] text-[#F7F3EC] text-center border-b border-[#A88963]/30">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
            The House of Lumora
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl tracking-wide text-[#F7F3EC]">
            Quiet Luxury & African Craft
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-[#E8DED0]/90 max-w-2xl mx-auto leading-relaxed">
            Where traditional West African sartorial mastery meets contemporary global femininity.
          </p>
        </div>
      </section>

      {/* 1. Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
            01 • Our Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171513]">
            Born in Lagos, Worn Worldwide
          </h2>
          <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
            Founded with a vision to express quiet luxury through authentic African craftsmanship, Lumora bridges the gap between heritage textile traditions and modern, high-fashion silhouettes.
          </p>
          <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
            Each collection explores clean architectural lines, rich textures, and thoughtful draping designed to make every woman feel commanding, elegant, and effortlessly serene.
          </p>
        </div>

        <div className="md:col-span-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
            alt="Lumora Atelier in Lagos"
            aspectRatio="editorial"
            className="border border-[#E8DED0]"
          />
        </div>
      </section>

      {/* 2. The Designer & Our Craft */}
      <section className="bg-[#E8DED0]/30 py-16 border-y border-[#A88963]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-4 bg-[#F7F3EC] p-8 border border-[#E8DED0]">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
              02 • The Atelier
            </span>
            <h3 className="font-serif text-2xl text-[#171513]">
              Atelier Precision
            </h3>
            <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
              In our Lagos creative atelier, master tailors, pattern makers, and beadwork artists work in harmony. From internal corsetry structuring to hand-pinned drapery, every stitch is treated as fine art.
            </p>
          </div>

          <div className="space-y-4 bg-[#F7F3EC] p-8 border border-[#E8DED0]">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
              03 • Our Craft
            </span>
            <h3 className="font-serif text-2xl text-[#171513]">
              Curated Textiles
            </h3>
            <p className="text-sm font-light text-[#171513]/80 leading-relaxed">
              We source raw silks, French corded lace, plush velvet, and bespoke African prints directly from ethical weavers and heritage textile mills. Materials are hand-selected for handfeel, weight, and timeless durability.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Our Philosophy & International Presence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
            04 • Our Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171513]">
            From Nigeria to the World
          </h2>
          <p className="text-sm font-light text-[#171513]/80 leading-relaxed font-serif italic">
            African luxury is not quieted by distance. We ship globally with DHL/FedEx express couriers and offer virtual fit consultations to clients across continents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-[#F7F3EC] border border-[#E8DED0] space-y-3">
            <Globe className="w-6 h-6 text-[#A88963]" />
            <h4 className="font-serif text-lg text-[#171513]">Global Shipping</h4>
            <p className="text-xs text-[#171513]/70 font-light">
              Doorstep delivery across West Africa, North America, Europe, and the Middle East.
            </p>
          </div>

          <div className="p-6 bg-[#F7F3EC] border border-[#E8DED0] space-y-3">
            <Scissors className="w-6 h-6 text-[#A88963]" />
            <h4 className="font-serif text-lg text-[#171513]">Virtual Fitting</h4>
            <p className="text-xs text-[#171513]/70 font-light">
              Interactive measurement guidance with senior Lumora fit specialists via video call.
            </p>
          </div>

          <div className="p-6 bg-[#F7F3EC] border border-[#E8DED0] space-y-3">
            <Shield className="w-6 h-6 text-[#A88963]" />
            <h4 className="font-serif text-lg text-[#171513]">Authentic Quality</h4>
            <p className="text-xs text-[#171513]/70 font-light">
              Hand-finished garments inspected individually before leaving our Victoria Island studio.
            </p>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={() => onNavigate('/custom-sewing')}
            className="py-4 px-8 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors"
          >
            Start Your Bespoke Journey
          </button>
        </div>
      </section>
    </div>
  );
};
