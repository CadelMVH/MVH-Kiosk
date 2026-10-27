import React, { useState } from 'react';
import { Floorplan, AppointmentBooking } from '../types';
import { 
  X, 
  Users, 
  Clock, 
  Check, 
  PhoneCall, 
  Trash2, 
  Edit3, 
  Building2, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface StaffManagerModalProps {
  bookings: AppointmentBooking[];
  floorplans: Floorplan[];
  onClose: () => void;
  onUpdateBookingStatus: (id: string, status: AppointmentBooking['status']) => void;
  onUpdateFloorplanPrice: (id: string, newPrice: number) => void;
}

export const StaffManagerModal: React.FC<StaffManagerModalProps> = ({
  bookings,
  floorplans,
  onClose,
  onUpdateBookingStatus,
  onUpdateFloorplanPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory'>('queue');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const waitingList = bookings.filter(b => b.type === 'live_waitlist' && b.status !== 'completed');
  const futureList = bookings.filter(b => b.type === 'future_appointment');

  const triggerCallClient = (booking: AppointmentBooking) => {
    onUpdateBookingStatus(booking.id, 'called');
    setAlertMessage(`SMS Alert Sent to ${booking.clientName} (${booking.phone}): "Your sales consultant is ready for you at Desk 1!"`);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/mvhBremertonCap_8f5d5a13.png" 
              alt="Mountain View Homes of Bremerton Logo"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <h3 className="font-bold text-base text-white">Mountain View Homes of Bremerton · Staff Desk</h3>
              <p className="text-xs text-slate-400">Live floor queue, upcoming appointments, and inventory controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Showroom Queue & Bookings ({waitingList.length} Active)</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-600" />
              <span>Floorplan Inventory & Pricing</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Terminal #1 · Authorized Staff</span>
        </div>

        {/* Feedback Alert Banner */}
        {alertMessage && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'queue' && (
            <div className="space-y-6">
              
              {/* Live Walk-In Waitlist Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>Live Walk-In Waitlist Queue</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        {waitingList.length} Waiting
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">Clients currently in the showroom awaiting an available sales rep</p>
                  </div>
                </div>

                {waitingList.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                    No customers currently waiting in the live queue.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {waitingList.map((booking) => (
                      <div 
                        key={booking.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-mono uppercase text-slate-400">TICKET</span>
                            <span className="font-mono font-bold text-sm text-amber-400">{booking.ticketNumber}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{booking.clientName}</span>
                              <span className="text-xs text-slate-500 font-mono">({booking.phone})</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                booking.status === 'called' 
                                  ? 'bg-amber-100 text-amber-800 animate-pulse' 
                                  : booking.status === 'in_consultation'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {booking.status === 'called' ? 'Called (SMS Sent)' : booking.status === 'in_consultation' ? 'In Meeting' : 'Waiting in Showroom'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span>Interested in: <strong className="text-slate-700">{booking.interestedPlanName}</strong></span>
                              <span>·</span>
                              <span>Party: <strong>{booking.partySize} guests</strong></span>
                              <span>·</span>
                              <span>Checked In: <strong className="font-mono">{booking.createdAt}</strong></span>
                            </div>

                            {booking.notes && (
                              <p className="text-[11px] text-slate-600 mt-1 italic">
                                Note: "{booking.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Staff Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {booking.status === 'waiting' && (
                            <button
                              onClick={() => triggerCallClient(booking)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Call Client (SMS)</span>
                            </button>
                          )}

                          {booking.status === 'called' && (
                            <button
                              onClick={() => onUpdateBookingStatus(booking.id, 'in_consultation')}
                              className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Start Consultation</span>
                            </button>
                          )}

                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark Complete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Future Appointments Section */}
              <div className="pt-4 border-t border-slate-200">
                <div className="mb-3">
                  <h4 className="font-bold text-sm text-slate-900">Upcoming Scheduled Appointments</h4>
                  <p className="text-xs text-slate-500">Reserved appointments booked via kiosk or online</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  {futureList.map((app) => (
                    <div key={app.id} className="p-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{app.clientName}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {app.phone} · {app.interestedPlanName} · {app.notes}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">{app.date}</div>
                        <div className="text-[11px] font-mono text-sky-700 font-semibold">{app.timeSlot}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="mb-2">
                <h4 className="font-bold text-sm text-slate-900">Floorplan Inventory Pricing Controls</h4>
                <p className="text-xs text-slate-500">Adjust base dealer pricing displayed on the customer showroom kiosk</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                {floorplans.map((fp) => (
                  <div key={fp.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <img 
                          src={fp.exteriorImageUrl} 
                          alt={fp.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{fp.name}</div>
                        <div className="text-slate-500 text-[11px]">
                          {fp.series} · {fp.bedrooms} Bed / {fp.bathrooms} Bath · {fp.squareFeet} SQ FT · {fp.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Base Price</span>
                        <div className="font-mono font-bold text-sm text-slate-900">
                          ${fp.basePrice.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const input = prompt(`Enter new base price for ${fp.name}:`, fp.basePrice.toString());
                          if (input && !isNaN(Number(input))) {
                            onUpdateFloorplanPrice(fp.id, Number(input));
                            setAlertMessage(`Updated base price for ${fp.name} to $${Number(input).toLocaleString()}`);
                            setTimeout(() => setAlertMessage(null), 4000);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-xs border border-slate-300"
                      >
                        Adjust Price
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
