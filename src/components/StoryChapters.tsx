import React from 'react';
import { Flame, Droplets, Snowflake, Sparkles, Coffee, ArrowDown, ChevronRight } from 'lucide-react';
import { CafeData } from '../types';

interface StoryChaptersProps {
  cafeData: CafeData;
  activeChapter: number;
  onScrollToSection: (id: string) => void;
  onSelectChapter: (index: number) => void;
}

export const StoryChapters: React.FC<StoryChaptersProps> = ({
  cafeData,
  activeChapter,
  onScrollToSection,
  onSelectChapter,
}) => {
  return (
    <div id="story-experience" className="relative z-10">
      {/* CHAPTER 0: HERO / THE AWAKENING */}
      <section className="min-h-screen flex items-center justify-start px-6 sm:px-12 lg:px-24 py-32">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] tracking-widest uppercase mb-4">
            <span>Pure World Roastery</span>
            <span aria-hidden="true">·</span>
            <span>Bank More</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#f5f5f4] tracking-tight leading-[1.08] mb-6">
            Coffee Brought <br />
            <span className="italic font-normal text-[#e0b878]">To Pure Life.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#a8a29e] leading-relaxed mb-8 max-w-xl">
            Welcome to {cafeData.name}. Immerse yourself in a living, scroll-driven
            3D sensory ritual. Scroll downward to watch steam rise, velvety milk flow,
            sub-zero ice cubes drop, and golden sugar dissolve in real time.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onScrollToSection('menu-section')}
              className="px-6 py-3 text-sm font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Explore Brew Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectChapter(1)}
              className="px-5 py-3 text-sm font-medium text-[#d6d3d1] hover:text-[#f5f5f4] bg-[#1c1917]/80 hover:bg-[#292524] border border-[#292524] rounded-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Begin 3D Journey</span>
              <ArrowDown className="w-4 h-4 text-[#c29b62] animate-bounce" />
            </button>
          </div>

          <div className="mt-14 flex items-center gap-6 text-xs text-[#78716c]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Barista Bar Open Today</span>
            </div>
            <span aria-hidden="true">·</span>
            <span>Estate Arabica 100%</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Call {cafeData.phone}</span>
          </div>
        </div>
      </section>

      {/* CHAPTER 1: STEAM MOVES */}
      <section className="min-h-screen flex items-center justify-end px-6 sm:px-12 lg:px-24 py-32">
        <div className="max-w-xl bg-[#0c0a09]/75 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-[#292524]/80 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-[#e0b878]" />
            <span>Chapter 01</span>
            <span aria-hidden="true">·</span>
            <span>Thermal Extraction</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-4">
            The Living Steam <br />
            <span className="italic font-normal text-[#e0b878]">& Aromatic Bloom</span>
          </h2>

          <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed mb-6">
            At 93°C under 9 bars of pressure, pure water unlocks volatile aromatic compounds
            hidden deep inside our single-estate beans. Notice the wisps of steam curling and
            twisting in 3D space above the rich hazelnut crema as the cup tilts toward your gaze.
          </p>

          <div className="space-y-3 border-t border-[#292524] pt-5 text-xs text-[#d6d3d1]">
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Brew Temperature</span>
              <span className="font-mono font-medium text-[#f5f5f4]">93.2°C Precision PID</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Aroma Notes</span>
              <span className="font-medium text-[#e0b878]">Toasted Macadamia, Dark Plum, Jasmine</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Extraction Yield</span>
              <span className="font-mono font-medium text-[#f5f5f4]">21.4% Golden Cup Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 2: MILK FLOWS IN */}
      <section className="min-h-screen flex items-center justify-start px-6 sm:px-12 lg:px-24 py-32">
        <div className="max-w-xl bg-[#0c0a09]/75 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-[#292524]/80 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-3">
            <Droplets className="w-3.5 h-3.5 text-[#e0b878]" />
            <span>Chapter 02</span>
            <span aria-hidden="true">·</span>
            <span>Microfoam Fusion</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-4">
            Velvety Milk Flows In <br />
            <span className="italic font-normal text-[#e0b878]">& The Rosetta Blooms</span>
          </h2>

          <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed mb-6">
            Watch the glossy stream of velvety textured milk cascade from above, piercing the dark
            surface and swirling underneath before blooming into an intricate rosetta pattern.
            Steamed to 65°C to preserve natural sweetness and create a microfoam texture like liquid silk.
          </p>

          <div className="space-y-3 border-t border-[#292524] pt-5 text-xs text-[#d6d3d1]">
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Milk Texture</span>
              <span className="font-medium text-[#f5f5f4]">Microfoam &lt; 0.1mm micro-bubbles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Latte Art Pattern</span>
              <span className="font-medium text-[#e0b878]">Seven-Tier Rosetta Floret</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Dairy / Vegan Options</span>
              <span className="font-medium text-[#f5f5f4]">Farm Fresh, Oatly Barista, Almond</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: ICE CUBE DROP */}
      <section className="min-h-screen flex items-center justify-end px-6 sm:px-12 lg:px-24 py-32">
        <div className="max-w-xl bg-[#0c0a09]/75 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-[#292524]/80 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-3">
            <Snowflake className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Chapter 03</span>
            <span aria-hidden="true">·</span>
            <span>Cold Elevation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-4">
            Crystalline Ice Drops <br />
            <span className="italic font-normal text-[#38bdf8]">& Splash of Sub-Zero Clarity</span>
          </h2>

          <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed mb-6">
            For our cold brew and iced espresso enthusiasts: watch precision-cut crystal ice cubes
            tumble down with physics acceleration, plunging into the drink with dynamic splash
            droplets and frosty condensation clinging to the cup rim.
          </p>

          <div className="space-y-3 border-t border-[#292524] pt-5 text-xs text-[#d6d3d1]">
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Cold Steep Duration</span>
              <span className="font-mono font-medium text-[#f5f5f4]">18-Hour Slow Kyoto Method</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Ice Structure</span>
              <span className="font-medium text-[#38bdf8]">Clear Crystalline Block (Zero Air)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Serving Temp</span>
              <span className="font-mono font-medium text-[#f5f5f4]">2.5°C Chilled Perfection</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 4: SUGAR DISSOLVES */}
      <section className="min-h-screen flex items-center justify-start px-6 sm:px-12 lg:px-24 py-32">
        <div className="max-w-xl bg-[#0c0a09]/75 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-[#292524]/80 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
            <span>Chapter 04</span>
            <span aria-hidden="true">·</span>
            <span>Sweet Dissolution</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-4">
            Organic Cane Sugar <br />
            <span className="italic font-normal text-[#facc15]">Dissolves in Golden Shimmer</span>
          </h2>

          <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed mb-6">
            Fine crystalline grains of unrefined raw Demerara sugar rain down through the air,
            striking the coffee meniscus and sinking down in rippling golden circles that sweeten
            the dark roast with notes of caramel toffee and molasses.
          </p>

          <div className="space-y-3 border-t border-[#292524] pt-5 text-xs text-[#d6d3d1]">
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Sweetener Origin</span>
              <span className="font-medium text-[#f5f5f4]">Single-Mill Unrefined Demerara</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Dissolution Velocity</span>
              <span className="font-mono font-medium text-[#facc15]">Instant Melt at 68°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#78716c]">Balance Profile</span>
              <span className="font-medium text-[#f5f5f4]">Zero Acridity, Deep Toasted Caramel</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 5: FLOATING BEANS & 360 ODYSSEY */}
      <section className="min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-24 py-32 text-center">
        <div className="max-w-3xl bg-[#0c0a09]/80 backdrop-blur-md p-10 sm:p-14 rounded-3xl border border-[#292524] shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-4">
            <Coffee className="w-4 h-4 text-[#e0b878]" />
            <span>Chapter 05</span>
            <span aria-hidden="true">·</span>
            <span>Artisan Harmony</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#f5f5f4] font-light leading-tight mb-6">
            The Masterpiece Complete. <br />
            <span className="italic font-normal text-[#e0b878]">Now Taste The Pure World.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#a8a29e] leading-relaxed mb-8 max-w-2xl mx-auto">
            The 3D coffee beans orbit gracefully in depth of field, framing your perfected cup.
            From our roasting drum at Bank More directly to your ceramic mug, discover every hand-crafted
            brew and fresh morning bake below.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onScrollToSection('menu-section')}
              className="px-7 py-3.5 text-sm font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-all shadow-lg cursor-pointer"
            >
              Order & Taste Now
            </button>
            <button
              onClick={() => onScrollToSection('reservation-section')}
              className="px-6 py-3.5 text-sm font-medium text-[#f5f5f4] bg-[#1c1917] hover:bg-[#292524] border border-[#3f3933] rounded-md transition-colors cursor-pointer"
            >
              Reserve a Table at Bank More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
