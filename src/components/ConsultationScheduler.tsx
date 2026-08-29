import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building,
  Phone,
  FileCheck,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  ExternalLink,
  Download,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { api } from '../services/api';
import { ConsultationBooking, PaymentRecord } from '../types';

interface ConsultationSchedulerProps {
  initialPracticeArea?: string;
  onBookingComplete?: (booking: ConsultationBooking) => void;
  onClose?: () => void;
}

const availableTimeSlots = [
  "09:30 AM - 10:15 AM",
  "11:00 AM - 11:45 AM",
  "02:00 PM - 02:45 PM",
  "04:30 PM - 05:15 PM",
  "06:00 PM - 06:45 PM"
];

const meetingModes = [
  {
    id: "Google Meet Video Conference",
    title: "Google Meet Video Conference",
    desc: "HD encrypted video consultation with screen-sharing for contract review.",
    icon: Video,
    badge: "Most Popular • Free Tier"
  },
  {
    id: "In-Person Supreme Court Chambers",
    title: "In-Person Chambers Consultation",
    desc: "Chambers 408, Lawyers' Chambers Block, Supreme Court of India Complex.",
    icon: Building,
    badge: "Chambers Visit"
  },
  {
    id: "Urgent Phone Briefing",
    title: "Urgent Direct Telephone Briefing",
    desc: "Direct telephonic strategic conference with Senior Advocate Singhania.",
    icon: Phone,
    badge: "Immediate"
  },
  {
    id: "Written Legal Opinion",
    title: "Written Formal Legal Opinion",
    desc: "Comprehensive statutory memorandum with judicial case precedent citations.",
    icon: FileCheck,
    badge: "Formal Letter"
  }
];

