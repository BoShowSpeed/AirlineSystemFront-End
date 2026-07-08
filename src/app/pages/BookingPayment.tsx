import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, CheckCircle2, ChevronDown, Banknote, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Booking, PaymentMethod, SeatClass } from '../types';

const SEAT_PRICES: Record<string, number> = { first_class: 3499, business: 1250, economy: 489 };

function getSeatClass(seat: string): SeatClass {
  const row = parseInt(seat);
  if (row <= 3) return 'first_class';
  if (row <= 10) return 'business';
  return 'economy';
}

type MethodGroup = 'card' | 'ewallet' | 'qr' | 'cash';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  group: MethodGroup;
  color?: string;
  note?: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'credit_card',  label: 'Credit Card',  group: 'card',    color: '#0A1F44' },
  { id: 'debit_card',   label: 'Debit Card',   group: 'card',    color: '#0A1F44' },
  { id: 'paypal',       label: 'PayPal',        group: 'ewallet', color: '#003087' },
  { id: 'aba_pay',      label: 'ABA Pay',       group: 'qr',      color: '#E30613', note: 'Scan QR with ABA Mobile' },
  { id: 'acleda',       label: 'ACLEDA',        group: 'qr',      color: '#005CA4', note: 'Scan QR with ACLEDA app' },
  { id: 'wing',         label: 'Wing',          group: 'qr',      color: '#E4A900', note: 'Scan QR with Wing app' },
  { id: 'cash',         label: 'Pay at Counter', group: 'cash',   color: '#059669' },
];

const GROUP_LABELS: Record<MethodGroup, string> = {
  card: 'Credit / Debit Card',
  ewallet: 'E-Wallet',
  qr: 'QR Payment',
  cash: 'Counter Payment',
};

const SEAT_CLASS_LABELS: Record<SeatClass, string> = {
  first_class: 'First Class',
  business: 'Business',
  economy: 'Economy',
};

