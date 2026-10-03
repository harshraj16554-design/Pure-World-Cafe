import React from 'react';
import { MapPin, Phone, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CafeData } from '../types';

interface CafeStorySectionProps {
  cafeData: CafeData;
  onScrollToReservation: () => void;
}

export const CafeStorySection: React.FC<CafeStorySectionProps> = ({
  cafeData,
  onScrollToReservation,
}) => {
  return (
    <section id="roastery-story" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-[#0c0a09] border-t border-[#292524]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="relative">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#292524] shadow-2xl bg-[#141210]">
              <img
                src="/src/assets/images/cafe_interior_bankmore_1791032831382.jpg"
                alt="Pure World Cafe Roastery Interior at Bank More"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent opacity-60" />
            </div>

            {/* Quiet Location Badge / Card */}
            <div className="mt-4 p-5 bg-[#141210] border border-[#292524] rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1c1917] border border-[#292524] flex items-center justify-center text-[#c29b62] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#c29b62]">Flagship Space</div>
                  <div className="text-sm font-semibold text-[#f5f5f4]">{cafeData.address}, Dhanbad</div>
                </div>
              </div>

              <a
                href={`tel:${cafeData.phone}`}
                className="px-3.5 py-2 text-xs font-mono font-medium text-[#e0b878] bg-[#1c1917] hover:bg-[#292524] border border-[#3f3933] rounded-md transition-colors shrink-0"
              >
                {cafeData.phone}
              </a>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider">
              <span>Our Philosophy</span>
              <span aria-hidden="true">·</span>
              <span>Direct Farm Relationships</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#f5f5f4] font-light leading-tight">
              Crafting Pure Coffee <br />
              <span className="italic font-normal text-[#e0b878]">In The Heart of Bank More</span>
            </h2>

            <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed">
              Pure World Cafe was founded on a simple conviction: true coffee is an art of patience,
              precision chemistry, and deep respect for the growers. Located prominently in Bank More,
              our roastery brings world-class micro-lot coffee beans directly from shade-grown estates
              in Chikmagalur and Yirgacheffe straight to your cup.
            </p>

            <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed">
              Every morning begins with calibration cuppings. We test moisture levels, dial grind particle
              distributions to the micron, and roast on small-batch infrared drums to preserve the natural
              jasmine, berry, and cacao notes born in the soil.
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#292524]">
              <div>
                <div className="flex items-center gap-2 text-[#e0b878] mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">SCA 86+ Grade</span>
                </div>
                <p className="text-xs text-[#78716c]">Top 3% of Arabica harvest certified for specialty cupping.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#e0b878] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Small-Batch</span>
                </div>
                <p className="text-xs text-[#78716c]">Roasted 4kg at a time for absolute peak freshness.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#e0b878] mb-1">
                  <HeartHandshake className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Fair Trade</span>
                </div>
                <p className="text-xs text-[#78716c]">Direct premium paid directly to family coffee estates.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onScrollToReservation}
                className="px-6 py-3 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors cursor-pointer"
              >
                Plan Your Visit to Bank More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
