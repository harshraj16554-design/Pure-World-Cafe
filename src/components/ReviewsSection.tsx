import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    id: 'rev-1',
    name: 'Priya Mukherjee',
    role: 'Architect & Daily Regular',
    rating: 5,
    comment:
      'The best specialty coffee in Dhanbad without question. The Bank More roastery has a serene Nordic ambiance, and their signature Rosetta Latte with the house roast has exceptional caramel crema depth.',
    date: '3 days ago',
    favorite: 'Signature Rosetta Latte',
  },
  {
    id: 'rev-2',
    name: 'Vikramaditya Sengupta',
    role: 'Software Engineer',
    rating: 5,
    comment:
      'The 3D interactive site drew me in, but the real coffee blew me away. The Sub-Zero Glacier Cold Brew has zero bitterness, only crisp bergamot and honey notes. Super fast service and warm baristas.',
    date: '1 week ago',
    favorite: 'Glacier Cold Brew',
  },
  {
    id: 'rev-3',
    name: 'Dr. Sameer Khan',
    role: 'Cardiologist',
    rating: 5,
    comment:
      'I appreciate the scientific precision. 93°C PID extraction and fresh roasted beans make a tremendous difference in flavor. The croissant was buttery and baked to golden perfection.',
    date: '2 weeks ago',
    favorite: 'V60 Pour-Over Geisha',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section id="guest-reviews" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[#0c0a09]/95 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-2">
              <span>Guest Experiences</span>
              <span aria-hidden="true">·</span>
              <span>Bank More Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug">
              Loved by Coffee Purists <br />
              <span className="italic font-normal text-[#e0b878]">& Everyday Dreamers</span>
            </h2>
          </div>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-xl flex items-center gap-4 shrink-0">
            <div className="font-mono text-3xl font-bold text-[#e0b878]">4.9</div>
            <div className="space-y-1">
              <div className="flex text-[#e0b878]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-xs text-[#a8a29e]">Over 540+ verified local ratings</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <article
              key={rev.id}
              className="bg-[#141210] border border-[#292524] rounded-xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#e0b878]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#78716c]">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#d6d3d1] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#292524] mt-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f5f5f4]">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#c29b62]" />
                  </div>
                  <div className="text-[11px] text-[#78716c]">{rev.role}</div>
                </div>

                <div className="text-[11px] font-mono text-[#c29b62]">
                  {rev.favorite}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
