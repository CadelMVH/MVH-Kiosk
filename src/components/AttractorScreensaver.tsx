import React, { useState, useEffect } from 'react';
import { Mic, Touchpad as TouchIcon, Sparkles, Home, ArrowRight, Eye } from 'lucide-react';

interface AttractorScreensaverProps {
  onDismiss: () => void;
}

export const AttractorScreensaver: React.FC<AttractorScreensaverProps> = ({ onDismiss }) => {
  const images = [
    '/src/assets/images/hero_dealership_showroom_1793126179418.jpg',
    '/src/assets/images/home_aspen_doublewide_1793126180064.jpg',
    '/src/assets/images/home_sedona_ranch_1793126180498.jpg',
    '/src/assets/images/interior_3d_walkthrough_greatroom_1793126181350.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div 
      onClick={onDismiss}
      className="fixed inset-0 z-50 bg-black cursor-pointer select-none kiosk-screensaver flex items-center justify-center overflow-hidden animate-in fade-in duration-500"
    >
      {/* Background Rotating Images with Gentle Zoom */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentImageIndex ? 'opacity-70 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1200ms' }}
        >
          <img 
            src={img} 
            alt="Showroom Model Home"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      {/* Dark Ambient Vignette / Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 pointer-events-none" />

      {/* Center Attractor Copy & Call to Action */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white space-y-8 pointer-events-none">
        
        <div className="flex flex-col items-center gap-3">
          <img 
            src="/assets/aistudio/mvhBremertonCap_8f5d5a13.png" 
            alt="Mountain View Homes of Bremerton"
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-sky-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mountain View Homes of Bremerton · Showroom Concierge</span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            Find Your Dream Home
          </h1>
          <p className="text-base md:text-xl text-slate-200 mt-3 font-light max-w-xl mx-auto leading-relaxed drop-shadow">
            Browse floorplans, step inside immersive 3D virtual tours, customize interior finishes, and take home printed specs.
          </p>
        </div>

        {/* Big Touch & Voice Callout */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-base shadow-2xl animate-pulse">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Touch Anywhere to Begin</span>
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-slate-900/80 backdrop-blur-md text-white border border-white/20 rounded-2xl font-medium text-sm">
            <Mic className="w-4 h-4 text-amber-400" />
            <span>Or Speak in Plain English</span>
          </div>
        </div>

        <div className="pt-6 text-xs text-slate-400">
          Mountain View Homes of Bremerton · Terminal #1 · Sales Representatives On Duty
        </div>

      </div>

    </div>
  );
};
