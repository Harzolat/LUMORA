import React, { useState } from 'react';
import { useRouter } from './router/useRouter';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { InquiryModal } from './components/common/InquiryModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ClothingCataloguePage } from './pages/ClothingCataloguePage';
import { MaterialsCataloguePage } from './pages/MaterialsCataloguePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { CustomSewingPage } from './pages/CustomSewingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminCatalogPage } from './pages/AdminCatalogPage';

import { Product, Material, ClothingCategory, MaterialCategory } from './types';

export default function App() {
  const { route, navigate, currentPath } = useRouter();

  // Inquiry Modal state
  const [activeInquiryItem, setActiveInquiryItem] = useState<Product | Material | null>(null);

  const handleOpenInquiry = (item: Product | Material) => {
    setActiveInquiryItem(item);
  };

  const handleCloseInquiry = () => {
    setActiveInquiryItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#171513] font-sans antialiased">
      {/* Sticky Top Header Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page Content */}
      <main className="flex-grow">
        {route.path === '/' && (
          <HomePage onNavigate={navigate} onInquire={handleOpenInquiry} />
        )}

        {route.path === '/shop' && (
          <ShopPage onNavigate={navigate} />
        )}

        {route.path === '/shop/clothing' && (
          <ClothingCataloguePage
            initialFilter={(route as { filter?: ClothingCategory }).filter || 'All'}
            onNavigate={navigate}
            onInquire={handleOpenInquiry}
          />
        )}

        {route.path === '/shop/materials' && (
          <MaterialsCataloguePage
            initialFilter={(route as { filter?: MaterialCategory }).filter || 'All'}
            onNavigate={navigate}
            onInquire={handleOpenInquiry}
          />
        )}

        {route.path === '/product/:id' && (
          <ProductDetailPage
            productId={(route as { id: string }).id}
            onNavigate={navigate}
            onInquire={handleOpenInquiry}
          />
        )}

        {route.path === '/material/:id' && (
          <MaterialDetailPage
            materialId={(route as { id: string }).id}
            onNavigate={navigate}
            onInquire={handleOpenInquiry}
          />
        )}

        {route.path === '/collections' && (
          <CollectionsPage onNavigate={navigate} />
        )}

        {route.path === '/collections/:id' && (
          <CollectionDetailPage
            collectionId={(route as { id: string }).id}
            onNavigate={navigate}
            onInquire={handleOpenInquiry}
          />
        )}

        {route.path === '/custom-sewing' && (
          <CustomSewingPage onNavigate={navigate} />
        )}

        {route.path === '/about' && (
          <AboutPage onNavigate={navigate} />
        )}

        {route.path === '/contact' && (
          <ContactPage />
        )}

        {route.path === '/admin/login' && (
          <AdminLoginPage onNavigate={navigate} />
        )}

        {route.path === '/admin' && (
          <AdminDashboardPage onNavigate={navigate} />
        )}

        {route.path === '/admin/catalog' && (
          <AdminCatalogPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Product Inquiry Modal */}
      <InquiryModal
        isOpen={Boolean(activeInquiryItem)}
        onClose={handleCloseInquiry}
        item={activeInquiryItem}
      />
    </div>
  );
}
