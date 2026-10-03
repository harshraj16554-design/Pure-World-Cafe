import React, { useState, useMemo } from 'react';
import { Coffee, Plus, Search, Check, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { MenuItem, OrderItem } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (orderItem: OrderItem) => void;
}

const CATEGORIES = [
  'All Brews',
  'Specialty Espresso',
  'Slow Bar & Pour Over',
  'Cold Brews & Nitro',
  'Signature Blends',
  'Artisan Bakery',
] as const;

export const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Brews');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Customization state
  const [selectedMilk, setSelectedMilk] = useState('Whole Farm Milk');
  const [selectedSweetness, setSelectedSweetness] = useState('Unsweetened (Pure)');
  const [selectedTemp, setSelectedTemp] = useState('Hot (65°C)');
  const [extraShot, setExtraShot] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Brews' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setSelectedMilk('Whole Farm Milk');
    setSelectedSweetness('Unsweetened (Pure)');
    setSelectedTemp(item.category.includes('Cold') ? 'Iced' : 'Hot (65°C)');
    setExtraShot(false);
  };

  const handleConfirmAddToCart = () => {
    if (!customizingItem) return;
    onAddToCart({
      item: customizingItem,
      quantity: 1,
      customization: {
        milk: selectedMilk,
        sweetness: selectedSweetness,
        temperature: selectedTemp,
        extraShot,
      },
    });
    setCustomizingItem(null);
  };

  return (
    <section id="menu-section" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-[#0c0a09]/90 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-2">
            <span>Sensory Selection</span>
            <span aria-hidden="true">·</span>
            <span>Bank More Roastery Lab</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#f5f5f4] font-light leading-tight mb-4">
            Curated Brews <br />
            <span className="italic font-normal text-[#e0b878]">& Fresh Morning Pastries</span>
          </h2>
          <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed">
            Every cup is dialed in daily on our custom Synesso espresso machine and slow bar V60 stations.
            All beans are roasted in small batches right here at Bank More.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#292524]">
          {/* Category Tabs (Buttons with click handlers) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#c29b62] text-[#0c0a09] font-semibold'
                    : 'text-[#a8a29e] hover:text-[#f5f5f4] bg-[#1c1917] hover:bg-[#292524] border border-[#292524]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roasts, notes (e.g. Hazelnut)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#141210] border border-[#292524] rounded-md text-[#f5f5f4] placeholder-[#78716c] focus:outline-none focus:border-[#c29b62] transition-colors"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group bg-[#141210] border border-[#292524] rounded-xl overflow-hidden hover:border-[#44403c] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Fallback */}
                <div className="relative aspect-[4/3] bg-[#1c1917] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback gradient if path fails
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-80" />

                  {item.popular && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium bg-[#c29b62] text-[#0c0a09] rounded">
                      Signature Pick
                    </div>
                  )}

                  {item.origin && (
                    <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-[#e0b878]">
                      {item.origin}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-[#f5f5f4] group-hover:text-[#e0b878] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-mono text-base font-semibold text-[#e0b878] shrink-0">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-xs text-[#a8a29e] line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Clean unboxed metadata with typographic separators (anti-slop rule) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#78716c] pt-2 border-t border-[#292524]">
                    {item.notes.map((note, idx) => (
                      <React.Fragment key={note}>
                        <span>{note}</span>
                        {idx < item.notes.length - 1 && (
                          <span aria-hidden="true" className="text-[#44403c]">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={() => handleOpenCustomize(item)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-[#f5f5f4] hover:text-[#0c0a09] bg-[#1c1917] hover:bg-[#c29b62] border border-[#292524] hover:border-[#c29b62] rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Customize & Order</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#141210] rounded-xl border border-[#292524]">
            <Coffee className="w-8 h-8 text-[#78716c] mx-auto mb-3" />
            <p className="text-sm text-[#a8a29e]">No brew found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All Brews');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#c29b62] hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* CUSTOMIZE MODAL */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#141210] border border-[#292524] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#292524] flex items-center justify-between">
              <div>
                <h4 className="text-lg font-serif text-[#f5f5f4]">{customizingItem.name}</h4>
                <p className="text-xs text-[#a8a29e] mt-0.5">Customize your brew profile</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="p-1.5 text-[#78716c] hover:text-[#f5f5f4] rounded-md hover:bg-[#1c1917] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Milk Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#d6d3d1] uppercase tracking-wider mb-2">
                  Milk / Dairy Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Whole Farm Milk', 'Oat Milk Barista (+₹40)', 'Almond Milk (+₹40)'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMilk(m)}
                      className={`p-2.5 text-xs rounded-md border text-center transition-colors ${
                        selectedMilk === m
                          ? 'border-[#c29b62] bg-[#c29b62]/10 text-[#f5f5f4] font-medium'
                          : 'border-[#292524] bg-[#1c1917] text-[#a8a29e] hover:border-[#44403c]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <label className="block text-xs font-semibold text-[#d6d3d1] uppercase tracking-wider mb-2">
                  Organic Cane Sweetness
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Unsweetened (Pure)', 'Subtle (50%)', 'Standard Cane (100%)'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSweetness(s)}
                      className={`p-2.5 text-xs rounded-md border text-center transition-colors ${
                        selectedSweetness === s
                          ? 'border-[#c29b62] bg-[#c29b62]/10 text-[#f5f5f4] font-medium'
                          : 'border-[#292524] bg-[#1c1917] text-[#a8a29e] hover:border-[#44403c]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-semibold text-[#d6d3d1] uppercase tracking-wider mb-2">
                  Temperature
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Hot (Steamed 65°C)', 'Iced on Crystalline Rock'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTemp(t)}
                      className={`p-2.5 text-xs rounded-md border text-center transition-colors ${
                        selectedTemp === t
                          ? 'border-[#c29b62] bg-[#c29b62]/10 text-[#f5f5f4] font-medium'
                          : 'border-[#292524] bg-[#1c1917] text-[#a8a29e] hover:border-[#44403c]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Espresso Shot */}
              <div className="pt-2 border-t border-[#292524] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[#f5f5f4]">Double Ristretto Boost</span>
                  <p className="text-[11px] text-[#78716c]">Extra 20g espresso extraction (+₹50)</p>
                </div>
                <button
                  onClick={() => setExtraShot(!extraShot)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    extraShot ? 'bg-[#c29b62] border-[#c29b62] text-[#0c0a09]' : 'border-[#44403c] bg-[#1c1917]'
                  }`}
                >
                  {extraShot && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[#292524] bg-[#181614] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#78716c]">Calculated Item Price</span>
                <div className="font-mono text-lg font-bold text-[#e0b878]">
                  ₹{customizingItem.price + (selectedMilk.includes('+₹40') ? 40 : 0) + (extraShot ? 50 : 0)}
                </div>
              </div>
              <button
                onClick={handleConfirmAddToCart}
                className="px-6 py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors cursor-pointer"
              >
                Add To Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
