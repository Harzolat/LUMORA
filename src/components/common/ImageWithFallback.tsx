import React, { useState } from 'react';
import { getAspectClass } from '../../utils/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  aspectRatio?: 'portrait' | 'square' | 'wide' | 'editorial' | 'hero';
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onClick?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  aspectRatio = 'portrait',
  className = '',
  imageClassName = '',
  priority = false,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClass = getAspectClass(aspectRatio);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#E8DED0]/40 ${aspectClass} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8DED0]/30 via-[#F7F3EC] to-[#E8DED0]/30 animate-pulse" />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#E8DED0]/50 text-[#171513]/60">
          <span className="font-serif italic text-sm">Lumora Atelier</span>
          <span className="text-xs uppercase tracking-widest mt-1">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${imageClassName}`}
        />
      )}
    </div>
  );
};
