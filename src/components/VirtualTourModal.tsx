import React, { useState } from 'react';
import { Floorplan } from '../types';
import { 
  X, 
  Eye, 
  Printer, 
  Calendar, 
  Sliders, 
  ExternalLink, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Maximize2
} from 'lucide-react';

interface VirtualTourModalProps {
  floorplan: Floorplan;
  onClose: () => void;
  onOpenCustomizer: (floorplan: Floorplan) => void;
  onPrint: (floorplan: Floorplan) => void;
  onBookAppointment: (floorplan: Floorplan) => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  floorplan,
  onClose,
  onOpenCustomizer,
  onPrint,
  onBookAppointment,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'gallery'>('3d');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const photos = floorplan.photos && floorplan.photos.length > 0 
    ? floorplan.photos 
    : [floorplan.exteriorImageUrl];

  const hasTour = Boolean(floorplan.primaryTour);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between text-white animate-in fade-in duration-200 select-none">
      
      {/* Top Kiosk Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>{hasTour ? (floorplan.matterportUrl ? 'Matterport 3D Tour' : '360° Virtual Walkthrough') : 'Photo Gallery'}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{floorplan.name}</h2>
              {floorplan.manufacturer && (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {floorplan.manufacturer}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{floorplan.series}</span>
              <span>·</span>
              <span>{floorplan.squareFeet.toLocaleString()} SQ FT</span>
              <span>·</span>
              <span>{floorplan.bedrooms} Beds / {floorplan.bathrooms} Baths</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">${floorplan.basePrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-2">
          {hasTour && (
            <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Interactive 3D</span>
              </button>

              <button
                onClick={() => setViewMode('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'gallery'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({photos.length})</span>
              </button>
            </div>
          )}

          {floorplan.floorplanPdf && (
            <a
              href={floorplan.floorplanPdf}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl font-medium text-xs transition-all border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Floorplan PDF</span>
            </a>
          )}

          <button
            onClick={() => onOpenCustomizer(floorplan)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl font-medium text-xs transition-all border border-slate-700"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Customize</span>
          </button>

          <button
            onClick={() => onPrint(floorplan)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl font-medium text-xs transition-all border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Print Specs</span>
          </button>

          <button
            onClick={() => onBookAppointment(floorplan)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl font-semibold text-xs transition-all shadow-md"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve / Waitlist</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 ml-1"
            title="Close Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {viewMode === '3d' && hasTour ? (
          <div className="w-full h-full relative">
            <iframe
              src={floorplan.primaryTour}
              title={`${floorplan.name} 3D Virtual Tour`}
              className="w-full h-full border-0"
              allow="xr-spatial-tracking; fullscreen; accelerometer; gyroscope"
              allowFullScreen
            />
          </div>
        ) : (
          /* Photo Gallery Viewer */
          <div className="relative w-full h-full flex flex-col justify-between p-6">
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <img 
                src={photos[selectedPhotoIndex]} 
                alt={`${floorplan.name} photo ${selectedPhotoIndex + 1}`}
                className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next controls */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedPhotoIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setSelectedPhotoIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail carousel */}
            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 overflow-x-auto scrollbar-none">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      idx === selectedPhotoIndex ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={photo} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar Info Strip */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>Dimensions: <strong className="text-white font-mono">{floorplan.dimensions}</strong></span>
          <span>·</span>
          <span>Series: <strong className="text-white">{floorplan.series}</strong></span>
          <span>·</span>
          <span>Sections: <strong className="text-white">{floorplan.sections}</strong></span>
        </div>

        <div className="text-slate-300 font-mono text-[11px]">
          MOUNTAIN VIEW HOMES OF BREMERTON · SHOWROOM 3D EXPERIENCE
        </div>
      </div>

    </div>
  );
};
