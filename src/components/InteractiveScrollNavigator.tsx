import React from 'react';
import { Flame, Droplets, Snowflake, Sparkles, Coffee, Compass } from 'lucide-react';

interface InteractiveScrollNavigatorProps {
  scrollProgress: number; // 0.0 to 1.0
  onJumpToProgress: (progress: number) => void;
}

const STAGES = [
  { target: 0.12, label: '01. The Quote', icon: Compass, desc: 'Awakening Ethos' },
  { target: 0.33, label: '02. Steam Moves', icon: Flame, desc: 'Aromatic Extraction' },
  { target: 0.54, label: '03. Milk Flows In', icon: Droplets, desc: 'Rosetta Bloom' },
  { target: 0.74, label: '04. Ice Cube Drop', icon: Snowflake, desc: 'Sub-Zero Clarity' },
  { target: 0.90, label: '05. Sugar Dissolve', icon: Sparkles, desc: 'Golden Shimmer' },
  { target: 0.98, label: '06. 360 Masterpiece', icon: Coffee, desc: 'Floating Beans' },
];

export const InteractiveScrollNavigator: React.FC<InteractiveScrollNavigatorProps> = ({
  scrollProgress,
  onJumpToProgress,
}) => {
  return (
    <aside
      aria-label="3D Choreography Timeline"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3 pointer-events-auto"
    >
      <div className="bg-[#141210]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#292524] shadow-2xl flex flex-col gap-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] pb-1.5 border-b border-[#292524] flex items-center justify-between gap-4">
          <span>3D Motion Stage</span>
          <span className="text-[#c29b62] font-semibold">{Math.round(scrollProgress * 100)}%</span>
        </div>

        {STAGES.map((stg, idx) => {
          // Detect if stage is currently in focus
          let isActive = false;
          if (idx === 0) isActive = scrollProgress >= 0.06 && scrollProgress < 0.24;
          else if (idx === 1) isActive = scrollProgress >= 0.24 && scrollProgress < 0.44;
          else if (idx === 2) isActive = scrollProgress >= 0.44 && scrollProgress < 0.65;
          else if (idx === 3) isActive = scrollProgress >= 0.65 && scrollProgress < 0.85;
          else if (idx === 4) isActive = scrollProgress >= 0.85 && scrollProgress < 0.95;
          else if (idx === 5) isActive = scrollProgress >= 0.95;

          const Icon = stg.icon;

          return (
            <button
              key={stg.label}
              onClick={() => onJumpToProgress(stg.target)}
              className={`group flex items-center gap-3 text-left transition-all py-1.5 px-2 rounded-md cursor-pointer ${
                isActive
                  ? 'bg-[#1c1917] text-[#f5f5f4]'
                  : 'text-[#78716c] hover:text-[#d6d3d1] hover:bg-[#181614]'
              }`}
            >
              <div className="flex flex-col text-right">
                <span className={`text-xs font-medium tracking-tight ${isActive ? 'text-[#e0b878]' : ''}`}>
                  {stg.label}
                </span>
                <span className="text-[10px] text-[#57534e]">{stg.desc}</span>
              </div>
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#c29b62] border-[#e0b878] scale-110 shadow-[0_0_8px_rgba(194,155,98,0.6)]'
                    : 'bg-transparent border-[#44403c] group-hover:border-[#78716c]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
