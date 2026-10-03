import React from 'react';
import { Phone, ShoppingBag, Settings2, Compass } from 'lucide-react';
import { CafeData } from '../types';

interface NavbarProps {
  cafeData: CafeData;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onScrollTo: (elementId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cafeData,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onScrollTo,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0c0a09]/80 backdrop-blur-md border-b border-[#292524]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-[#f5f5f4] hover:text-[#e0b878] transition-colors"
        >
          {cafeData.name}
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#a8a29e]">
          <button
            onClick={() => onScrollTo('story-experience')}
            className="hover:text-[#f5f5f4] transition-colors cursor-pointer"
          >
            3D Experience
          </button>
          <button
            onClick={() => onScrollTo('menu-section')}
            className="hover:text-[#f5f5f4] transition-colors cursor-pointer"
          >
            Brew Odyssey
          </button>
          <button
            onClick={() => onScrollTo('roastery-story')}
            className="hover:text-[#f5f5f4] transition-colors cursor-pointer"
          >
            Bank More Roastery
          </button>
          <button
            onClick={() => onScrollTo('guest-reviews')}
            className="hover:text-[#f5f5f4] transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <button
            onClick={() => onScrollTo('reservation-section')}
            className="hover:text-[#f5f5f4] transition-colors cursor-pointer"
          >
            Reserve Table
          </button>
        </nav>

        {/* Zone 3: Actions with Admin Panel Icon on the far top right */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Call Button with Phone 8523647915 */}
          <a
            href={`tel:${cafeData.phone}`}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#e0b878] bg-[#1c1917] hover:bg-[#292524] border border-[#44403c]/60 rounded-md transition-colors"
            title="Call Pure World Cafe"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="font-mono tracking-wider">{cafeData.phone}</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#d6d3d1] hover:text-[#f5f5f4] bg-[#1c1917] hover:bg-[#292524] border border-[#292524] rounded-md transition-colors cursor-pointer"
            aria-label="View Order Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c29b62] text-[#0c0a09] font-mono text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Reserve CTA */}
          <button
            onClick={() => onScrollTo('reservation-section')}
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-all whitespace-nowrap shadow-sm cursor-pointer"
          >
            Book Table
          </button>

          {/* Dedicated Admin Panel Icon on the TOP RIGHT SIDE */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#e0b878] hover:text-[#f5f5f4] bg-[#1c1917] hover:bg-[#2a241e] border border-[#c29b62]/40 hover:border-[#c29b62] rounded-md transition-all cursor-pointer shadow-sm ml-1"
            title="Cafe Admin Panel (Password Protected)"
            aria-label="Open Admin Panel"
          >
            <Settings2 className="w-4 h-4 text-[#c29b62]" />
            <span className="font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
