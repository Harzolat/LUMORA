import React, { useState, useEffect } from 'react';
import {
  getCollectionById,
  getCollections,
  getProducts,
  fetchCollectionById,
  fetchProducts,
} from '../services/catalogService';
import { ProductCard } from '../components/cards/ProductCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Collection, Product } from '../types';

interface CollectionDetailPageProps {
  collectionId: string;
  onNavigate: (path: string) => void;
  onInquire: (product: Product) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({
  collectionId,
  onNavigate,
  onInquire,
}) => {
  const [collection, setCollection] = useState<Collection>(
    () => getCollectionById(collectionId) || getCollections()[0]
  );
  const [allProducts, setAllProducts] = useState<Product[]>(() => getProducts());

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchCollectionById(collectionId), fetchProducts()]).then(([col, prods]) => {
      if (isMounted) {
        if (col) setCollection(col);
        if (prods.length) setAllProducts(prods);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [collectionId]);

  const collectionProducts = allProducts.filter(
    (p) => p.collectionId === collection.id || collection.featuredProductIds?.includes(p.id) || collection.productIds?.includes(p.id)
  );

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Hero Banner */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center bg-[#171513] text-[#F7F3EC] overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <img
            src={collection.coverImage}
            alt={collection.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/60 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center space-y-6 z-10">
          <button
            onClick={() => onNavigate('/collections')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#A88963] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Collections</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A88963]/20 border border-[#A88963]/40 text-[10px] uppercase tracking-[0.3em] text-[#A88963] block mx-auto w-fit">
            <Sparkles className="w-3 h-3 text-[#A88963]" />
            <span>{collection.season} • {collection.year}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F3EC] uppercase tracking-wider">
            {collection.title}
          </h1>

          <p className="text-base sm:text-lg font-serif italic text-[#E8DED0]/90 max-w-2xl mx-auto">
            {collection.subtitle}
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-center">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
          Editorial Story
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#171513] italic leading-relaxed">
          "{collection.description}"
        </h2>
        <p className="text-sm sm:text-base font-light text-[#171513]/80 leading-relaxed max-w-3xl mx-auto">
          {collection.story}
        </p>
      </section>

      {/* Editorial Lookbook Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#E8DED0] pb-4">
          <h3 className="font-serif text-2xl text-[#171513]">
            Lookbook Gallery
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collection.editorialGallery.map((imgUrl, idx) => (
            <div key={idx} className="border border-[#E8DED0] overflow-hidden group">
              <ImageWithFallback
                src={imgUrl}
                alt={`${collection.title} lookbook ${idx + 1}`}
                aspectRatio="editorial"
                imageClassName="group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection Pieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="border-b border-[#E8DED0] pb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl text-[#171513]">
            Collection Pieces
          </h3>
          <span className="text-xs uppercase tracking-widest text-[#A88963] font-mono">
            {collectionProducts.length} Atelier Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={(id) => onNavigate(`/product/${id}`)}
              onInquire={onInquire}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
