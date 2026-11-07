import React from 'react';
import { Collection } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  onView: (id: string) => void;
  featured?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onView,
  featured = false,
}) => {
  return (
    <div
      onClick={() => onView(collection.id)}
      className="group relative cursor-pointer overflow-hidden bg-[#171513] border border-[#A88963]/20 shadow-md transition-all duration-700"
    >
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={collection.coverImage}
          alt={collection.title}
          aspectRatio={featured ? 'hero' : 'editorial'}
          imageClassName="group-hover:scale-105 transition-transform duration-1000 ease-out opacity-85 group-hover:opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-[#F7F3EC] space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium">
            {collection.season} • {collection.year}
          </span>
          <span className="w-8 h-[1px] bg-[#A88963]/50" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F3EC] group-hover:text-[#A88963] transition-colors">
          {collection.title}
        </h3>

        <p className="text-xs sm:text-sm font-light text-[#E8DED0]/80 line-clamp-2 max-w-xl">
          {collection.description}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F7F3EC] font-medium group-hover:text-[#A88963] transition-colors">
          <span>View Collection</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300 text-[#A88963]" />
        </div>
      </div>
    </div>
  );
};
