import React, { useState } from 'react';
import { Floorplan, AppointmentBooking } from '../types';
import { 
  X, 
  Calendar, 
  Users, 
  Clock, 
  Phone, 
  User, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Ticket,
  MessageSquare
} from 'lucide-react';

interface AppointmentWaitlistModalProps {
  floorplan?: Floorplan | null;
  onClose: () => void;
  onBookingConfirmed: (booking: AppointmentBooking) => void;
  currentQueueLength: number;
}

export const AppointmentWaitlistModal: React.FC<AppointmentWaitlistModalProps> = ({
  floorplan,
  onClose,
  onBookingConfirmed,
  currentQueueLength,
}) => {
  const [activeTab, setActiveTab] = useState<'live_waitlist' | 'future_appointment'>('live_waitlist');
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('2026-10-28');
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [consultationTopic, setConsultationTopic] = useState('Pricing & Custom Floorplans');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) return;

    const randomTicketNum = `A-${Math.floor(Math.random() * 80) + 15}`;
    const newBooking: AppointmentBooking = {
      id: `book-${Date.now()}`,
      ticketNumber: randomTicketNum,
      clientName: clientName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      type: activeTab,
      date: activeTab === 'live_waitlist' ? 'Today' : date,
      timeSlot: activeTab === 'live_waitlist' ? 'Now (Queue)' : timeSlot,
      interestedPlanName: floorplan?.name || 'General Manufactured Homes',
      notes: notes.trim() || `${consultationTopic} consultation requested.`,
      partySize,
      status: activeTab === 'live_waitlist' ? 'waiting' : 'scheduled',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              {confirmedBooking ? 'You Are All Set!' : 'Connect With Our Sales Specialists'}
            </h3>
            <p className="text-xs text-slate-500">
              {confirmedBooking 
                ? 'Your request is recorded in the showroom management desk' 
                : 'Join our live showroom queue or book a private future appointment'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If already confirmed, display the boarding-pass ticket */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {confirmedBooking.type === 'live_waitlist' ? 'Showroom Queue Confirmed' : 'Appointment Scheduled'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {confirmedBooking.type === 'live_waitlist' ? `Ticket #${confirmedBooking.ticketNumber}` : 'Appointment Reserved'}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                {confirmedBooking.type === 'live_waitlist'
                  ? `Thank you, ${confirmedBooking.clientName}! An SMS text alert has been queued to ${confirmedBooking.phone}. When your consultant is free, we will text you immediately.`
                  : `Your meeting for ${confirmedBooking.date} at ${confirmedBooking.timeSlot} is reserved. We look forward to walking through ${confirmedBooking.interestedPlanName} with you!`}
              </p>
            </div>

            {/* Ticket Card Details */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-5 text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-500">Client:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.clientName} (Party of {confirmedBooking.partySize})</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-500">Contact Number:</span>
                <span className="font-mono font-bold text-slate-900">{confirmedBooking.phone}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-500">Interested Home:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.interestedPlanName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">
                  {confirmedBooking.type === 'live_waitlist' 
                    ? `Position in line: #${currentQueueLength + 1} (Est. ${Math.max(5, (currentQueueLength + 1) * 8)} min wait)` 
                    : `${confirmedBooking.date} at ${confirmedBooking.timeSlot}`}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-sm font-bold transition-all shadow-md"
              >
                Return to Showroom Floorplan Browser
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Segmented Control: Live Waitlist vs Future Appointment */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveTab('live_waitlist')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'live_waitlist'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Ticket className="w-4 h-4 text-emerald-600" />
                <span>Speak With Rep Today (Queue)</span>
              </button>

              <button
                onClick={() => setActiveTab('future_appointment')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'future_appointment'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Book Future Appointment</span>
              </button>
            </div>

            {/* Waitlist Banner for Live Waitlist */}
            {activeTab === 'live_waitlist' ? (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">Sales Floor is Busy: Join Live Queue</div>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    There are currently <strong>{currentQueueLength} clients</strong> exploring ahead of you (est. {Math.max(5, currentQueueLength * 8)} min wait). Grab your ticket, explore our 3D tours, and we'll text your phone the moment your sales specialist is available!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3.5 text-xs text-sky-900 flex items-start gap-3">
                <Calendar className="w-4 h-4 text-sky-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">Schedule an In-Depth Home Consultation</div>
                  <p className="text-[11px] text-sky-800 mt-0.5 leading-relaxed">
                    Reserve dedicated 1-on-1 time with our modular home architects to review lot zoning, land improvements, custom blueprints, and financing pre-approvals.
                  </p>
                </div>
              </div>
            )}

            {/* Selected Floorplan Callout */}
            {floorplan && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                    <img 
                      src={floorplan.exteriorImageUrl} 
                      alt={floorplan.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Selected Home Model</span>
                    <div className="font-bold text-slate-900">{floorplan.name} ({floorplan.series})</div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-800">
                  ${floorplan.basePrice.toLocaleString()}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John & Sarah Miller"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (For Text Alert) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Party Size / Family Members</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs bg-white"
                    >
                      <option value={1}>1 Person</option>
                      <option value={2}>2 People</option>
                      <option value={3}>3 People</option>
                      <option value={4}>4 People</option>
                      <option value={5}>5+ People</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* If future appointment, show date and time slot pickers */}
              {activeTab === 'future_appointment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs bg-white"
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Late Morning)</option>
                      <option value="1:30 PM">1:30 PM (Early Afternoon)</option>
                      <option value="3:00 PM">3:00 PM (Mid Afternoon)</option>
                      <option value="4:30 PM">4:30 PM (Evening)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notes / Special Preferences */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">What would you like to discuss?</label>
                <input
                  type="text"
                  placeholder="e.g. Land improvement, trade-in value, 4 bedroom plans, financing"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <span>
                    {activeTab === 'live_waitlist' 
                      ? 'Confirm & Join Live Showroom Waitlist' 
                      : 'Schedule Private Consultation'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                🔒 Your privacy is strictly protected. Your information will only be used by your assigned sales consultant.
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