export const ConsultationScheduler: React.FC<ConsultationSchedulerProps> = ({
  initialPracticeArea,
  onBookingComplete,
  onClose
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  // Form State
  const [clientName, setClientName] = useState('Ajay Tripathi');
  const [clientEmail, setClientEmail] = useState('ajaytripathi821@gmail.com');
  const [clientPhone, setClientPhone] = useState('+1 (555) 234-8900');
  const [practiceArea, setPracticeArea] = useState(initialPracticeArea || 'Commercial & Corporate Disputes');
  const [consultationType, setConsultationType] = useState<any>('Google Meet Video Conference');
  const [date, setDate] = useState('2026-09-02');
  const [timeSlot, setTimeSlot] = useState(availableTimeSlots[0]);
  const [matterBrief, setMatterBrief] = useState('Urgent consultation regarding cross-border software licensing dispute, liability limitation covenants, and arbitration venue strategy.');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'free-grant' | 'google-pay' | 'card-sandbox' | 'escrow'>('free-grant');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<PaymentRecord | null>(null);

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !date || !timeSlot) return;
    setStep('payment');
  };

  const handleProcessPaymentAndBook = async () => {
    setIsProcessing(true);
    try {
      const paymentLabel = paymentMethod === 'free-grant'
        ? 'Google Free-Tier Zero Fee Grant / Pro Bono'
        : paymentMethod === 'google-pay'
        ? 'Google Pay (Zero Transaction Fee Sandbox)'
        : paymentMethod === 'card-sandbox'
        ? '3D-Secure Visa/Mastercard Sandbox'
        : 'Bank Escrow Guarantee';

      const payload = {
        consultationData: {
          clientName,
          clientEmail,
          clientPhone,
          practiceArea,
          consultationType,
          date,
          timeSlot,
          matterBrief,
          fee: 0
        },
        paymentMethod: paymentLabel
      };

      const res = await api.processCheckout(payload);
      if (res.success) {
        setConfirmedBooking(res.booking);
        setConfirmedPayment(res.payment);
        setStep('confirmed');
        if (onBookingComplete) {
          onBookingComplete(res.booking);
        }
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Consultation Availability & Booking Portal
            </h3>
            <p className="text-xs text-slate-400">
              Senior Advocate Chambers • 100% Free Tier Assessment • Privileged Communication
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-lg ${step === 'details' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}>
            1. Details & Schedule
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded-lg ${step === 'payment' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}>
            2. Zero-Fee Checkout
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded-lg ${step === 'confirmed' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}>
            3. Confirmed & Link
          </span>
        </div>
      </div>

      {/* STEP 1: Details & Slot Selector */}
      {step === 'details' && (
        <form onSubmit={handleProceedToCheckout} className="space-y-8 animate-in fade-in duration-200">
          
          {/* Consultation Type Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Step 1: Select Consultation Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {meetingModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = consultationType === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setConsultationType(mode.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                          {mode.badge}
                        </span>
                      </div>
                      <div className="font-serif font-bold text-sm text-white">{mode.title}</div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-light">{mode.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                Select Consultation Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
              <p className="text-[11px] text-slate-500">
                Chambers active: Mon - Sat (09:00 AM to 07:30 PM IST / Virtual EST sync)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Select Available Chambers Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      timeSlot === slot
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Client Details & Matter Brief */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Client & Dispute Profile
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Legal Name / Entity</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Telephone / WhatsApp</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Practice Area Discipline</label>
              <select
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Commercial & Corporate Disputes">Commercial & Corporate Disputes</option>
                <option value="Constitutional & Civil Litigation">Constitutional & Civil Litigation</option>
                <option value="Intellectual Property & Cyber Law">Intellectual Property & Cyber Law</option>
                <option value="International & Domestic Arbitration">International & Domestic Arbitration</option>
                <option value="White-Collar & Regulatory Defense">White-Collar & Regulatory Defense</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Matter Briefing & Key Documents</label>
              <textarea
                rows={4}
                value={matterBrief}
                onChange={(e) => setMatterBrief(e.target.value)}
                placeholder="Briefly state factual background, opposing parties, court bench, and required remedy..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero consultation charges for initial legal assessment</span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Proceed to Free Checkout ($0.00)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* STEP 2: Zero-Fee Payment Gateway Simulator */}
      {step === 'payment' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Payment Method Selector */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Integrated Payment Gateway
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Zero-Fee Sandbox Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div
                    onClick={() => setPaymentMethod('free-grant')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'free-grant'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center mt-0.5">
                      {paymentMethod === 'free-grant' && <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Google Free-Tier Pro Bono Grant</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">$0.00 Total</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Complimentary 45-minute initial case evaluation sponsored by Chambers technology grant.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('google-pay')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'google-pay'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center mt-0.5">
                      {paymentMethod === 'google-pay' && <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Google Pay / Instant UPI QR</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">Zero Processing Fee</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Instant zero-charge tokenized authorization via Google Pay authentication.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card-sandbox')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'card-sandbox'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center mt-0.5">
                      {paymentMethod === 'card-sandbox' && <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Credit / Debit Card (Stripe 3D Sandbox)</span>
                        <span className="text-xs font-mono text-slate-400">Encrypted</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        PCI-DSS Level 1 compliant tokenization for corporate cards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    256-bit Encrypted Token Transmission
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    No card details are stored. Consultations are protected under professional attorney-client privilege.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary & Confirm */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Consultation Booking Invoice
                </div>

                <div className="space-y-3 text-xs border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Counsel:</span>
                    <span className="text-white font-medium">Adv. Rajeshwar V. Singhania</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Meeting Format:</span>
                    <span className="text-amber-300 font-medium">{consultationType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date & Slot:</span>
                    <span className="text-white font-medium">{date} @ {timeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Practice Area:</span>
                    <span className="text-slate-200">{practiceArea}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Chambers Consultation Rate:</span>
                    <span>$350.00</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>Chambers Free-Tier Grant:</span>
                    <span>-$350.00 (100% Off)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total Amount Payable:</span>
                    <span className="text-emerald-400 font-mono text-base">$0.00</span>
                  </div>
                </div>

                <button
                  onClick={handleProcessPaymentAndBook}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Zero-Fee Transaction & Generating Link...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Confirm Consultation</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep('details')}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white text-center"
                >
                  ← Modify Date or Information
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: Confirmed with 1-Click Google Meet Link & Receipt */}
      {step === 'confirmed' && confirmedBooking && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-serif text-2xl font-bold text-white">
              Consultation Successfully Confirmed!
            </h4>
            <p className="text-xs text-slate-300 font-light">
              Your appointment has been registered in Chambers Docket. Google Meet details and privileged briefing have been synchronized.
            </p>
          </div>

          {/* Google Meet Direct Join Box */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-xl mx-auto space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Video className="w-4 h-4" />
                Google Meet Video Conference Room
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                Meeting Ready
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 truncate max-w-[280px]">
                {confirmedBooking.meetLink}
              </span>
              <a
                href={confirmedBooking.meetLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <span>Join Google Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Scheduled Time:</span>
                <span className="font-semibold">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Transaction Reference:</span>
                <span className="font-mono text-amber-400">{confirmedPayment?.transactionId || "TXN-OK"}</span>
              </div>
            </div>
          </div>

          {/* Receipt Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Receipt (PDF)</span>
            </button>

            <button
              onClick={() => {
                setStep('details');
                if (onClose) onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
            >
              Done & Return to Portal
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
