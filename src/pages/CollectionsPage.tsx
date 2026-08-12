import React, { useState, useEffect } from 'react';
import { getCollections, fetchCollections } from '../services/catalogService';
import { CollectionCard } from '../components/cards/CollectionCard';
import { Collection } from '../types';

interface CollectionsPageProps {
  onNavigate: (path: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const [collections, setCollections] = useState<Collection[]>(() => getCollections());

  useEffect(() => {
    let isMounted = true;
    fetchCollections().then((cols) => {
      if (isMounted && cols.length) {
        setCollections(cols);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
          High Couture Archives
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#171513]">
          Lumora Collections
        </h1>
        <p className="text-sm font-light text-[#171513]/80 leading-relaxed font-serif italic">
          Seasonal stories crafted around West African heritage, architectural silhouettes, and contemporary femininity.
        </p>
      </div>

      {/* Collections Stack */}
      <div className="space-y-10">
        {collections.map((collection, idx) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            featured={idx === 0}
            onView={(id) => onNavigate(`/collections/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};
