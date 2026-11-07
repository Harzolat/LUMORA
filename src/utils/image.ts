/**
 * Image helper functions
 */

export function getAspectClass(aspectRatio?: 'portrait' | 'square' | 'wide' | 'editorial' | 'hero' | string): string {
  switch (aspectRatio) {
    case 'portrait':
      return 'aspect-[3/4]';
    case 'editorial':
      return 'aspect-[2/3]';
    case 'square':
      return 'aspect-square';
    case 'wide':
      return 'aspect-[16/9]';
    case 'hero':
      return 'aspect-[21/9] sm:aspect-[16/9] md:aspect-[2.2/1]';
    default:
      return 'aspect-[3/4]';
  }
}
