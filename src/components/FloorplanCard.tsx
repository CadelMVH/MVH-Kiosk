import React, { useState } from 'react';
import { Floorplan } from '../types';
import { Eye, Printer, Sliders, FileText, CheckCircle2, Home } from 'lucide-react';

interface FloorplanCardProps {
  floorplan: Floorplan;
  onSelect: (floorplan: Floorplan) => void;
  onOpenTour: (floorplan: Floorplan) => void;
  onPrint: (floorplan: Floorplan) => void;
}

export const FloorplanCard: React.FC<FloorplanCardProps> = ({
  floorplan,
  onSelect,
  onOpenTour,
  onPrint,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Home Image Container with Badges */}
      <div 
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => {
          if (floorplan.hasTour) {
            onOpenTour(floorplan);
          } else {
            onSelect(floorplan);
          }
        }}
      >
        {!imageError && floorplan.exteriorImageUrl ? (
          <img 
            src={floorplan.exteriorImageUrl} 
            alt={floorplan.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <Home className="w-12 h-12 mb-2 text-slate-300" />
            <span className="text-xs font-semibold text-slate-600">{floorplan.name}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{floorplan.manufacturer} · {floorplan.series}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {floorplan.manufacturer && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              {floorplan.manufacturer}
            </span>
          )}
          <span className="bg-slate-800/85 backdrop-blur-md text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs">
            {floorplan.series}
          </span>
        </div>

        {/* 3D Walkthrough Top-Right Indicator */}
        {floorplan.hasTour && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 border border-emerald-400/30">
              <Eye className="w-3 h-3" />
              <span>3D Tour</span>
            </span>
          </div>
        )}

        {/* 3D Walkthrough Floating Overlay Button */}
        {floorplan.hasTour && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTour(floorplan);
            }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-bold backdrop-blur-md transition-all border border-emerald-400/40 shadow-lg cursor-pointer z-10"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Step Inside (3D)</span>
          </button>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Metadata Header (Anti-slop zero pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{floorplan.sections} Section</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{floorplan.squareFeet.toLocaleString()} SQ FT</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{floorplan.dimensions}</span>
          </div>

          <h3 
            onClick={() => onSelect(floorplan)}
            className="text-base font-bold text-slate-900 tracking-tight mt-1 group-hover:text-emerald-800 transition-colors line-clamp-1 cursor-pointer"
          >
            {floorplan.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {floorplan.description}
          </p>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">{floorplan.bedrooms} Beds</span>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">{floorplan.bathrooms} Baths</span>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              {floorplan.hasTour ? (
                <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  3D Virtual Tour
                </span>
              ) : (
                <span>{floorplan.photos?.length || 1} Factory Photos</span>
              )}
            </div>
          </div>
        </div>

        {/* Price and Action Buttons */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Factory Base Estimate</span>
              <div className="text-lg font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                ${floorplan.basePrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Est. Payment</span>
              <div className="text-xs font-semibold font-mono text-emerald-700">
                ${floorplan.estimatedMonthly.toLocaleString()}/mo
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(floorplan)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Details & Options</span>
            </button>

            <button
              onClick={() => onPrint(floorplan)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200/80 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Print Specs</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
