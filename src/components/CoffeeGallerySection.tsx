import React from 'react';

const GALLERY_IMAGES = [
  { src: '/images/latte-art-greenery.jpg', alt: 'Twin rosetta lattes among fresh greenery', caption: 'Rosetta Bloom', span: 'md:col-span-2 md:row-span-2' },
  { src: '/images/roasted-beans.jpg', alt: 'Freshly roasted coffee beans', caption: 'Small-Batch Roast', span: '' },
  { src: '/images/iced-latte-chemex.jpg', alt: 'Iced latte beside a Chemex brewer', caption: 'Iced Slow Bar', span: 'md:row-span-2' },
  { src: '/images/espresso-flatlay.jpg', alt: 'Espresso tools and latte on a wooden board', caption: 'Bean to Cup', span: '' },
  { src: '/images/latte-cheers.jpg', alt: 'Friends clinking latte cups', caption: 'Shared Moments', span: 'md:col-span-2' },
  { src: '/images/portafilter-trio.jpg', alt: 'Portafilters with beans, grounds and latte', caption: 'Espresso Craft', span: '' },
  { src: '/images/morning-black-coffee.jpg', alt: 'Black coffee with crema on a wooden table', caption: 'Morning Ritual', span: '' },
  { src: '/images/coffee-circle.jpg', alt: 'Circle of coffee cups seen from above', caption: 'Cupping Table', span: 'md:col-span-2' },
  { src: '/images/cafe-neon-sign.jpg', alt: 'Warm cafe interior with illuminated CAFE sign', caption: 'Our Space', span: 'md:col-span-2' },
];

export const CoffeeGallerySection: React.FC = () => {
  return (
    <section id="coffee-gallery" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-[#0c0a09] border-t border-[#292524]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-2">
            <span>The Gallery</span>
            <span aria-hidden="true">·</span>
            <span>Moments in Every Cup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug">
            A Visual Love Letter <br />
            <span className="italic font-normal text-[#e0b878]">To Great Coffee</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((img) => (
            <figure
              key={img.src}
              className={`group relative overflow-hidden rounded-xl border border-[#292524] bg-[#141210] ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              <figcaption className="absolute bottom-3 left-4 text-xs font-mono uppercase tracking-wider text-[#e0b878]">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
