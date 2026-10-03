import React from 'react';
import { Sparkles, MapPin, Phone } from 'lucide-react';
import { CafeData } from '../types';

interface AnnouncementBarProps {
  cafeData: CafeData;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ cafeData }) => {
  return (
    <div className="bg-[#1c1917] border-b border-[#292524] text-xs py-2 px-4 text-[#d6d3d1] z-50 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-[#c29b62] shrink-0" />
          <span className="font-medium text-[#f5f5f4]">{cafeData.announcement}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[#a8a29e] text-[11px]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#c29b62]" />
            <span>{cafeData.address}</span>
          </div>
          <span aria-hidden="true" className="text-[#44403c]">·</span>
          <a
            href={`tel:${cafeData.phone}`}
            className="flex items-center gap-1.5 hover:text-[#e0b878] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#c29b62]" />
            <span className="font-mono">{cafeData.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
