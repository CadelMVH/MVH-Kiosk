import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Sparkles, 
  Home, 
  ArrowRight, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  MapPin, 
  CheckCircle2, 
  X,
  Layers,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';
import { BUILT_HOMES_GALLERY, BuiltHomeSlide } from '../data/builtHomes';
import { assetUrl } from '../lib/assetUrl';

interface AttractorScreensaverProps {
  onDismiss: () => void;
  onSelectHome?: (floorplanId: string) => void;
}

export const AttractorScreensaver: React.FC<AttractorScreensaverProps> = ({ 
  onDismiss,
  onSelectHome 
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeSlide: BuiltHomeSlide = BUILT_HOMES_GALLERY[currentSlideIndex] || BUILT_HOMES_GALLERY[0];
  const activePhoto = activeSlide.allPhotos[currentPhotoIndex] || activeSlide.primaryImage;

  // Slide auto-rotation timer (6.5s)
  const SLIDE_DURATION = 6500;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset photo index when slide changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
    setProgress(0);
  }, [currentSlideIndex]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const progressStep = (stepMs / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + progressStep;
      });
    }, stepMs);

    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BUILT_HOMES_GALLERY.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev === 0 ? BUILT_HOMES_GALLERY.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % BUILT_HOMES_GALLERY.length);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleExploreHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectHome) {
      onSelectHome(activeSlide.floorplanId);
    } else {
      onDismiss();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950 select-none kiosk-screensaver flex items-center justify-center overflow-hidden animate-in fade-in duration-500 font-sans"
    >
      {/* Background Rotating Images with Ambient Zoom & Fade */}
      {BUILT_HOMES_GALLERY.map((slide, idx) => {
        const isCurrent = idx === currentSlideIndex;
        const photoToDisplay = isCurrent ? activePhoto : slide.primaryImage;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-80 scale-102' : 'opacity-0 scale-100 pointer-events-none'
            }`}
            style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
          >
            <img 
              src={photoToDisplay} 
              alt={slide.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      })}

      {/* Atmospheric Multi-layer Gradient Scrim for readable text */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none hidden md:block" />

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={assetUrl("/assets/aistudio/mvhBremertonCap_8f5d5a13.png")} 
            alt="Mountain View Homes of Bremerton"
            className="w-12 h-12 object-contain drop-shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold uppercase tracking-widest text-white drop-shadow">
                Mountain View Homes of Bremerton
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>HOMES WE HAVE BUILT</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              3472 W Belfair Valley Rd, Bremerton, WA · (360) 979-8430
            </p>
          </div>
        </div>

        {/* Top Controls: Dismiss / Exit Kiosk Screensaver */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/20 text-xs font-semibold backdrop-blur-md cursor-pointer transition-all"
            title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={onDismiss}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-950 border border-white/30 text-xs font-bold backdrop-blur-md cursor-pointer transition-all shadow-lg active:scale-95"
          >
            <span>Enter Catalog</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Feature Content Card (Left-aligned on wide screens, centered on mobile) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-28 md:pb-24 pointer-events-none">
        
        <div className="max-w-2xl bg-slate-950/85 backdrop-blur-xl border border-white/15 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 pointer-events-auto animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Top Series & Location Banner */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
              Real Build Spotlight
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-semibold border border-white/15">
              {activeSlide.manufacturer} · {activeSlide.series}
            </span>
            <div className="flex items-center gap-1 text-xs text-sky-300 font-medium ml-auto">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{activeSlide.location}</span>
            </div>
          </div>

          {/* Model Name & Base Price */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {activeSlide.name}
            </h1>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400">
                {activeSlide.priceFormatted}
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Master 2026 Price
              </span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-4 gap-2 py-1 text-center bg-white/5 rounded-2xl p-2.5 border border-white/10">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Bedrooms</span>
              <span className="text-base font-bold text-white">{activeSlide.bedrooms} Bed</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Baths</span>
              <span className="text-base font-bold text-white">{activeSlide.bathrooms} Bath</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Square Feet</span>
              <span className="text-base font-bold text-white">{activeSlide.squareFeet.toLocaleString()} sq ft</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Dimensions</span>
              <span className="text-base font-bold text-white">{activeSlide.dimensions}</span>
            </div>
          </div>

          {/* Real Construction Highlights */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
            {activeSlide.buildHighlights}
          </p>

          {/* Customer Story Quote / Location Detail */}
          {activeSlide.customerStory && (
            <div className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{activeSlide.customerStory}</span>
            </div>
          )}

          {/* Multi-Photo Switcher (if home has multiple build photos) */}
          {activeSlide.allPhotos.length > 1 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Build Angles:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {activeSlide.allPhotos.map((photoUrl, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex(pIdx);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                      pIdx === currentPhotoIndex 
                        ? 'bg-white text-slate-950 border-white shadow-sm' 
                        : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
                    }`}
                  >
                    Photo {pIdx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExploreHome}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-emerald-900/50 transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4 animate-pulse" />
              <span>Explore Floorplan & 3D Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onDismiss}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-semibold text-xs border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>Browse All 145 Models</span>
            </button>
          </div>

        </div>

      </div>

      {/* Left / Right Carousel Touch Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform active:scale-90 shadow-xl"
        title="Previous built home"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform active:scale-90 shadow-xl"
        title="Next built home"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Thumbnails Strip & Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-6 pb-4 px-6">
        
        {/* Progress bar across top of thumbnail bar */}
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-3">
          <div 
            className="bg-emerald-400 h-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Thumbnails scrollable strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {BUILT_HOMES_GALLERY.map((slide, idx) => {
              const isSelected = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(idx);
                  }}
                  className={`relative w-20 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-emerald-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img 
                    src={slide.primaryImage} 
                    alt={slide.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-500/20" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Voice / Touch prompt on Kiosk */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 text-slate-300 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
              <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>"Show me homes built in Kitsap"</span>
            </div>
            <button
              onClick={onDismiss}
              className="text-white font-bold hover:underline cursor-pointer"
            >
              Touch to Start →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
