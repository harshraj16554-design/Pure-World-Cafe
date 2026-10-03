export interface MenuItem {
  id: string;
  name: string;
  category: 'Specialty Espresso' | 'Slow Bar & Pour Over' | 'Cold Brews & Nitro' | 'Signature Blends' | 'Artisan Bakery';
  price: number;
  description: string;
  origin?: string;
  notes: string[];
  roastLevel?: 'Light' | 'Medium' | 'Dark';
  image: string;
  popular?: boolean;
  isVegan?: boolean;
  calories?: number;
}

export interface CafeData {
  name: string;
  tagline: string;
  phone: string;
  address: string;
  city: string;
  hours: string;
  announcement: string;
  email: string;
  instagram: string;
}

export interface SceneSettings {
  steamSpeed: number;
  steamDensity: number;
  beanOrbitSpeed: number;
  iceDropIntensity: number;
  lightingMood: 'warm_sunlight' | 'moody_barista' | 'cyber_roast' | 'crisp_morning';
  autoRotateCup: boolean;
  showBeans: boolean;
}

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tablePref: string;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  customization?: {
    milk?: string;
    sweetness?: string;
    temperature?: string;
    extraShot?: boolean;
  };
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  phone: string;
  tableOrAddress: string;
  items: OrderItem[];
  total: number;
  orderType: 'dine_in' | 'takeaway';
  status: 'received' | 'brewing' | 'ready' | 'completed';
  createdAt: string;
}
