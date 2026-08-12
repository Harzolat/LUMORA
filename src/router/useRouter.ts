import { useState, useEffect } from 'react';
import { AppRoute, ClothingCategory, MaterialCategory } from '../types';

export function parsePath(pathname: string): AppRoute {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  if (cleanPath === '/') return { path: '/' };
  if (cleanPath === '/shop') return { path: '/shop' };
  if (cleanPath === '/shop/clothing') return { path: '/shop/clothing' };
  if (cleanPath === '/shop/materials') return { path: '/shop/materials' };
  
  if (cleanPath.startsWith('/product/')) {
    const id = cleanPath.replace('/product/', '');
    return { path: '/product/:id', id };
  }

  if (cleanPath.startsWith('/material/')) {
    const id = cleanPath.replace('/material/', '');
    return { path: '/material/:id', id };
  }

  if (cleanPath === '/collections') return { path: '/collections' };

  if (cleanPath.startsWith('/collections/')) {
    const id = cleanPath.replace('/collections/', '');
    return { path: '/collections/:id', id };
  }

  if (cleanPath === '/custom-sewing') return { path: '/custom-sewing' };
  if (cleanPath === '/about') return { path: '/about' };
  if (cleanPath === '/contact') return { path: '/contact' };
  if (cleanPath === '/admin/login') return { path: '/admin/login' };
  if (cleanPath === '/admin/catalog') return { path: '/admin/catalog' };
  if (cleanPath === '/admin') return { path: '/admin' };

  // Fallback to home
  return { path: '/' };
}

export function useRouter() {
  const [route, setRoute] = useState<AppRoute>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, extra?: { filter?: string }) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    
    const parsed = parsePath(path);
    if (parsed.path === '/shop/clothing' && extra?.filter) {
      (parsed as { filter?: ClothingCategory }).filter = extra.filter as ClothingCategory;
    } else if (parsed.path === '/shop/materials' && extra?.filter) {
      (parsed as { filter?: MaterialCategory }).filter = extra.filter as MaterialCategory;
    }

    setRoute(parsed);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    route,
    navigate,
    currentPath: window.location.pathname,
  };
}
