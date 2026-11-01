import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Eye, 
  Printer, 
  Sliders, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Home,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';
import { BUILT_HOMES_GALLERY, BuiltHomeSlide } from '../data/builtHomes';
import { Floorplan } from '../types';

interface HomesWeHaveBuiltGalleryProps {
  floorplans: Floorplan[];
  onOpenSlideshow: () => void;
  onOpenTour: (plan: Floorplan) => void;
  onSelectDetail: (plan: Floorplan) => void;
  onPrint: (plan: Floorplan) => void;
}

export const HomesWeHaveBuiltGallery: React.FC<HomesWeHaveBuiltGalleryProps> = ({
  floorplans,
  onOpenSlideshow,
  onOpenTour,
  onSelectDetail,
  onPrint
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [activePhotoModal, setActivePhotoModal] = useState<{
    home: BuiltHomeSlide;
    photoIndex: number;
  } | null>(null);

  const regions = [
    'All',
    'Kitsap County',
    'Port Orchard',
    'Bremerton',
    'Belfair',
    'Sequim',
    'Hood Canal'
  ];

  const filteredHomes = BUILT_HOMES_GALLERY.filter((home) => {
    if (selectedRegion === 'All') return true;
    return home.location.toLowerCase().includes(selectedRegion.toLowerCase());
  });

  const getFloorplan = (floorplanId: string): Floorplan | undefined => {
    return floorplans.find(f => f.id === floorplanId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Showcase Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showroom Portfolio · Mountain View Homes of Bremerton</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Homes We Have Built
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
            Every home we deliver is crafted for Pacific Northwest living. Explore real completed installations across Kitsap County, Belfair, Port Orchard, Sequim, and the Olympic Peninsula—featuring custom porches, view packages, Energy Star insulation, and turnkey site setups.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenSlideshow}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Fullscreen Slideshow</span>
            </button>

            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>12 Featured Builds · Real Client Installations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Region:
          </span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion === region
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenSlideshow}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span>Screensaver Slideshow Mode</span>
        </button>
      </div>

      {/* Built Homes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHomes.map((home) => {
          const matchedPlan = getFloorplan(home.floorplanId);

          return (
            <div 
              key={home.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Image Container with Badges */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                <img 
                  src={home.primaryImage} 
                  alt={home.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600/95 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                    <span>Real Build</span>
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900/90 text-slate-200 text-[10px] font-semibold backdrop-blur-md">
                    {home.manufacturer}
                  </span>
                </div>

                {/* 3D Tour Badge */}
                {home.hasTour && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>3D Tour</span>
                    </span>
                  </div>
                )}

                {/* Location overlay bottom */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 font-medium drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{home.location}</span>
                  </div>
                  {home.allPhotos.length > 1 && (
                    <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                      {home.allPhotos.length} Photos
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {home.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-emerald-800">
                        {home.priceFormatted}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {home.series} · {home.sections}
                  </p>

                  {/* Specs Row */}
                  <div className="flex items-center gap-3 py-2 text-xs text-slate-600 font-semibold border-y border-slate-100 my-2.5">
                    <span>{home.bedrooms} Beds</span>
                    <span>·</span>
                    <span>{home.bathrooms} Baths</span>
                    <span>·</span>
                    <span>{home.squareFeet.toLocaleString()} Sq Ft</span>
                    <span>·</span>
                    <span>{home.dimensions}</span>
                  </div>

                  {/* Construction Highlights */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {home.buildHighlights}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  {home.hasTour && matchedPlan && (
                    <button
                      onClick={() => onOpenTour(matchedPlan)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>3D Virtual Tour</span>
                    </button>
                  )}

                  {matchedPlan && (
                    <button
                      onClick={() => onSelectDetail(matchedPlan)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-600" />
                      <span>Floorplan & Options</span>
                    </button>
                  )}

                  {matchedPlan && (
                    <button
                      onClick={() => onPrint(matchedPlan)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
                      title="Print spec sheet"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
