import React, { useState } from 'react';
import { Floorplan } from '../types';
import { 
  Eye, 
  Maximize2, 
  Printer, 
  Calendar, 
  Sliders, 
  ExternalLink, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Compass,
  Sparkles,
  Layers
} from 'lucide-react';

interface OnPageTourShowcaseProps {
  floorplansWithTours: Floorplan[];
  activeTourPlan: Floorplan;
  onSelectTourPlan: (plan: Floorplan) => void;
  onOpenFullscreen: (plan: Floorplan) => void;
  onPrint: (plan: Floorplan) => void;
  onCustomize: (plan: Floorplan) => void;
  onBookAppointment: (plan: Floorplan) => void;
}

export const OnPageTourShowcase: React.FC<OnPageTourShowcaseProps> = ({
  floorplansWithTours,
  activeTourPlan,
  onSelectTourPlan,
  onOpenFullscreen,
  onPrint,
  onCustomize,
  onBookAppointment,
}) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  const isMatterport = Boolean(activeTourPlan.matterportUrl);

  const scrollLeft = () => {
    setScrollIndex(prev => Math.max(0, prev - 4));
  };

  const scrollRight = () => {
    setScrollIndex(prev => Math.min(floorplansWithTours.length - 4, prev + 4));
  };

  return (
    <section className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl space-y-0">
      
      {/* Header bar of 3D Theater */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                Interactive 3D Showroom Theater
              </span>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-800">
                {floorplansWithTours.length} Virtual Walkthroughs Available
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{activeTourPlan.name}</span>
              <span className="text-sm font-medium text-slate-400">·</span>
              <span className="text-sm font-semibold text-emerald-400">
                {isMatterport ? 'Matterport 3D Tour' : 'Momento360 Virtual Walkthrough'}
              </span>
            </h2>
          </div>
        </div>

        {/* Action Controls for Active 3D Tour */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTourPlan.floorplanPdf && (
            <a
              href={activeTourPlan.floorplanPdf}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Floorplan PDF</span>
            </a>
          )}

          <button
            onClick={() => onCustomize(activeTourPlan)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Customize</span>
          </button>

          <button
            onClick={() => onPrint(activeTourPlan)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Print Specs</span>
          </button>

          <button
            onClick={() => onBookAppointment(activeTourPlan)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Waitlist / Tour</span>
          </button>

          <button
            onClick={() => onOpenFullscreen(activeTourPlan)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            title="Open Fullscreen 3D View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Embedded 3D Viewer Container */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[580px] min-h-[380px] bg-black">
        {activeTourPlan.primaryTour ? (
          <iframe
            key={activeTourPlan.primaryTour}
            src={activeTourPlan.primaryTour}
            title={`${activeTourPlan.name} 3D Tour`}
            className="w-full h-full border-0"
            allow="xr-spatial-tracking; fullscreen; accelerometer; gyroscope"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span>Loading 3D tour...</span>
          </div>
        )}

        {/* Floating Quick Meta Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2 text-xs flex items-center gap-3 shadow-lg pointer-events-none">
          <span className="font-bold text-white">{activeTourPlan.sections} Section</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono text-slate-300">{activeTourPlan.squareFeet.toLocaleString()} SQ FT</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">{activeTourPlan.bedrooms} Beds / {activeTourPlan.bathrooms} Baths</span>
          <span className="text-slate-500">·</span>
          <span className="font-bold text-emerald-400 font-mono">${activeTourPlan.basePrice.toLocaleString()} Base</span>
        </div>
      </div>

      {/* 3D Walkthrough Carousel Selector Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              Browse More 3D Walkthroughs:
            </span>
            <span className="text-[11px] text-slate-500">
              Tap any model below to step inside instantly on this kiosk screen
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={scrollLeft}
              disabled={scrollIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              disabled={scrollIndex >= floorplansWithTours.length - 4}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel of 3D Tour Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {floorplansWithTours.slice(scrollIndex, scrollIndex + 6).map((plan) => {
            const isSelected = plan.id === activeTourPlan.id;
            return (
              <button
                key={plan.id}
                onClick={() => onSelectTourPlan(plan)}
                className={`group text-left rounded-xl p-2 transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                    : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-slate-950">
                  <img
                    src={plan.exteriorImageUrl}
                    alt={plan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                    3D Tour
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Viewing Now
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs font-bold text-white truncate leading-tight">
                  {plan.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                  <span>{plan.series}</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {plan.squareFeet} sq ft
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
};
