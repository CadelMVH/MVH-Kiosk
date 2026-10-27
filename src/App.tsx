/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Floorplan, SelectedOptions, AppointmentBooking, AiQueryResult } from './types';
import { INITIAL_FLOORPLANS, INITIAL_BOOKINGS } from './data/floorplans';
import { VoiceAssistantBar } from './components/VoiceAssistantBar';
import { FloorplanCard } from './components/FloorplanCard';
import { VirtualTourModal } from './components/VirtualTourModal';
import { FloorplanDetailModal } from './components/FloorplanDetailModal';
import { PrintableSpecSheet } from './components/PrintableSpecSheet';
import { AppointmentWaitlistModal } from './components/AppointmentWaitlistModal';
import { StaffManagerModal } from './components/StaffManagerModal';
import { AttractorScreensaver } from './components/AttractorScreensaver';
import { 
  Building2, 
  Clock, 
  Eye, 
  Filter, 
  Home, 
  Printer, 
  Search, 
  Sliders, 
  Sparkles, 
  Ticket, 
  Layers,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export default function App() {
  // Inventory state initialized with all 145 spreadsheet models
  const [floorplans, setFloorplans] = useState<Floorplan[]>(() => {
    const saved = localStorage.getItem('kiosk_floorplans');
    return saved ? JSON.parse(saved) : INITIAL_FLOORPLANS;
  });

  // Bookings / Waitlist queue state
  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => {
    const saved = localStorage.getItem('kiosk_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Comprehensive Filter State
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('All');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedBeds, setSelectedBeds] = useState<number | 'All'>('All');
  const [tourOnly, setTourOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft-desc' | 'sqft-asc' | 'name-asc'>('featured');

  // Progressive rendering / pagination (18 items per page for silky touchscreen speed)
  const [visibleCount, setVisibleCount] = useState<number>(18);

  // Active Modals
  const [activeTourPlan, setActiveTourPlan] = useState<Floorplan | null>(null);
  const [activeDetailPlan, setActiveDetailPlan] = useState<Floorplan | null>(null);
  const [activePrintPlan, setActivePrintPlan] = useState<{
    floorplan: Floorplan;
    options?: SelectedOptions;
    totalPrice?: number;
  } | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentSelectedPlan, setAppointmentSelectedPlan] = useState<Floorplan | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Inactivity screensaver state (2 minutes)
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      // Only show screensaver if no active 3D tour or detail modal is currently in use
      if (!activeTourPlan && !activeDetailPlan && !activePrintPlan && !isAppointmentModalOpen) {
        setIsScreensaverActive(true);
      }
    }, 120000); // 2 minutes
  };

  useEffect(() => {
    const onUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousedown', onUserActivity);
    window.addEventListener('touchstart', onUserActivity);
    window.addEventListener('keydown', onUserActivity);
    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousedown', onUserActivity);
      window.removeEventListener('touchstart', onUserActivity);
      window.removeEventListener('keydown', onUserActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [activeTourPlan, activeDetailPlan, activePrintPlan, isAppointmentModalOpen]);

  // Persist bookings & floorplans to localStorage
  useEffect(() => {
    localStorage.setItem('kiosk_floorplans', JSON.stringify(floorplans));
  }, [floorplans]);

  useEffect(() => {
    localStorage.setItem('kiosk_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Reset pagination whenever any filter or search changes
  useEffect(() => {
    setVisibleCount(18);
  }, [selectedManufacturer, selectedSeries, selectedSection, selectedBeds, tourOnly, searchQuery, sortBy]);

  // Calculate distinct counts for badges
  const stats = useMemo(() => {
    const total = floorplans.length;
    const goldenWestCount = floorplans.filter(f => f.manufacturer === 'Golden West').length;
    const marletteCount = floorplans.filter(f => f.manufacturer === 'Marlette').length;
    const claytonCount = floorplans.filter(f => f.manufacturer === 'Clayton Homes').length;
    const toursCount = floorplans.filter(f => f.hasTour).length;
    return { total, goldenWestCount, marletteCount, claytonCount, toursCount };
  }, [floorplans]);

  // Available Series options based on selected manufacturer
  const availableSeries = useMemo(() => {
    let pool = floorplans;
    if (selectedManufacturer !== 'All') {
      pool = floorplans.filter(f => f.manufacturer === selectedManufacturer);
    }
    const seriesSet = new Set<string>();
    pool.forEach(p => {
      if (p.series) seriesSet.add(p.series);
    });
    return Array.from(seriesSet).sort();
  }, [floorplans, selectedManufacturer]);

  // Handle AI Actions from Voice Assistant
  const handleAiAction = (result: AiQueryResult) => {
    resetInactivityTimer();

    // 1. Filter updates
    if (result.extractedFilters) {
      if (result.extractedFilters.manufacturer) {
        setSelectedManufacturer(result.extractedFilters.manufacturer);
      }
      if (result.extractedFilters.series) {
        setSelectedSeries(result.extractedFilters.series);
      }
      if (result.extractedFilters.minBeds) {
        setSelectedBeds(result.extractedFilters.minBeds);
      }
      if (result.extractedFilters.hasTour !== undefined) {
        setTourOnly(result.extractedFilters.hasTour);
      }
    }

    const matchedPlan = floorplans.find(f => f.id === result.matchedFloorplanId) || floorplans[0];

    // 2. Direct Actions
    switch (result.action) {
      case 'open_3d_tour':
        setActiveDetailPlan(null);
        setActiveTourPlan(matchedPlan);
        break;
      case 'open_floorplan':
        setActiveTourPlan(null);
        setActiveDetailPlan(matchedPlan);
        break;
      case 'print_spec':
        setActivePrintPlan({ floorplan: matchedPlan, totalPrice: matchedPlan.basePrice });
        break;
      case 'schedule_appointment':
        setAppointmentSelectedPlan(matchedPlan);
        setIsAppointmentModalOpen(true);
        break;
      default:
        // default filter_catalog
        break;
    }
  };

  // Filtered & Sorted Floorplans
  const filteredAndSortedFloorplans = useMemo(() => {
    const list = floorplans.filter(plan => {
      // Manufacturer filter
      if (selectedManufacturer !== 'All' && plan.manufacturer !== selectedManufacturer) return false;
      
      // Series filter
      if (selectedSeries !== 'All' && plan.series !== selectedSeries) return false;
      
      // Section / Width filter
      if (selectedSection !== 'All') {
        if (selectedSection === 'Single' && plan.sections !== 'Single') return false;
        if (selectedSection === 'Double' && plan.sections !== 'Double') return false;
        if (selectedSection === 'Triple' && plan.sections !== 'Triple') return false;
      }

      // Bedrooms filter
      if (selectedBeds !== 'All' && plan.bedrooms < (selectedBeds as number)) return false;

      // 3D Tour Only filter
      if (tourOnly && !plan.hasTour) return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = plan.name.toLowerCase().includes(q);
        const matchDesc = plan.description.toLowerCase().includes(q);
        const matchSeries = plan.series.toLowerCase().includes(q);
        const matchManu = plan.manufacturer?.toLowerCase().includes(q) || false;
        const matchModel = plan.modelNumber?.toLowerCase().includes(q) || false;
        const matchFeat = plan.keyFeatures.some(f => f.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchSeries && !matchManu && !matchModel && !matchFeat) return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'sqft-desc':
          return b.squareFeet - a.squareFeet;
        case 'sqft-asc':
          return a.squareFeet - b.squareFeet;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          // Homes with real 3D tours first, then larger square feet
          if (a.hasTour !== b.hasTour) return a.hasTour ? -1 : 1;
          return b.squareFeet - a.squareFeet;
      }
    });

    return list;
  }, [floorplans, selectedManufacturer, selectedSeries, selectedSection, selectedBeds, tourOnly, searchQuery, sortBy]);

  // Current slice for progressive rendering
  const displayedFloorplans = filteredAndSortedFloorplans.slice(0, visibleCount);

  const activeQueueCount = bookings.filter(b => b.type === 'live_waitlist' && b.status === 'waiting').length;

  const resetAllFilters = () => {
    setSelectedManufacturer('All');
    setSelectedSeries('All');
    setSelectedSection('All');
    setSelectedBeds('All');
    setTourOnly(false);
    setSearchQuery('');
    setSortBy('featured');
    setVisibleCount(18);
  };

  const hasActiveFilters = 
    selectedManufacturer !== 'All' || 
    selectedSeries !== 'All' || 
    selectedSection !== 'All' || 
    selectedBeds !== 'All' || 
    tourOnly || 
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-slate-900 font-sans flex flex-col justify-between selection:bg-amber-100">
      
      {/* Kiosk Attractor Screensaver */}
      {isScreensaverActive && (
        <AttractorScreensaver 
          onDismiss={() => {
            setIsScreensaverActive(false);
            resetInactivityTimer();
          }} 
        />
      )}

      {/* Top Bar Contract (1-line Brand, Clean links, 1 primary action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 no-print">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Text Element Wordmark with Official Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="flex items-center gap-2.5 text-slate-900 whitespace-nowrap shrink-0">
              <img 
                src="/assets/aistudio/mvhBremertonCap_8f5d5a13.png" 
                alt="Mountain View Homes of Bremerton Logo"
                className="w-11 h-11 object-contain drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                  Mountain View Homes
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 tracking-wider uppercase font-serif">
                  of Bremerton
                </span>
              </div>
            </a>
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Kiosk Terminal #1 · 145 Models
            </span>
          </div>

          {/* Zone 2: 4 Clean Single-Line Text Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={resetAllFilters}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Floorplans Catalog
            </button>
            <button 
              onClick={() => {
                setTourOnly(true);
                const firstWithTour = floorplans.find(f => f.hasTour) || floorplans[0];
                setActiveTourPlan(firstWithTour);
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>3D Virtual Tours ({stats.toursCount})</span>
            </button>
            <button 
              onClick={() => {
                setAppointmentSelectedPlan(null);
                setIsAppointmentModalOpen(true);
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sales Appointments
            </button>
            <button 
              onClick={() => setIsStaffModalOpen(true)}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-500 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Staff Desk</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setAppointmentSelectedPlan(null);
                setIsAppointmentModalOpen(true);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Join Showroom Waitlist</span>
              {activeQueueCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-mono">
                  {activeQueueCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6 no-print">
        
        {/* Dealership Showroom Banner & Live Status Strip */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-slate-900 text-white">
          <div className="absolute inset-0 opacity-35">
            <img 
              src="/src/assets/images/hero_dealership_showroom_1793126179418.jpg" 
              alt="Mountain View Homes of Bremerton Display Park"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />

          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mountain View Homes of Bremerton · Display Center</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Pacific Northwest Manufactured & Modular Living
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Explore {stats.total} factory-built homes engineered for Kitsap County, Mason County, and the Olympic Peninsula. Step inside {stats.toursCount} interactive 3D virtual tours, customize finishes, and print take-home specification sheets.
              </p>
            </div>

            {/* Live Showroom Queue & Wait Time Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shrink-0 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Current Floor Wait Time</div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>~{Math.max(5, (activeQueueCount + 1) * 8)} Minutes</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {activeQueueCount} guest{activeQueueCount === 1 ? '' : 's'} waiting · Sales desk active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Voice Assistant Bar */}
        <VoiceAssistantBar onAiAction={handleAiAction} />

        {/* Comprehensive Showroom Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
          
          {/* Row 1: Manufacturer Tabs + 3D Tour Toggle + Section Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Manufacturer Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
              {[
                { id: 'All', label: 'All Builders', count: stats.total },
                { id: 'Golden West', label: 'Golden West', count: stats.goldenWestCount },
                { id: 'Marlette', label: 'Marlette', count: stats.marletteCount },
                { id: 'Clayton Homes', label: 'Clayton Homes', count: stats.claytonCount },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedManufacturer(m.id);
                    setSelectedSeries('All');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedManufacturer === m.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    selectedManufacturer === m.id ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/60 text-slate-500'
                  }`}>
                    {m.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick 3D Virtual Tour Filter Button */}
            <button
              onClick={() => setTourOnly(!tourOnly)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                tourOnly
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Eye className={`w-4 h-4 ${tourOnly ? 'text-white' : 'text-emerald-600'}`} />
              <span>3D Virtual Tours Only</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                tourOnly ? 'bg-white text-emerald-800' : 'bg-emerald-200/70 text-emerald-900'
              }`}>
                {stats.toursCount}
              </span>
            </button>

          </div>

          {/* Row 2: Layout Type, Series, Bedrooms, Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            
            {/* Section Width Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-500 shrink-0">Width:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full">
                {[
                  { id: 'All', label: 'All' },
                  { id: 'Single', label: 'Single' },
                  { id: 'Double', label: 'Double' },
                  { id: 'Triple', label: 'Triple' },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSection(sec.id)}
                    className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedSection === sec.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-500 shrink-0">Beds:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full">
                {[
                  { id: 'All', label: 'Any' },
                  { id: 1, label: '1 Bed' },
                  { id: 2, label: '2 Beds' },
                  { id: 3, label: '3 Beds' },
                  { id: 4, label: '4+ Beds' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBeds(b.id as any)}
                    className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedBeds === b.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Series Dropdown */}
            <div className="relative">
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none font-medium cursor-pointer"
              >
                <option value="All">All Series ({availableSeries.length})</option>
                {availableSeries.map(s => (
                  <option key={s} value={s}>{s} Series</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models, features, ADU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          {/* Active Filter Summary Strip */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                Showing <strong>{Math.min(visibleCount, filteredAndSortedFloorplans.length)}</strong> of <strong>{filteredAndSortedFloorplans.length}</strong> floorplans
              </span>
              {selectedManufacturer !== 'All' && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedManufacturer}
                  </span>
                </>
              )}
              {selectedSeries !== 'All' && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedSeries}
                  </span>
                </>
              )}
              {selectedSection !== 'All' && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedSection}-Wide
                  </span>
                </>
              )}
              {tourOnly && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    3D Tours Only
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured (3D Tours First)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="sqft-desc">Sq Ft: Largest First</option>
                  <option value="sqft-asc">Sq Ft: Smallest First</option>
                  <option value="name-asc">Model Name (A-Z)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Floorplan Cards Grid */}
        {filteredAndSortedFloorplans.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Home className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching floorplans found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your builder, bedroom, or size filter, or speak to the voice assistant to find alternative models.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800"
            >
              Reset Filters & View All 145 Models
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedFloorplans.map((floorplan) => (
                <FloorplanCard
                  key={floorplan.id}
                  floorplan={floorplan}
                  onSelect={(fp) => {
                    setActiveDetailPlan(fp);
                    resetInactivityTimer();
                  }}
                  onOpenTour={(fp) => {
                    setActiveTourPlan(fp);
                    resetInactivityTimer();
                  }}
                  onPrint={(fp) => {
                    setActivePrintPlan({ floorplan: fp, totalPrice: fp.basePrice });
                    resetInactivityTimer();
                  }}
                />
              ))}
            </div>

            {/* Progressive Loading Controls */}
            {visibleCount < filteredAndSortedFloorplans.length && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="text-xs text-slate-500 font-medium">
                  Showing {visibleCount} of {filteredAndSortedFloorplans.length} homes
                </div>
                
                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 rounded-full transition-all duration-300"
                    style={{ width: `${(visibleCount / filteredAndSortedFloorplans.length) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 18)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Load 18 More Models ({filteredAndSortedFloorplans.length - visibleCount} remaining)
                  </button>
                  <button
                    onClick={() => setVisibleCount(filteredAndSortedFloorplans.length)}
                    className="px-4 py-3 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Show All {filteredAndSortedFloorplans.length}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Kiosk Bottom Utility Footer */}
      <footer className="border-t border-slate-200/90 bg-white py-4 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800">Mountain View Homes of Bremerton</span>
            <span>·</span>
            <span>Serving Kitsap County, Olympic Peninsula & Puget Sound</span>
            <span>·</span>
            <span>HUD Certified & State Modular IRC Construction</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsScreensaverActive(true)}
              className="hover:text-slate-800 text-[11px] underline cursor-pointer"
            >
              Launch Screensaver
            </button>
            <span>·</span>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="hover:text-slate-800 text-[11px] font-semibold text-slate-700 cursor-pointer"
            >
              Staff Admin Desk
            </button>
          </div>
        </div>
      </footer>

      {/* 3D Virtual Tour Walkthrough Modal */}
      {activeTourPlan && (
        <VirtualTourModal
          floorplan={activeTourPlan}
          onClose={() => setActiveTourPlan(null)}
          onOpenCustomizer={(fp) => {
            setActiveTourPlan(null);
            setActiveDetailPlan(fp);
          }}
          onPrint={(fp) => {
            setActivePrintPlan({ floorplan: fp, totalPrice: fp.basePrice });
          }}
          onBookAppointment={(fp) => {
            setActiveTourPlan(null);
            setAppointmentSelectedPlan(fp);
            setIsAppointmentModalOpen(true);
          }}
        />
      )}

      {/* Floorplan Detail & Customizer Modal */}
      {activeDetailPlan && (
        <FloorplanDetailModal
          floorplan={activeDetailPlan}
          onClose={() => setActiveDetailPlan(null)}
          onOpenTour={(fp) => {
            setActiveDetailPlan(null);
            setActiveTourPlan(fp);
          }}
          onPrint={(fp, options, calculatedPrice) => {
            setActivePrintPlan({
              floorplan: fp,
              options,
              totalPrice: calculatedPrice
            });
          }}
          onBookAppointment={(fp) => {
            setActiveDetailPlan(null);
            setAppointmentSelectedPlan(fp);
            setIsAppointmentModalOpen(true);
          }}
        />
      )}

      {/* Dedicated Print Spec Sheet Modal & Print-Only Component */}
      {activePrintPlan && (
        <PrintableSpecSheet
          floorplan={activePrintPlan.floorplan}
          selectedOptions={activePrintPlan.options}
          totalPrice={activePrintPlan.totalPrice}
          onClose={() => setActivePrintPlan(null)}
        />
      )}

      {/* Showroom Waitlist & Appointment Booking Modal */}
      {isAppointmentModalOpen && (
        <AppointmentWaitlistModal
          floorplan={appointmentSelectedPlan}
          onClose={() => setIsAppointmentModalOpen(false)}
          currentQueueLength={activeQueueCount}
          onBookingConfirmed={(booking) => {
            setBookings(prev => [booking, ...prev]);
          }}
        />
      )}

      {/* Staff Management Desk Modal */}
      {isStaffModalOpen && (
        <StaffManagerModal
          bookings={bookings}
          floorplans={floorplans}
          onClose={() => setIsStaffModalOpen(false)}
          onUpdateBookingStatus={(id, status) => {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
          }}
          onUpdateFloorplanPrice={(id, newPrice) => {
            setFloorplans(prev => prev.map(fp => fp.id === id ? { ...fp, basePrice: newPrice } : fp));
          }}
        />
      )}

    </div>
  );
}
