import React, { useState } from 'react';
import {
  X,
  Store,
  Coffee,
  Sliders,
  CalendarCheck,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  SearchCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { CafeData, MenuItem, SceneSettings, Reservation, CustomerOrder } from '../types';

const ADMIN_PASSWORD = '111288';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeData: CafeData;
  onUpdateCafeData: (data: CafeData) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  sceneSettings: SceneSettings;
  onUpdateSceneSettings: (settings: SceneSettings) => void;
  reservations: Reservation[];
  onUpdateReservations: (res: Reservation[]) => void;
  orders: CustomerOrder[];
  onUpdateOrders: (orders: CustomerOrder[]) => void;
  onResetDefaults: () => void;
}

type TabType = 'general' | 'menu' | '3d-studio' | 'gallery' | 'reservations' | 'seo';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  cafeData,
  onUpdateCafeData,
  menuItems,
  onUpdateMenuItems,
  sceneSettings,
  onUpdateSceneSettings,
  reservations,
  onUpdateReservations,
  orders,
  onUpdateOrders,
  onResetDefaults,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pw_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states
  const [cafeForm, setCafeForm] = useState<CafeData>(cafeData);
  const [itemsList, setItemsList] = useState<MenuItem[]>(menuItems);
  const [sceneForm, setSceneForm] = useState<SceneSettings>(sceneSettings);

  // New menu item form
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Specialty Espresso',
    price: 240,
    description: '',
    origin: 'Chikmagalur Estate',
    notes: ['Chocolate', 'Hazelnut'],
    image: '/src/assets/images/latte_art_pour_1791032846968.jpg',
  });
  const [notesInput, setNotesInput] = useState('Chocolate, Hazelnut');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('pw_admin_authenticated', 'true');
      } catch (err) {
        console.warn(err);
      }
    } else {
      setAuthError('Incorrect passcode. Access denied.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
    try {
      sessionStorage.removeItem('pw_admin_authenticated');
    } catch (err) {
      console.warn(err);
    }
  };

  const triggerSaveNotification = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCafeData(cafeForm);
    triggerSaveNotification();
  };

  const handleSaveScene = () => {
    onUpdateSceneSettings(sceneForm);
    triggerSaveNotification();
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const parsedNotes = notesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const itemToAdd: MenuItem = {
      id: `pw-${Date.now()}`,
      name: newItem.name || 'Artisan Brew',
      category: (newItem.category as any) || 'Specialty Espresso',
      price: Number(newItem.price),
      description: newItem.description || 'Specialty brew prepared fresh to order.',
      origin: newItem.origin,
      notes: parsedNotes.length ? parsedNotes : ['Rich Crema', 'Aromatic'],
      image: newItem.image || '/src/assets/images/latte_art_pour_1791032846968.jpg',
    };

    const updated = [itemToAdd, ...itemsList];
    setItemsList(updated);
    onUpdateMenuItems(updated);
    setIsAddingItem(false);
    setNewItem({
      name: '',
      category: 'Specialty Espresso',
      price: 240,
      description: '',
      origin: 'Chikmagalur Estate',
      notes: [],
      image: '/src/assets/images/latte_art_pour_1791032846968.jpg',
    });
    triggerSaveNotification();
  };

  const handleDeleteItem = (id: string) => {
    const updated = itemsList.filter((i) => i.id !== id);
    setItemsList(updated);
    onUpdateMenuItems(updated);
    triggerSaveNotification();
  };

  const handleUpdateItemPrice = (id: string, newPrice: number) => {
    const updated = itemsList.map((i) => (i.id === id ? { ...i, price: newPrice } : i));
    setItemsList(updated);
    onUpdateMenuItems(updated);
  };

  const handleUpdateItemImage = (id: string, newImage: string) => {
    const updated = itemsList.map((i) => (i.id === id ? { ...i, image: newImage } : i));
    setItemsList(updated);
    onUpdateMenuItems(updated);
  };

  const handleUpdateResStatus = (id: string, status: Reservation['status']) => {
    const updated = reservations.map((r) => (r.id === id ? { ...r, status } : r));
    onUpdateReservations(updated);
  };

  const handleUpdateOrderStatus = (id: string, status: CustomerOrder['status']) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    onUpdateOrders(updated);
  };

  const PRESET_IMAGES = [
    { label: 'Bank More Cafe Interior', path: '/src/assets/images/cafe_interior_bankmore_1791032831382.jpg' },
    { label: 'Microfoam Latte Art Pour', path: '/src/assets/images/latte_art_pour_1791032846968.jpg' },
    { label: 'Sub-Zero Nitro Cold Brew', path: '/src/assets/images/nitro_cold_brew_ice_1791032869325.jpg' },
    { label: 'Fresh Morning French Bakery', path: '/src/assets/images/artisan_bakery_treats_1791032885238.jpg' },
  ];

  // =========================================================================
  // PASSWORD GATE IF NOT AUTHENTICATED
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#141210] border border-[#292524] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-[#78716c] hover:text-[#f5f5f4] rounded-md hover:bg-[#292524] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#c29b62]/10 border border-[#c29b62]/30 text-[#e0b878] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#c29b62]" />
            </div>
            <h3 className="text-xl font-serif text-[#f5f5f4]">Owner & Barista Console</h3>
            <p className="text-xs text-[#a8a29e] leading-relaxed max-w-xs mx-auto">
              This area is restricted to cafe managers. Please enter your administrator passcode to proceed.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter passcode (111288)"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] placeholder-[#78716c] focus:outline-none focus:border-[#c29b62] font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#d6d3d1]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#292524] text-center text-[11px] text-[#78716c]">
            Pure World Cafe · Bank More, Dhanbad
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN PANEL
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#141210] border border-[#292524] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#292524] flex items-center justify-between bg-[#181614]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c29b62] text-[#0c0a09] flex items-center justify-center font-bold">
              PW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-semibold text-[#f5f5f4]">
                  Pure World Cafe · Admin & Visual Studio
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Authenticated
                </span>
              </div>
              <p className="text-xs text-[#78716c]">
                Live management for Cafe Info, Menu Items, 3D Canvas, and Reservations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {savedNotice && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 rounded">
                <Check className="w-3.5 h-3.5" /> Saved Live
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#a8a29e] hover:text-[#f5f5f4] bg-[#24201c] hover:bg-[#2d2823] border border-[#3f3933] rounded transition-colors"
              title="Lock Admin Panel"
            >
              <Lock className="w-3.5 h-3.5 text-[#c29b62]" />
              <span>Lock</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#78716c] hover:text-[#f5f5f4] rounded-md hover:bg-[#292524] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-[#292524] bg-[#100e0c] overflow-x-auto">
          {[
            { id: 'general', label: 'Roastery Details', icon: Store },
            { id: 'menu', label: 'Menu & Brews', icon: Coffee },
            { id: '3d-studio', label: '3D Motion Studio', icon: Sliders },
            { id: 'gallery', label: 'Visual Media', icon: ImageIcon },
            { id: 'reservations', label: 'Reservations & Orders', icon: CalendarCheck },
            { id: 'seo', label: 'SEO & Google Rank', icon: SearchCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#c29b62] text-[#e0b878]'
                    : 'border-transparent text-[#78716c] hover:text-[#d6d3d1]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#d6d3d1] mb-1">Cafe Name</label>
                  <input
                    type="text"
                    value={cafeForm.name}
                    onChange={(e) => setCafeForm({ ...cafeForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d6d3d1] mb-1">
                    Direct Phone Number (Requested: 8523647915)
                  </label>
                  <input
                    type="text"
                    value={cafeForm.phone}
                    onChange={(e) => setCafeForm({ ...cafeForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#d6d3d1] mb-1">
                    Street Address (Requested: Bank More)
                  </label>
                  <input
                    type="text"
                    value={cafeForm.address}
                    onChange={(e) => setCafeForm({ ...cafeForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d6d3d1] mb-1">City & Postal</label>
                  <input
                    type="text"
                    value={cafeForm.city}
                    onChange={(e) => setCafeForm({ ...cafeForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d6d3d1] mb-1">Roasting & Bar Hours</label>
                <input
                  type="text"
                  value={cafeForm.hours}
                  onChange={(e) => setCafeForm({ ...cafeForm, hours: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d6d3d1] mb-1">Announcement Ticker Text</label>
                <input
                  type="text"
                  value={cafeForm.announcement}
                  onChange={(e) => setCafeForm({ ...cafeForm, announcement: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors cursor-pointer"
                >
                  Save Cafe Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MENU MANAGEMENT */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#f5f5f4]">Brew & Food Menu List</h4>
                  <p className="text-xs text-[#78716c]">Edit pricing, update images, or create new roasts.</p>
                </div>
                <button
                  onClick={() => setIsAddingItem(!isAddingItem)}
                  className="px-3.5 py-2 text-xs font-medium text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Brew</span>
                </button>
              </div>

              {/* Add New Item Form */}
              {isAddingItem && (
                <form
                  onSubmit={handleSaveNewItem}
                  className="p-4 bg-[#1a1715] border border-[#3f3933] rounded-xl space-y-3"
                >
                  <div className="text-xs font-semibold text-[#e0b878]">Add New Menu Item</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#a8a29e] mb-1">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nitro Cascara Fizz"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#a8a29e] mb-1">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4]"
                      >
                        <option value="Specialty Espresso">Specialty Espresso</option>
                        <option value="Slow Bar & Pour Over">Slow Bar & Pour Over</option>
                        <option value="Cold Brews & Nitro">Cold Brews & Nitro</option>
                        <option value="Signature Blends">Signature Blends</option>
                        <option value="Artisan Bakery">Artisan Bakery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#a8a29e] mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#a8a29e] mb-1">Tasting Notes (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Brown Sugar, Orange Zest"
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#a8a29e] mb-1">Photo Preset</label>
                      <select
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4]"
                      >
                        {PRESET_IMAGES.map((img) => (
                          <option key={img.path} value={img.path}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#a8a29e] mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief tasting description..."
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingItem(false)}
                      className="px-3 py-1.5 text-xs text-[#78716c] hover:text-[#f5f5f4]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] rounded"
                    >
                      Save Item
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {itemsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#181614] border border-[#292524] rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-[#292524]"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#f5f5f4] truncate">{item.name}</div>
                        <div className="text-[11px] text-[#78716c]">{item.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Price Editor */}
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[#78716c]">₹</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleUpdateItemPrice(item.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-[#100e0c] border border-[#292524] rounded text-xs font-mono text-[#e0b878]"
                        />
                      </div>

                      {/* Image Selector */}
                      <select
                        value={item.image}
                        onChange={(e) => handleUpdateItemImage(item.id, e.target.value)}
                        className="text-[11px] bg-[#100e0c] border border-[#292524] rounded px-2 py-1 text-[#a8a29e]"
                      >
                        {PRESET_IMAGES.map((img) => (
                          <option key={img.path} value={img.path}>
                            {img.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-[#78716c] hover:text-red-400"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 3D MOTION STUDIO */}
          {activeTab === '3d-studio' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#f5f5f4]">WebGL 3D Physics & Choreography</h4>
                <p className="text-xs text-[#78716c]">
                  Control steam curling velocity, coffee bean orbital speed, and dynamic cafe lighting moods.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-[#181614] border border-[#292524] rounded-xl">
                {/* Steam Speed */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#d6d3d1]">Steam Rise Velocity</span>
                    <span className="font-mono text-[#c29b62]">{sceneForm.steamSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={sceneForm.steamSpeed}
                    onChange={(e) => {
                      const updated = { ...sceneForm, steamSpeed: parseFloat(e.target.value) };
                      setSceneForm(updated);
                      onUpdateSceneSettings(updated);
                    }}
                    className="w-full accent-[#c29b62]"
                  />
                </div>

                {/* Steam Density */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#d6d3d1]">Steam Particle Density</span>
                    <span className="font-mono text-[#c29b62]">{sceneForm.steamDensity}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={sceneForm.steamDensity}
                    onChange={(e) => {
                      const updated = { ...sceneForm, steamDensity: parseFloat(e.target.value) };
                      setSceneForm(updated);
                      onUpdateSceneSettings(updated);
                    }}
                    className="w-full accent-[#c29b62]"
                  />
                </div>

                {/* Bean Orbit Speed */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#d6d3d1]">Bean 3D Orbit Speed</span>
                    <span className="font-mono text-[#c29b62]">{sceneForm.beanOrbitSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.1"
                    value={sceneForm.beanOrbitSpeed}
                    onChange={(e) => {
                      const updated = { ...sceneForm, beanOrbitSpeed: parseFloat(e.target.value) };
                      setSceneForm(updated);
                      onUpdateSceneSettings(updated);
                    }}
                    className="w-full accent-[#c29b62]"
                  />
                </div>

                {/* Lighting Mood Presets */}
                <div>
                  <label className="block text-xs text-[#d6d3d1] mb-1.5">Lighting Mood Preset</label>
                  <select
                    value={sceneForm.lightingMood}
                    onChange={(e) => {
                      const updated = { ...sceneForm, lightingMood: e.target.value as any };
                      setSceneForm(updated);
                      onUpdateSceneSettings(updated);
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#100e0c] border border-[#292524] rounded text-[#f5f5f4]"
                  >
                    <option value="warm_sunlight">Warm Amber Sunlight (Default)</option>
                    <option value="moody_barista">Moody Barista Night</option>
                    <option value="cyber_roast">Cyber Roast (High Contrast)</option>
                    <option value="crisp_morning">Crisp Nordic Morning</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 text-xs text-[#d6d3d1]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sceneForm.showBeans}
                    onChange={(e) => {
                      const updated = { ...sceneForm, showBeans: e.target.checked };
                      setSceneForm(updated);
                      onUpdateSceneSettings(updated);
                    }}
                    className="accent-[#c29b62]"
                  />
                  <span>Show 3D Floating Roasted Beans</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL MEDIA & GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#f5f5f4]">Visual Photography Assets</h4>
                <p className="text-xs text-[#78716c]">
                  High-fidelity photography assets generated specifically for Pure World Cafe at Bank More.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRESET_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#181614] border border-[#292524] rounded-xl overflow-hidden space-y-2"
                  >
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#100e0c]">
                      <img
                        src={img.path}
                        alt={img.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#f5f5f4]">{img.label}</span>
                      <span className="text-[10px] text-[#78716c]">Active Asset</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESERVATIONS & ORDERS */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              {/* Reservations list */}
              <div>
                <h4 className="text-sm font-semibold text-[#f5f5f4] mb-1">
                  Incoming Table Reservations ({reservations.length})
                </h4>
                <div className="space-y-2 mt-3">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 bg-[#181614] border border-[#292524] rounded-xl flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#f5f5f4]">{res.guestName}</span>
                          <span className="text-[#c29b62] font-mono">({res.phone})</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#292524] text-[#a8a29e]">
                            {res.guests} Guests
                          </span>
                        </div>
                        <div className="text-[11px] text-[#78716c] mt-0.5">
                          {res.date} at {res.time} · {res.tablePref}
                          {res.specialRequest ? ` · Note: "${res.specialRequest}"` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={res.status}
                          onChange={(e) => handleUpdateResStatus(res.id, e.target.value as any)}
                          className="px-2 py-1 bg-[#100e0c] border border-[#292524] rounded text-xs text-[#e0b878]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {reservations.length === 0 && (
                    <p className="text-xs text-[#78716c] py-4 text-center">No reservations received yet.</p>
                  )}
                </div>
              </div>

              {/* Orders List */}
              <div className="pt-4 border-t border-[#292524]">
                <h4 className="text-sm font-semibold text-[#f5f5f4] mb-1">
                  Active Brew Orders ({orders.length})
                </h4>
                <div className="space-y-2 mt-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-[#181614] border border-[#292524] rounded-xl flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#f5f5f4]">{ord.customerName}</span>
                          <span className="text-[#c29b62] font-mono">({ord.phone})</span>
                          <span className="text-[#e0b878] font-bold font-mono">₹{ord.total}</span>
                        </div>
                        <div className="text-[11px] text-[#78716c] mt-0.5">
                          {ord.tableOrAddress} · {ord.items.length} items (
                          {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')})
                        </div>
                      </div>

                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="px-2 py-1 bg-[#100e0c] border border-[#292524] rounded text-xs text-[#e0b878]"
                      >
                        <option value="received">Received</option>
                        <option value="brewing">Brewing</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-xs text-[#78716c] py-4 text-center">No brew orders placed yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SEO & GOOGLE RANK */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-[#f5f5f4]">Google Search Engine Optimization</h4>
                <p className="text-xs text-[#78716c]">
                  Pre-configured for top search ranking on Google Search & Google Maps for Bank More coffee queries.
                </p>
              </div>

              <div className="p-4 bg-[#181614] border border-[#292524] rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#292524]">
                  <span className="text-[#78716c]">Target Title Tag</span>
                  <span className="font-medium text-[#f5f5f4]">
                    Pure World Cafe – Artisan 3D Coffee & Specialty Roastery | Bank More
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#292524]">
                  <span className="text-[#78716c]">Google Schema Type</span>
                  <span className="font-mono text-emerald-400">CafeOrCoffeeShop (JSON-LD active)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#292524]">
                  <span className="text-[#78716c]">Local Geolocation</span>
                  <span className="font-mono text-[#e0b878]">23.7915° N, 86.4294° E (Bank More, Dhanbad)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#292524]">
                  <span className="text-[#78716c]">Verified Phone Link</span>
                  <span className="font-mono text-[#f5f5f4]">tel:+91{cafeData.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716c]">Aggregate Rating</span>
                  <span className="font-medium text-[#e0b878]">4.9 / 5.0 (542 Reviews)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#292524] bg-[#181614] flex items-center justify-between">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-[#78716c] hover:text-[#d6d3d1] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Pure World Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors cursor-pointer"
          >
            Done & Return to Site
          </button>
        </div>
      </div>
    </div>
  );
};
