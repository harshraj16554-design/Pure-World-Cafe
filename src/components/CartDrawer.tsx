import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { OrderItem, CustomerOrder } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: (order: CustomerOrder) => void;
  cafePhone: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  cafePhone,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('8523647915');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableOrNote, setTableOrNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<CustomerOrder | null>(null);

  if (!isOpen) return null;

  const total = items.reduce((acc, curr) => {
    let itemPrice = curr.item.price;
    if (curr.customization?.milk?.includes('+₹40')) itemPrice += 40;
    if (curr.customization?.extraShot) itemPrice += 50;
    return acc + itemPrice * curr.quantity;
  }, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || items.length === 0) return;

    const newOrder: CustomerOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      phone,
      tableOrAddress: tableOrNote || (orderType === 'dine_in' ? 'Table at Bar' : 'Bank More Pickup'),
      items: [...items],
      total,
      orderType,
      status: 'received',
      createdAt: 'Just now',
    };

    onPlaceOrder(newOrder);
    setOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#141210] border-l border-[#292524] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#292524] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#c29b62]" />
            <h3 className="text-base font-serif font-semibold text-[#f5f5f4]">Your Coffee Order</h3>
          </div>
          <button
            onClick={() => {
              setOrderSuccess(null);
              onClose();
            }}
            className="p-1.5 text-[#78716c] hover:text-[#f5f5f4] rounded-md hover:bg-[#1c1917]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {orderSuccess ? (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#c29b62] mx-auto" />
              <h4 className="text-xl font-serif text-[#f5f5f4]">Brew Order Received!</h4>
              <p className="text-xs text-[#a8a29e] leading-relaxed max-w-xs mx-auto">
                Thank you <strong className="text-[#f5f5f4]">{orderSuccess.customerName}</strong>. Our baristas
                at Bank More are preparing your specialty roast now.
              </p>
              <div className="p-3 bg-[#1a1715] rounded-lg border border-[#292524] text-xs font-mono inline-block">
                Order ID: <span className="text-[#e0b878] font-bold">{orderSuccess.id}</span>
              </div>
              <div className="text-xs text-[#78716c]">
                For instant updates, call <span className="font-mono text-[#c29b62]">{cafePhone}</span>
              </div>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#44403c] mx-auto" />
              <p className="text-sm text-[#78716c]">Your order is currently empty.</p>
              <p className="text-xs text-[#57534e]">Add your favorite roast from the menu.</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {items.map((cartItem, idx) => {
                  let unitPrice = cartItem.item.price;
                  if (cartItem.customization?.milk?.includes('+₹40')) unitPrice += 40;
                  if (cartItem.customization?.extraShot) unitPrice += 50;

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-[#181614] border border-[#292524] rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#f5f5f4] truncate">
                          {cartItem.item.name}
                        </div>
                        {cartItem.customization && (
                          <div className="text-[10px] text-[#78716c] truncate">
                            {cartItem.customization.milk} · {cartItem.customization.sweetness}
                            {cartItem.customization.extraShot ? ' · +Extra Shot' : ''}
                          </div>
                        )}
                        <div className="font-mono text-xs text-[#e0b878] font-semibold mt-1">
                          ₹{unitPrice * cartItem.quantity}
                        </div>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#292524] rounded-md bg-[#100e0c]">
                          <button
                            onClick={() => onUpdateQuantity(idx, -1)}
                            className="px-2 py-1 text-xs text-[#a8a29e] hover:text-[#f5f5f4]"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-xs font-mono text-[#f5f5f4]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, 1)}
                            className="px-2 py-1 text-xs text-[#a8a29e] hover:text-[#f5f5f4]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="p-1.5 text-[#78716c] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Details Form */}
              <form onSubmit={handleCheckout} className="pt-4 border-t border-[#292524] space-y-3 text-xs">
                {/* Dine-In or Takeaway */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`py-2 text-xs font-medium rounded-md border text-center transition-colors ${
                      orderType === 'dine_in'
                        ? 'border-[#c29b62] bg-[#c29b62]/10 text-[#f5f5f4]'
                        : 'border-[#292524] bg-[#181614] text-[#78716c]'
                    }`}
                  >
                    Dine-In at Cafe
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2 text-xs font-medium rounded-md border text-center transition-colors ${
                      orderType === 'takeaway'
                        ? 'border-[#c29b62] bg-[#c29b62]/10 text-[#f5f5f4]'
                        : 'border-[#292524] bg-[#181614] text-[#78716c]'
                    }`}
                  >
                    Takeaway Pickup
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] text-[#a8a29e] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181614] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a8a29e] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181614] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a8a29e] mb-1">
                    {orderType === 'dine_in' ? 'Table Number / Seating Note' : 'Pickup Time Note'}
                  </label>
                  <input
                    type="text"
                    placeholder={orderType === 'dine_in' ? 'e.g. Table 4 or Bar Counter' : 'e.g. In 15 minutes'}
                    value={tableOrNote}
                    onChange={(e) => setTableOrNote(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181614] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                  />
                </div>

                {/* Subtotal & Checkout Button */}
                <div className="pt-4 border-t border-[#292524] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#78716c]">Order Total</span>
                    <div className="font-mono text-xl font-bold text-[#e0b878]">₹{total}</div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Place Brew Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
