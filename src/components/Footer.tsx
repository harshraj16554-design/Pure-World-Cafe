import React from 'react';
import { Phone, MapPin, Mail, Instagram, ArrowUp } from 'lucide-react';
import { CafeData } from '../types';

interface FooterProps {
  cafeData: CafeData;
  onScrollTo: (id: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ cafeData, onScrollTo, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-[#0c0a09] border-t border-[#292524] text-[#a8a29e] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#292524]">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-serif font-semibold text-[#f5f5f4] tracking-tight">
              {cafeData.name}
            </h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Specialty micro-lot coffee roasters and 3D sensory cafe experience located at Bank More.
              Crafting every pour with obsessive attention to origin, temperature, and texture.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#78716c] hover:text-[#c29b62] underline transition-colors"
              >
                Owner & Barista Admin Console
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#d6d3d1]">
              Sensory Experience
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('story-experience')}
                  className="hover:text-[#f5f5f4] transition-colors"
                >
                  3D Living Coffee Cup
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('menu-section')}
                  className="hover:text-[#f5f5f4] transition-colors"
                >
                  Single Estate Espresso
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('menu-section')}
                  className="hover:text-[#f5f5f4] transition-colors"
                >
                  Sub-Zero Cold Brews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('menu-section')}
                  className="hover:text-[#f5f5f4] transition-colors"
                >
                  Bank More Bakery
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#d6d3d1]">
              Bank More Flagship
            </div>
            <ul className="space-y-2 text-[#78716c]">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c29b62] shrink-0 mt-0.5" />
                <span>{cafeData.address}, {cafeData.city}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c29b62] shrink-0" />
                <a
                  href={`tel:${cafeData.phone}`}
                  className="hover:text-[#f5f5f4] font-mono text-[#e0b878] transition-colors"
                >
                  {cafeData.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c29b62] shrink-0" />
                <span>{cafeData.email}</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Reserve */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#d6d3d1]">
              Roastery Hours
            </div>
            <p className="text-xs text-[#78716c] leading-relaxed">
              {cafeData.hours}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onScrollTo('reservation-section')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors"
              >
                Reserve Tasting Table
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716c]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {cafeData.name}. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Bank More, Dhanbad</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[#c29b62]">Direct: {cafeData.phone}</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-1.5 hover:text-[#f5f5f4] transition-colors"
              title="Return to Top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
