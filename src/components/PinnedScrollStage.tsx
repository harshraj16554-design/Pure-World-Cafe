import React, { useRef, useEffect } from 'react';
import { Flame, Droplets, Snowflake, Sparkles, Coffee, ChevronRight, Phone, ArrowDown } from 'lucide-react';
import { CafeData } from '../types';

interface PinnedScrollStageProps {
  cafeData: CafeData;
  scrollProgress: number; // 0.0 to 1.0 of the pinned stage
  onScrollToSection: (id: string) => void;
}

export const PinnedScrollStage: React.FC<PinnedScrollStageProps> = ({
  cafeData,
  scrollProgress,
  onScrollToSection,
}) => {
  // Smooth calculation of opacity and transform offsets for each text phase
  // Phase 1: Quote (0.08 - 0.20)
  const quoteOpacity = Math.max(
    0,
    Math.min(
      (scrollProgress - 0.07) / 0.04, // fade in
      (0.21 - scrollProgress) / 0.03  // fade out
    )
  );

  // Phase 2: Steam & Roast (0.28 - 0.40)
  const steamOpacity = Math.max(
    0,
    Math.min(
      (scrollProgress - 0.27) / 0.04,
      (0.41 - scrollProgress) / 0.03
    )
  );

  // Phase 3: Milk Pour (0.48 - 0.62)
  const milkOpacity = Math.max(
    0,
    Math.min(
      (scrollProgress - 0.47) / 0.04,
      (0.63 - scrollProgress) / 0.03
    )
  );

  // Phase 4: Ice Drop (0.69 - 0.82)
  const iceOpacity = Math.max(
    0,
    Math.min(
      (scrollProgress - 0.68) / 0.04,
      (0.83 - scrollProgress) / 0.03
    )
  );

  // Phase 5: Sugar Dissolve (0.87 - 0.95)
  const sugarOpacity = Math.max(
    0,
    Math.min(
      (scrollProgress - 0.86) / 0.03,
      (0.955 - scrollProgress) / 0.025
    )
  );

  // Phase 6: Final 360 Masterpiece (0.96 - 1.0)
  const finalOpacity = Math.max(0, Math.min((scrollProgress - 0.955) / 0.03, 1));

  // Initial scroll hint (0.00 - 0.08)
  const hintOpacity = Math.max(0, (0.08 - scrollProgress) / 0.05);

  return (
    <div id="story-experience" className="relative w-full h-[620vh]">
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none flex items-center">
        {/* INITIAL SCROLL HINT (When coffee enters from right) */}
        {hintOpacity > 0 && (
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-auto transition-opacity px-4"
            style={{ opacity: hintOpacity }}
          >
            <span className="text-xs sm:text-sm font-medium tracking-wide text-[#e0b878] text-center drop-shadow-md">
              Enjoy your perfect day with a cup of special coffee
            </span>
          </div>
        )}

        {/* =========================================================================
            PHASE 1: THE FIRST QUOTE & AWAKENING (Appears on the LEFT)
            Cup is stationed on the RIGHT.
           ========================================================================= */}
        {quoteOpacity > 0 && (
          <div
            className="absolute left-4 right-4 sm:right-auto sm:left-12 lg:left-24 max-w-xl z-20 pointer-events-auto transition-all duration-300"
            style={{
              opacity: quoteOpacity,
              transform: `translateY(${(1 - quoteOpacity) * 20}px)`,
            }}
          >
            <div className="p-6 sm:p-0 bg-[#0c0a09]/80 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none rounded-2xl sm:rounded-none border border-[#292524]/70 sm:border-none shadow-xl sm:shadow-none">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-widest mb-3">
                <span>Pure World Roastery</span>
                <span aria-hidden="true">·</span>
                <span>Bank More</span>
              </div>

              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-light text-[#f5f5f4] tracking-tight leading-[1.1] mb-5">
                Coffee Brought <br />
                <span className="italic font-normal text-[#e0b878]">To Pure Life.</span>
              </h1>

              <p className="text-xs sm:text-base text-[#a8a29e] leading-relaxed mb-6">
                "True coffee is an art of patience, precision chemistry, and deep sensory reverence.
                Handcrafted daily in Bank More from shade-grown single estates."
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onScrollToSection('menu-section')}
                  className="px-5 py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Explore Menu</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`tel:${cafeData.phone}`}
                  className="px-4 py-2.5 text-xs font-mono font-medium text-[#d6d3d1] hover:text-[#f5f5f4] bg-[#1c1917]/90 border border-[#292524] rounded-md transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c29b62]" />
                  <span>Call {cafeData.phone}</span>
                </a>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs text-[#78716c]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scroll down to see the coffee move</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 2: STEAM MOVES & ROAST (Appears on the RIGHT)
            Cup has moved to the LEFT and tilts forward; steam curls upward!
           ========================================================================= */}
        {steamOpacity > 0 && (
          <div
            className="absolute left-4 right-4 sm:left-auto sm:right-12 lg:right-24 max-w-lg z-20 pointer-events-auto transition-all duration-300"
            style={{
              opacity: steamOpacity,
              transform: `translateY(${(1 - steamOpacity) * 20}px)`,
            }}
          >
            <div className="bg-[#0c0a09]/85 backdrop-blur-md p-6 sm:p-9 rounded-2xl border border-[#292524] shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-2.5">
                <Flame className="w-3.5 h-3.5 text-[#e0b878]" />
                <span>01. Thermal Extraction</span>
                <span aria-hidden="true">·</span>
                <span>Steam Moves</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-3">
                The Living Steam <br />
                <span className="italic font-normal text-[#e0b878]">& Aromatic Bloom</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed mb-4">
                Notice the wisps of hot volumetric steam curling and twisting in real 3D space above
                the rich crema. Water heated to 93°C unlocks aromatic jasmine, toasted cocoa, and plum oils.
              </p>

              <div className="space-y-2 border-t border-[#292524] pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Extraction Temp</span>
                  <span className="font-mono font-medium text-[#f5f5f4]">93.2°C PID Stabilized</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Aromas</span>
                  <span className="font-medium text-[#e0b878]">Toasted Hazelnut, Wild Honey</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 3: MILK FLOWS IN & ROSETTA BLOOM (Appears on the LEFT)
            Cup is on the CENTER-RIGHT; 3D milk stream pours in!
           ========================================================================= */}
        {milkOpacity > 0 && (
          <div
            className="absolute left-4 right-4 sm:right-auto sm:left-12 lg:left-24 max-w-lg z-20 pointer-events-auto transition-all duration-300"
            style={{
              opacity: milkOpacity,
              transform: `translateY(${(1 - milkOpacity) * 20}px)`,
            }}
          >
            <div className="bg-[#0c0a09]/85 backdrop-blur-md p-6 sm:p-9 rounded-2xl border border-[#292524] shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-2.5">
                <Droplets className="w-3.5 h-3.5 text-[#e0b878]" />
                <span>02. Microfoam Fusion</span>
                <span aria-hidden="true">·</span>
                <span>Milk Flows In</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-3">
                Velvety Milk Flows In <br />
                <span className="italic font-normal text-[#e0b878]">& Rosetta Blooms</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed mb-4">
                Watch the glossy stream of velvety textured milk cascade into the cup center,
                causing ripple waves and blooming into an intricate rosetta latte art on the surface.
              </p>

              <div className="space-y-2 border-t border-[#292524] pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Steam Temperature</span>
                  <span className="font-mono font-medium text-[#f5f5f4]">65°C Silk Microfoam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Art Pattern</span>
                  <span className="font-medium text-[#e0b878]">7-Tier Rosetta Floret</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 4: ICE CUBE DROP & SUB-ZERO (Appears on the LEFT)
            Cup is on the RIGHT; crystalline ice cubes tumble in with splash!
           ========================================================================= */}
        {iceOpacity > 0 && (
          <div
            className="absolute left-4 right-4 sm:right-auto sm:left-12 lg:left-24 max-w-lg z-20 pointer-events-auto transition-all duration-300"
            style={{
              opacity: iceOpacity,
              transform: `translateY(${(1 - iceOpacity) * 20}px)`,
            }}
          >
            <div className="bg-[#0c0a09]/85 backdrop-blur-md p-6 sm:p-9 rounded-2xl border border-[#292524] shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider mb-2.5">
                <Snowflake className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>03. Cold Elevation</span>
                <span aria-hidden="true">·</span>
                <span>Ice Cube Drop</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-3">
                Crystalline Ice Drops <br />
                <span className="italic font-normal text-[#38bdf8]">& Sub-Zero Splash</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed mb-4">
                Precision-cut crystal ice blocks plunge into the brew with physics acceleration,
                sending splash droplets airborne and creating frosted condensation around the cup.
              </p>

              <div className="space-y-2 border-t border-[#292524] pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Brew Method</span>
                  <span className="font-mono font-medium text-[#f5f5f4]">18-Hour Kyoto Drip</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Serving Temp</span>
                  <span className="font-mono font-medium text-[#38bdf8]">2.5°C Chilled Glacier</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 5: SUGAR DISSOLVE (Appears on the RIGHT)
            Cup is on the LEFT; cane sugar crystals rain down & dissolve in gold shimmer!
           ========================================================================= */}
        {sugarOpacity > 0 && (
          <div
            className="absolute left-4 right-4 sm:left-auto sm:right-12 lg:right-24 max-w-lg z-20 pointer-events-auto transition-all duration-300"
            style={{
              opacity: sugarOpacity,
              transform: `translateY(${(1 - sugarOpacity) * 20}px)`,
            }}
          >
            <div className="bg-[#0c0a09]/85 backdrop-blur-md p-6 sm:p-9 rounded-2xl border border-[#292524] shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#facc15] uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                <span>04. Sweet Harmony</span>
                <span aria-hidden="true">·</span>
                <span>Sugar Dissolves</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug mb-3">
                Organic Cane Sugar <br />
                <span className="italic font-normal text-[#facc15]">Dissolves in Golden Rings</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed mb-4">
                Crystalline grains of raw Demerara cane sugar sprinkle down from above,
                dissolving on impact into shimmering golden ripples of toasted molasses and caramel.
              </p>

              <div className="space-y-2 border-t border-[#292524] pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Sugar Origin</span>
                  <span className="font-medium text-[#f5f5f4]">Unrefined Single-Mill Demerara</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#78716c]">Finish</span>
                  <span className="font-medium text-[#facc15]">Toffee Brittle & Caramel Crema</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 6: 360 FULL ODYSSEY & FLOATING BEANS (CENTER)
            Cup centers, 360 rotation with floating roasted coffee beans!
           ========================================================================= */}
        {finalOpacity > 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-20 pointer-events-auto transition-all duration-300"
            style={{
              opacity: finalOpacity,
              transform: `scale(${0.96 + finalOpacity * 0.04})`,
            }}
          >
            <div className="max-w-2xl w-full bg-[#0c0a09]/90 backdrop-blur-md p-6 sm:p-10 lg:p-12 rounded-3xl border border-[#292524] shadow-2xl text-center space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider">
                <Coffee className="w-4 h-4 text-[#e0b878]" />
                <span>The Masterpiece Complete</span>
                <span aria-hidden="true">·</span>
                <span>Bank More</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f5f5f4] font-light leading-tight">
                Crafted to Perfection. <br />
                <span className="italic font-normal text-[#e0b878]">Now Taste Pure World.</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed max-w-lg mx-auto">
                With roasted beans orbiting in 3D depth, the sensory journey arrives at your cup.
                Scroll down to explore our full brew menu, reserve a tasting table, or order pickup.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onScrollToSection('menu-section')}
                  className="px-5 py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Explore Brew Menu</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onScrollToSection('reservation-section')}
                  className="px-4 py-2.5 text-xs font-medium text-[#f5f5f4] bg-[#1c1917] hover:bg-[#292524] border border-[#292524] rounded-md transition-colors cursor-pointer"
                >
                  Reserve Table at Bank More
                </button>
              </div>

              <div className="text-[11px] font-mono text-[#78716c]">
                Direct Roastery Concierge: <span className="text-[#c29b62] font-semibold">{cafeData.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
