import React from 'react';
import { Floorplan } from '../types';

interface FloorplanBlueprintProps {
  floorplan: Floorplan;
  interactive?: boolean;
}

export const FloorplanBlueprint: React.FC<FloorplanBlueprintProps> = ({ floorplan, interactive = false }) => {
  return (
    <div className="relative w-full aspect-[16/10] bg-[#0F172A] rounded-xl overflow-hidden border border-slate-700/80 p-4 flex flex-col justify-between text-slate-200 select-none shadow-inner">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38BDF8 1px, transparent 1px),
            linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Blueprint Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-sky-500/30 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sky-400 font-semibold tracking-wider">DWG #{floorplan.id.toUpperCase()}-2026</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300 font-medium">{floorplan.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-400 font-mono">{floorplan.dimensions}</span>
        </div>
        <div className="font-mono text-[11px] text-sky-300/80">
          SCALE: 1/4" = 1'-0" · HUD CERTIFIED
        </div>
      </div>

      {/* Architectural Schematic Drawing */}
      <div className="relative z-10 flex-1 my-3 flex items-center justify-center">
        <svg viewBox="0 0 800 460" className="w-full h-full max-h-[380px] drop-shadow-md">
          <defs>
            <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.3" />
            </pattern>
          </defs>

          {/* Exterior Foundation & Outer Perimeter Walls */}
          <rect x="50" y="40" width="700" height="360" rx="4" fill="#0B132B" stroke="#38BDF8" strokeWidth="4" />
          
          {/* Dimension Extension Lines */}
          <line x1="50" y1="20" x2="750" y2="20" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="50" y1="15" x2="50" y2="25" stroke="#38BDF8" strokeWidth="2" />
          <line x1="750" y1="15" x2="750" y2="25" stroke="#38BDF8" strokeWidth="2" />
          <text x="400" y="16" fill="#38BDF8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            OVERALL LENGTH: {floorplan.dimensions.split('×')[1]?.trim() || "64'"}
          </text>

          <line x1="775" y1="40" x2="775" y2="400" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="770" y1="40" x2="780" y2="400" stroke="#38BDF8" strokeWidth="2" />
          <text x="770" y="225" fill="#38BDF8" fontSize="12" fontFamily="monospace" textAnchor="middle" transform="rotate(90, 785, 225)" fontWeight="bold">
            WIDTH: {floorplan.dimensions.split('×')[0]?.trim() || "28'"}
          </text>

          {/* Front Covered Porch Area */}
          <rect x="50" y="320" width="300" height="80" fill="url(#hatch)" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="200" y="365" fill="#7DD3FC" fontSize="13" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">
            COVERED TIMBER FRONT PORCH (28' × 6')
          </text>
          {/* Porch Support Columns */}
          <rect x="55" y="385" width="12" height="12" fill="#38BDF8" />
          <rect x="195" y="385" width="12" height="12" fill="#38BDF8" />
          <rect x="335" y="385" width="12" height="12" fill="#38BDF8" />

          {/* Interior Room Divider Walls */}
          {/* Wall between Primary Suite & Great Room */}
          <line x1="280" y1="40" x2="280" y2="320" stroke="#38BDF8" strokeWidth="3" />
          {/* Wall between Great Room & Guest Wing */}
          <line x1="560" y1="40" x2="560" y2="400" stroke="#38BDF8" strokeWidth="3" />
          {/* Primary Bath divider */}
          <line x1="50" y1="180" x2="280" y2="180" stroke="#38BDF8" strokeWidth="2.5" />
          <line x1="160" y1="40" x2="160" y2="180" stroke="#38BDF8" strokeWidth="2" />
          {/* Guest bedrooms divider */}
          <line x1="560" y1="220" x2="750" y2="220" stroke="#38BDF8" strokeWidth="2.5" />

          {/* Room Labels and Dimensions */}
          {/* Primary Suite */}
          <g>
            <text x="165" y="245" fill="#FFFFFF" fontSize="15" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              PRIMARY SUITE
            </text>
            <text x="165" y="265" fill="#94A3B8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              16'-4" × 14'-2"
            </text>
            <text x="165" y="283" fill="#38BDF8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
              Vaulted Ceiling · Private Sound Barrier
            </text>
          </g>

          {/* Primary Ensuite & Walk-In Closet */}
          <g>
            <text x="105" y="105" fill="#E2E8F0" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">
              WALK-IN CLOSET
            </text>
            <text x="105" y="125" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              8'-2" × 9'-0"
            </text>

            <text x="220" y="105" fill="#E2E8F0" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">
              SPA ENSUITE BATH
            </text>
            <text x="220" y="125" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Dual Sinks · Soaking Tub
            </text>
            {/* Tub SVG icon */}
            <rect x="180" y="140" width="80" height="30" rx="10" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="220" y="160" fill="#E0F2FE" fontSize="9" fontFamily="sans-serif" textAnchor="middle">SOAKING TUB</text>
          </g>

          {/* Great Room (Center) */}
          <g>
            <text x="420" y="130" fill="#FFFFFF" fontSize="17" fontFamily="sans-serif" textAnchor="middle" fontWeight="800" letterSpacing="0.05em">
              VAULTED GREAT ROOM
            </text>
            <text x="420" y="152" fill="#94A3B8" fontSize="12" fontFamily="monospace" textAnchor="middle">
              22'-6" × 17'-8"
            </text>
            <text x="420" y="172" fill="#FDE047" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="500">
              Decorative Solid Timber Ceiling Beams
            </text>
          </g>

          {/* Gourmet Island Kitchen */}
          <g>
            <text x="420" y="240" fill="#FFFFFF" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              GOURMET ISLAND KITCHEN
            </text>
            <text x="420" y="260" fill="#94A3B8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              15'-0" × 13'-4"
            </text>

            {/* Kitchen Island Graphic */}
            <rect x="350" y="275" width="140" height="40" rx="3" fill="#0369A1" stroke="#7DD3FC" strokeWidth="2" />
            <text x="420" y="300" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">
              8' QUARTZ ISLAND & BAR
            </text>
            {/* Bar stool marks */}
            <circle cx="370" cy="325" r="4" fill="#38BDF8" />
            <circle cx="405" cy="325" r="4" fill="#38BDF8" />
            <circle cx="440" cy="325" r="4" fill="#38BDF8" />
            <circle cx="475" cy="325" r="4" fill="#38BDF8" />
          </g>

          {/* Guest Bedrooms & Bath Wing (Right) */}
          <g>
            {/* Bedroom 2 */}
            <text x="655" y="115" fill="#E2E8F0" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              BEDROOM 2
            </text>
            <text x="655" y="135" fill="#94A3B8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              12'-8" × 12'-0"
            </text>
            <rect x="680" y="50" width="60" height="25" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
            <text x="710" y="66" fill="#94A3B8" fontSize="9" fontFamily="sans-serif" textAnchor="middle">CLOSET</text>

            {/* Bedroom 3 */}
            <text x="655" y="300" fill="#E2E8F0" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              BEDROOM 3
            </text>
            <text x="655" y="320" fill="#94A3B8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              12'-8" × 11'-6"
            </text>
            <rect x="680" y="365" width="60" height="25" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
            <text x="710" y="381" fill="#94A3B8" fontSize="9" fontFamily="sans-serif" textAnchor="middle">CLOSET</text>

            {/* Guest Bath */}
            <rect x="560" y="185" width="90" height="50" fill="#0B132B" stroke="#38BDF8" strokeWidth="2" />
            <text x="605" y="215" fill="#7DD3FC" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">
              GUEST BATH
            </text>
          </g>

          {/* Door swings */}
          {/* Main Entrance door */}
          <path d="M 220 320 A 45 45 0 0 1 265 275" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="220" y1="320" x2="220" y2="275" stroke="#38BDF8" strokeWidth="2" />
          <text x="215" y="310" fill="#F8FAFC" fontSize="9" fontFamily="sans-serif" textAnchor="end">MAIN ENTRY</text>

          {/* North Arrow */}
          <g transform="translate(80, 75)">
            <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <polygon points="0,-14 6,10 0,6 -6,10" fill="#38BDF8" />
            <text x="0" y="-18" fill="#38BDF8" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">N</text>
          </g>
        </svg>
      </div>

      {/* Blueprint Footer / Engineering Stamp */}
      <div className="relative z-10 flex items-center justify-between border-t border-sky-500/30 pt-2 text-xs">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Square Footage: <strong className="text-white font-mono">{floorplan.squareFeet.toLocaleString()} SQ FT</strong></span>
          <span>·</span>
          <span>Beds/Baths: <strong className="text-white font-mono">{floorplan.bedrooms} Bed / {floorplan.bathrooms} Bath</strong></span>
          <span>·</span>
          <span>Building Code: <strong className="text-emerald-400 font-mono">HUD / IRC Code Certified</strong></span>
        </div>
        <div className="text-[10px] text-sky-400 font-mono tracking-widest uppercase">
          MOUNTAIN VIEW HOMES OF BREMERTON SHOWROOM DRAFT
        </div>
      </div>
    </div>
  );
};