export default function BookingPayment() {
  const { user, selectedFlight, selectedSeat, setBooking } = useApp();
  const navigate = useNavigate();

  // Passenger
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [passport, setPassport] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  const seatClass = selectedSeat ? getSeatClass(selectedSeat) : 'economy';
  const price = selectedFlight?.price ?? (selectedSeat ? SEAT_PRICES[seatClass] : 489);
  const tax = price * 0.15;
  const total = price + tax;

  const selected = PAYMENT_OPTIONS.find(o => o.id === paymentMethod)!;
  const isCard = selected.group === 'card';
  const isQr  = selected.group === 'qr';
  const isEwallet = selected.group === 'ewallet';
  const isCash = selected.group === 'cash';

  const inputClass = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] focus:border-transparent';

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    if (!selectedFlight || !selectedSeat) return;

    const booking: Booking = {
      id: `BK${Date.now()}`,
      flight: selectedFlight,
      seat: selectedSeat,
      seatClass,
      passenger: { name, email, phone, passport },
      price,
      tax,
      total,
      status: 'confirmed',
      bookingRef: `AV${Math.random().toString(36).toUpperCase().slice(2, 8)}`,
      boardingGroup: 'A',
      paymentMethod,
      paymentStatus: 'paid',
    };
    setBooking(booking);
    setProcessing(false);
    navigate('/boarding-pass');
  };

  if (!selectedFlight || !selectedSeat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No flight selected. Please search for a flight first.</p>
          <button onClick={() => navigate('/search')} className="bg-[#0A1F44] text-white px-6 py-3 rounded-xl">
            Search Flights
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-[#0A1F44] mb-2">Complete Your Booking</h2>
        <p className="text-gray-500 text-sm mb-6">Review your details and confirm payment</p>

        <form onSubmit={handleConfirm}>
          <div className="grid lg:grid-cols-5 gap-6">

            {/* ── Left: forms ── */}
            <div className="lg:col-span-3 space-y-4">

              {/* Passenger info */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-[#0A1F44] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0A1F44] text-white text-xs flex items-center justify-center">1</span>
                  Passenger Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Passport / ID Number</label>
                    <input value={passport} onChange={e => setPassport(e.target.value)} className={inputClass}
                      placeholder="US123456789" required />
                  </div>
                </div>
              </div>

              {/* Baggage */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-[#0A1F44] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0A1F44] text-white text-xs flex items-center justify-center">2</span>
                  Baggage Allowance
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Carry-on',  detail: '1 × 10 kg',                           included: true  },
                    { label: 'Checked',   detail: seatClass === 'economy' ? '1 × 23 kg' : '2 × 32 kg', included: true  },
                    { label: 'Extra Bag', detail: '+$60 per bag',                         included: false },
                  ].map(({ label, detail, included }) => (
                    <div key={label} className={`rounded-xl p-3 border-2 text-sm ${included ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="font-medium text-[#0A1F44]">{label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{detail}</div>
                      {included && <div className="text-xs text-emerald-600 mt-1">✓ Included</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-[#0A1F44] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0A1F44] text-white text-xs flex items-center justify-center">3</span>
                  Payment Method
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-5 bg-[#F4F7FB] rounded-lg px-3 py-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  Secured by 256-bit SSL encryption
                </div>

                {/* Method selector — grouped */}
                <div className="space-y-3 mb-5">
                  {(['card', 'ewallet', 'qr', 'cash'] as MethodGroup[]).map(group => (
                    <div key={group}>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        {GROUP_LABELS[group]}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PAYMENT_OPTIONS.filter(o => o.group === group).map(option => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setPaymentMethod(option.id)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                              paymentMethod === option.id
                                ? 'border-[#0A1F44] bg-[#F4F7FB]'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                              style={{ backgroundColor: option.color }}>
                              {option.group === 'card' ? <CreditCard className="w-4 h-4" /> :
                               option.group === 'qr'   ? <QrCode className="w-4 h-4" /> :
                               option.group === 'cash' ? <Banknote className="w-4 h-4" /> :
                               <span>{option.label.slice(0,2)}</span>}
                            </div>
                            <span className="text-xs font-medium text-[#0A1F44] leading-tight">{option.label}</span>
                            {paymentMethod === option.id && (
                              <div className="ml-auto w-4 h-4 rounded-full bg-[#0A1F44] flex items-center justify-center shrink-0">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic payment form */}
                {isCard && (
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Cardholder Name</label>
                      <input value={cardName} onChange={e => setCardName(e.target.value)}
                        className={inputClass} placeholder="Sarah Chen" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Card Number</label>
                      <div className="relative">
                        <input value={cardNumber}
                          onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className={`${inputClass} pr-12`} placeholder="1234 5678 9012 3456" required />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">Expiry</label>
                        <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)}
                          className={inputClass} placeholder="MM/YY" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">CVC</label>
                        <input value={cardCvc} onChange={e => setCardCvc(e.target.value.slice(0, 4))}
                          className={inputClass} placeholder="123" required />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      {['VISA', 'MC', 'AMEX', 'JCB'].map(m => (
                        <div key={m} className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs text-gray-500 font-mono">{m}</div>
                      ))}
                    </div>
                  </div>
                )}

                {isQr && (
                  <div className="border-t border-gray-100 pt-4 flex flex-col items-center gap-3">
                    <div className="w-36 h-36 bg-[#F4F7FB] border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-gray-300" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[#0A1F44] text-sm"
                        style={{ color: selected.color }}>
                        {selected.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{selected.note}</div>
                      <div className="text-xs text-gray-400 mt-1">QR refreshes on confirmation</div>
                    </div>
                  </div>
                )}

                {isEwallet && (
                  <div className="border-t border-gray-100 pt-4 bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-sm font-semibold text-[#003087] mb-1">PayPal</div>
                    <div className="text-xs text-gray-500">
                      You will be redirected to PayPal to complete payment securely.
                    </div>
                    <div className="mt-2 text-xs text-gray-400">Total: <strong>${total.toFixed(2)}</strong></div>
                  </div>
                )}

                {isCash && (
                  <div className="border-t border-gray-100 pt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-emerald-700">Pay at Airport Counter</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Your booking will be reserved for 24 hours. Present your booking reference at any Avion Airways counter to complete payment.
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Amount due: <strong>${total.toFixed(2)}</strong></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
                <h3 className="text-[#0A1F44] mb-4">Booking Summary</h3>

                {/* Flight */}
                <div className="bg-[#F4F7FB] rounded-xl p-4 mb-4">
                  <div className="text-xs text-gray-500 mb-2 font-medium">{selectedFlight.number}</div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-[#0A1F44] text-lg">{selectedFlight.originCode}</div>
                      <div className="text-xs text-gray-500">{selectedFlight.departureTime}</div>
                    </div>
                    <div className="text-gray-300 text-sm">→</div>
                    <div className="text-right">
                      <div className="font-bold text-[#0A1F44] text-lg">{selectedFlight.destinationCode}</div>
                      <div className="text-xs text-gray-500">{selectedFlight.arrivalTime}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span>Seat {selectedSeat}</span>
                    <span>{SEAT_CLASS_LABELS[seatClass]}</span>
                    <span>Gate {selectedFlight.gate}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5 mb-4">
                  {[
                    { label: 'Base fare',         value: `$${price.toFixed(2)}` },
                    { label: 'Taxes & fees (15%)', value: `$${tax.toFixed(2)}`  },
                    { label: 'Baggage',            value: 'Included'             },
                    { label: 'Seat selection',     value: 'Included'             },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                    <span className="font-semibold text-[#0A1F44]">Total</span>
                    <span className="font-bold text-[#0A1F44] text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment method pill */}
                <div className="flex items-center gap-2 mb-4 text-xs bg-[#F4F7FB] rounded-lg px-3 py-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: selected.color }}>
                    {selected.group === 'card' ? <CreditCard className="w-3 h-3" /> :
                     selected.group === 'qr'   ? <QrCode className="w-3 h-3" /> :
                     selected.group === 'cash' ? <Banknote className="w-3 h-3" /> :
                     null}
                  </div>
                  <span className="text-gray-600">Paying with <strong>{selected.label}</strong></span>
                </div>

                <button type="submit" disabled={processing}
                  className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    processing ? 'bg-gray-100 text-gray-400' : 'bg-[#0A1F44] hover:bg-[#2E8FD8] text-white'
                  }`}>
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  By confirming, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
