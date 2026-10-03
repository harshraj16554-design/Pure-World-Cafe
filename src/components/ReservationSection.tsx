import React, { useState } from 'react';
import { Phone, MapPin, Clock, Calendar, Users, CheckCircle, Navigation, MessageSquare } from 'lucide-react';
import { CafeData, Reservation } from '../types';

interface ReservationSectionProps {
  cafeData: CafeData;
  onAddReservation: (res: Reservation) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  cafeData,
  onAddReservation,
}) => {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('06:00 PM');
  const [guests, setGuests] = useState(2);
  const [tablePref, setTablePref] = useState('Barista Counter View');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedRes, setConfirmedRes] = useState<Reservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !phone) return;

    const newRes: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      phone,
      date,
      time,
      guests,
      tablePref,
      specialRequest: specialRequest || undefined,
      status: 'confirmed',
      createdAt: 'Just now',
    };

    onAddReservation(newRes);
    setConfirmedRes(newRes);
    setGuestName('');
    setPhone('');
    setSpecialRequest('');
  };

  return (
    <section id="reservation-section" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-[#0c0a09] border-t border-[#292524]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Location Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#c29b62] uppercase tracking-wider mb-2">
                <span>Visit & Connect</span>
                <span aria-hidden="true">·</span>
                <span>Bank More</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#f5f5f4] font-light leading-snug">
                Reserve Your Table <br />
                <span className="italic font-normal text-[#e0b878]">& Savor The Roastery</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#a8a29e] mt-3 leading-relaxed">
                Whether you're settling in for an afternoon espresso tasting flight, meeting friends,
                or picking up your morning brew, we look forward to hosting you at Bank More.
              </p>
            </div>

            {/* Crucial Info Cards with requested details */}
            <div className="space-y-3.5 pt-2">
              {/* Direct Phone 8523647915 */}
              <div className="p-4 bg-[#141210] border border-[#292524] rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#1c1917] border border-[#292524] flex items-center justify-center text-[#c29b62]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#78716c] uppercase tracking-wider">Direct Concierge</div>
                    <a
                      href={`tel:${cafeData.phone}`}
                      className="text-base font-mono font-semibold text-[#f5f5f4] hover:text-[#e0b878] transition-colors"
                    >
                      {cafeData.phone}
                    </a>
                  </div>
                </div>
                <a
                  href={`tel:${cafeData.phone}`}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#c29b62] text-[#0c0a09] rounded-md hover:bg-[#d6af74] transition-colors"
                >
                  Call Now
                </a>
              </div>

              {/* Address Bank More */}
              <div className="p-4 bg-[#141210] border border-[#292524] rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#1c1917] border border-[#292524] flex items-center justify-center text-[#c29b62] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#78716c] uppercase tracking-wider">Roastery Location</div>
                  <div className="text-sm font-semibold text-[#f5f5f4]">{cafeData.address}</div>
                  <div className="text-xs text-[#a8a29e] mt-0.5">{cafeData.city}</div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[#c29b62]">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      Landmark: Central Bank More junction
                    </span>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="p-4 bg-[#141210] border border-[#292524] rounded-xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#1c1917] border border-[#292524] flex items-center justify-center text-[#c29b62]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#78716c] uppercase tracking-wider">Roasting & Bar Hours</div>
                  <div className="text-sm font-medium text-[#f5f5f4]">{cafeData.hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#141210] border border-[#292524] rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-serif text-[#f5f5f4] mb-1">Book a Table Experience</h3>
              <p className="text-xs text-[#a8a29e] mb-6">
                Guaranteed seating, complimentary water carafe, and personalized barista tasting notes.
              </p>

              {confirmedRes ? (
                <div className="p-6 bg-[#181512] border border-[#c29b62]/40 rounded-xl space-y-4">
                  <div className="flex items-center gap-3 text-[#e0b878]">
                    <CheckCircle className="w-6 h-6 text-[#c29b62]" />
                    <h4 className="text-base font-semibold text-[#f5f5f4]">Reservation Confirmed!</h4>
                  </div>
                  <p className="text-xs text-[#d6d3d1] leading-relaxed">
                    Thank you, <strong className="text-[#f5f5f4]">{confirmedRes.guestName}</strong>. Your table
                    has been booked for {confirmedRes.guests} guests on {confirmedRes.date} at {confirmedRes.time}.
                    A booking SMS confirmation has been logged for <span className="font-mono text-[#e0b878]">{confirmedRes.phone}</span>.
                  </p>
                  <div className="p-3 bg-[#100e0c] rounded-lg border border-[#292524] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#78716c]">Booking Reference:</span>
                    <span className="text-[#c29b62] font-bold">{confirmedRes.id}</span>
                  </div>
                  <button
                    onClick={() => setConfirmedRes(null)}
                    className="w-full py-2 text-xs font-medium text-[#a8a29e] hover:text-[#f5f5f4] bg-[#1c1917] rounded-md transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arjun Mehta"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] placeholder-[#78716c] focus:outline-none focus:border-[#c29b62]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="8523647915"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] placeholder-[#78716c] focus:outline-none focus:border-[#c29b62] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                        Reservation Day
                      </label>
                      <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Weekend">This Weekend</option>
                        <option value="Next Week">Next Week</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                        Preferred Time
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                      >
                        <option value="09:00 AM">09:00 AM (Morning Brew)</option>
                        <option value="11:30 AM">11:30 AM (Brunch & Slow Bar)</option>
                        <option value="03:30 PM">03:30 PM (Afternoon Coffee)</option>
                        <option value="06:00 PM">06:00 PM (Golden Hour)</option>
                        <option value="08:30 PM">08:30 PM (Evening Lounge)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] focus:outline-none focus:border-[#c29b62]"
                      >
                        <option value={1}>1 Guest (Solo Tasting)</option>
                        <option value={2}>2 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={6}>6 Guests (Group Tasting)</option>
                        <option value={8}>8+ Guests (Roastery Table)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                      Table Ambience Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        'Barista Counter View',
                        'Window Sunlit Seating',
                        'Quiet Roasting Corner',
                      ].map((pref) => (
                        <button
                          type="button"
                          key={pref}
                          onClick={() => setTablePref(pref)}
                          className={`p-2 text-xs rounded-md border text-center transition-colors ${
                            tablePref === pref
                              ? 'border-[#c29b62] bg-[#c29b62]/10 text-[#f5f5f4] font-medium'
                              : 'border-[#292524] bg-[#1a1715] text-[#a8a29e] hover:border-[#44403c]'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#d6d3d1] mb-1.5">
                      Special Requests / Dietary Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Birthday pour-over flight, oat milk preference..."
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#1a1715] border border-[#292524] rounded-md text-[#f5f5f4] placeholder-[#78716c] focus:outline-none focus:border-[#c29b62]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-semibold text-[#0c0a09] bg-[#c29b62] hover:bg-[#d6af74] rounded-md transition-colors shadow-md cursor-pointer mt-2"
                  >
                    Confirm Table Reservation at Bank More
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
