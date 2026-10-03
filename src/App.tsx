import React, { useState, useEffect, useCallback } from 'react';
import { CoffeeScene3D } from './components/CoffeeScene3D';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { PinnedScrollStage } from './components/PinnedScrollStage';
import { InteractiveScrollNavigator } from './components/InteractiveScrollNavigator';
import { MenuSection } from './components/MenuSection';
import { CafeStorySection } from './components/CafeStorySection';
import { CoffeeGallerySection } from './components/CoffeeGallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ReservationSection } from './components/ReservationSection';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

import {
  INITIAL_CAFE_DATA,
  INITIAL_MENU_ITEMS,
  INITIAL_SCENE_SETTINGS,
  INITIAL_RESERVATIONS,
} from './data/initialData';
import { CafeData, MenuItem, SceneSettings, Reservation, OrderItem, CustomerOrder } from './types';

export default function App() {
  // --- PERSISTENT STATE WITH LOCALSTORAGE ---
  const [cafeData, setCafeData] = useState<CafeData>(() => {
    try {
      const saved = localStorage.getItem('pw_cafe_data');
      return saved ? JSON.parse(saved) : INITIAL_CAFE_DATA;
    } catch {
      return INITIAL_CAFE_DATA;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('pw_menu_items');
      if (!saved) return INITIAL_MENU_ITEMS;
      // Migrate legacy image paths (old /src/assets paths don't exist in production builds)
      return (JSON.parse(saved) as MenuItem[]).map((item) => {
        if (!item.image?.startsWith('/src/assets/images/')) return item;
        const defaultItem = INITIAL_MENU_ITEMS.find((i) => i.id === item.id);
        return { ...item, image: defaultItem?.image ?? item.image.replace('/src/assets/images/', '/images/') };
      });
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [sceneSettings, setSceneSettings] = useState<SceneSettings>(() => {
    try {
      const saved = localStorage.getItem('pw_scene_settings');
      return saved ? JSON.parse(saved) : INITIAL_SCENE_SETTINGS;
    } catch {
      return INITIAL_SCENE_SETTINGS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('pw_reservations');
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('pw_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart & UI Modals
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Scroll Tracking State for 3D Pinned Stage (0.0 to 1.0)
  const [stageProgress, setStageProgress] = useState(0);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pw_cafe_data', JSON.stringify(cafeData));
      document.title = `${cafeData.name} – Artisan 3D Coffee & Specialty Roastery | ${cafeData.address}`;
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [cafeData]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_menu_items', JSON.stringify(menuItems));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_scene_settings', JSON.stringify(sceneSettings));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [sceneSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [orders]);

  // --- PRECISE PINNED STAGE SCROLL TRACKING ---
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const stageEl = document.getElementById('story-experience');
          if (stageEl) {
            const startY = stageEl.offsetTop;
            const totalScrollable = stageEl.offsetHeight - window.innerHeight;
            if (totalScrollable > 0) {
              const currentY = window.scrollY - startY;
              const norm = Math.min(Math.max(currentY / totalScrollable, 0), 1);
              setStageProgress(norm);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Jump to specific progress milestone within the pinned stage
  const handleJumpToProgress = useCallback((targetProgress: number) => {
    const stageEl = document.getElementById('story-experience');
    if (stageEl) {
      const startY = stageEl.offsetTop;
      const totalScrollable = stageEl.offsetHeight - window.innerHeight;
      const targetY = startY + targetProgress * totalScrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }, []);

  // Scroll to section element by ID
  const handleScrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Cart operations
  const handleAddToCart = (orderItem: OrderItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.item.id === orderItem.item.id &&
          JSON.stringify(i.customization) === JSON.stringify(orderItem.customization)
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += orderItem.quantity;
        return copy;
      }
      return [...prev, orderItem];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== index);
      }
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Reservation operation
  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
  };

  // Reset to factory defaults
  const handleResetDefaults = () => {
    setCafeData(INITIAL_CAFE_DATA);
    setMenuItems(INITIAL_MENU_ITEMS);
    setSceneSettings(INITIAL_SCENE_SETTINGS);
    setReservations(INITIAL_RESERVATIONS);
    setOrders([]);
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#f5f5f4] relative selection:bg-[#c29b62] selection:text-[#0c0a09]">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar cafeData={cafeData} />

      {/* 2. THREE-ZONE TOP NAVIGATION BAR */}
      <Navbar
        cafeData={cafeData}
        cartCount={cartItems.reduce((acc, c) => acc + c.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollTo={handleScrollToSection}
      />

      {/* 3. CENTERPIECE: 3D THREE.JS WEBGL COFFEE SCENE */}
      {/* Ultra-realistic rendering with dynamic choreographed positioning */}
      <CoffeeScene3D
        scrollProgress={stageProgress}
        activeChapter={0}
        sceneSettings={sceneSettings}
      />

      {/* 4. INTERACTIVE 3D SCROLL TIMELINE NAVIGATOR (DESKTOP) */}
      <InteractiveScrollNavigator
        scrollProgress={stageProgress}
        onJumpToProgress={handleJumpToProgress}
      />

      {/* 5. PINNED CHOREOGRAPHIC SCROLL STAGE */}
      {/*
          1. On scrolling, coffee comes in from the RIGHT with transition effect
          2. On further scrolling, the quote/ethos appears on the left
          3. On further scrolling, all things disappear except the 3D coffee, and it moves to the LEFT
          4. Steam moves & Roast details appear on the right
          5. Text disappears, coffee moves to CENTER-RIGHT
          6. Milk flows in with 3D stream & rosetta bloom, details on the left
          7. Text disappears, coffee moves to RIGHT
          8. Ice cube drops with splash droplets & frost, details on the left
          9. Text disappears, coffee moves to LEFT
          10. Sugar dissolves in golden shimmer rings, details on the right
          11. All text dissolves, coffee centers for 360 spin with 3D floating roasted beans!
      */}
      <PinnedScrollStage
        cafeData={cafeData}
        scrollProgress={stageProgress}
        onScrollToSection={handleScrollToSection}
      />

      {/* 6. MAIN CONTENT SECTIONS BELOW PINNED STAGE */}
      <main className="relative z-10 bg-[#0c0a09]">
        {/* SIGNATURE BREW ODYSSEY / MENU */}
        <MenuSection
          menuItems={menuItems}
          onAddToCart={handleAddToCart}
        />

        {/* COFFEE PHOTO GALLERY */}
        <CoffeeGallerySection />

        {/* ROASTERY HERITAGE & BANK MORE LAB */}
        <CafeStorySection
          cafeData={cafeData}
          onScrollToReservation={() => handleScrollToSection('reservation-section')}
        />

        {/* VERIFIED GUEST REVIEWS */}
        <ReviewsSection />

        {/* TABLE RESERVATIONS & DIRECT CONTACT (PHONE 8523647915 / BANK MORE) */}
        <ReservationSection
          cafeData={cafeData}
          onAddReservation={handleAddReservation}
        />
      </main>

      {/* 7. REFINED FOOTER */}
      <Footer
        cafeData={cafeData}
        onScrollTo={handleScrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 8. CART SLIDEOUT DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        cafePhone={cafeData.phone}
      />

      {/* 9. CAFE OWNER ADMIN PANEL */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        cafeData={cafeData}
        onUpdateCafeData={setCafeData}
        menuItems={menuItems}
        onUpdateMenuItems={setMenuItems}
        sceneSettings={sceneSettings}
        onUpdateSceneSettings={setSceneSettings}
        reservations={reservations}
        onUpdateReservations={setReservations}
        orders={orders}
        onUpdateOrders={setOrders}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
