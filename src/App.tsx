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
import { OnPageTourShowcase } from './components/OnPageTourShowcase';
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
  ArrowUpDown, 
  RotateCcw, 
  ChevronDown,
  MapPin,
  Phone,
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const CURRENT_CATALOG_STORAGE_KEY = 'mvh_bremerton_catalog_2026_v4';

export default function App() {
  // Inventory state: Guaranteed to load all 145 real homes from spreadsheet
  const [floorplans, setFloorplans] = useState<Floorplan[]>(() => {
    try {
      // Clean up any stale legacy keys from earlier prototypes
      localStorage.removeItem('kiosk_floorplans');
      localStorage.removeItem('kiosk_floorplans_v2');
      localStorage.removeItem('kiosk_floorplans_v3');
      localStorage.removeItem('mvh_kiosk_floorplans_v4');

      const saved = localStorage.getItem(CURRENT_CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the saved data has the full spreadsheet inventory
        if (Array.isArray(parsed) && parsed.length >= INITIAL_FLOORPLANS.length && parsed[0]?.id === INITIAL_FLOORPLANS[0]?.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading catalog from localStorage:', e);
    }
    // Default to the full spreadsheet inventory
    return INITIAL_FLOORPLANS;
  });

  // Bookings / Waitlist queue state
  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => {
    const saved = localStorage.getItem('mvh_bremerton_bookings_v2');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Top view mode: 'catalog' | '3d-theater' | 'dealership-info'
  const [activeViewMode, setActiveViewMode] = useState<'catalog' | '3d-theater' | 'dealership-info'>('catalog');

  // Filter State
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('All');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedBeds, setSelectedBeds] = useState<number | 'All'>('All');
  const [tourOnly, setTourOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft-desc' | 'sqft-asc' | 'name-asc'>('featured');

  // Progressive rendering / pagination (18 items per page)
  const [visibleCount, setVisibleCount] = useState<number>(18);

  // Filter list of homes that have 3D virtual tours (69 models)
  const floorplansWithTours = useMemo(() => {
    return floorplans.filter(f => f.hasTour && f.primaryTour);
  }, [floorplans]);

  // Active home displayed in the On-Page 3D Theater
  const [onPageTourPlan, setOnPageTourPlan] = useState<Floorplan>(() => {
    return floorplans.find(f => f.hasTour && f.id === 'gw-dream-silver-casita') || floorplans.find(f => f.hasTour) || floorplans[0];
  });

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
      // Only show screensaver if no active modal is currently in use
      if (!activeTourPlan && !activeDetailPlan && !activePrintPlan && !isAppointmentModalOpen && !isStaffModalOpen) {
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
  }, [activeTourPlan, activeDetailPlan, activePrintPlan, isAppointmentModalOpen, isStaffModalOpen]);

  // Persist floorplans & bookings to localStorage
  useEffect(() => {
    localStorage.setItem(CURRENT_CATALOG_STORAGE_KEY, JSON.stringify(floorplans));
  }, [floorplans]);

  useEffect(() => {
    localStorage.setItem('mvh_bremerton_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(18);
  }, [selectedManufacturer, selectedSeries, selectedSection, selectedBeds, tourOnly, searchQuery, sortBy]);

  // Counts for badges
  const stats = useMemo(() => {
    const total = floorplans.length;
    const goldenWestCount = floorplans.filter(f => f.manufacturer === 'Golden West').length;
    const marletteCount = floorplans.filter(f => f.manufacturer === 'Marlette').length;
    const claytonCount = floorplans.filter(f => f.manufacturer === 'Clayton Homes').length;
    const toursCount = floorplansWithTours.length;
    return { total, goldenWestCount, marletteCount, claytonCount, toursCount };
  }, [floorplans, floorplansWithTours]);

  // Available Series based on manufacturer
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
        if (matchedPlan.hasTour) {
          setOnPageTourPlan(matchedPlan);
          setActiveViewMode('3d-theater');
          setActiveTourPlan(matchedPlan);
        } else {
          setActiveDetailPlan(matchedPlan);
        }
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
        break;
    }
  };

  // Filtered & Sorted Floorplans
  const filteredAndSortedFloorplans = useMemo(() => {
    const list = floorplans.filter(plan => {
      if (selectedManufacturer !== 'All' && plan.manufacturer !== selectedManufacturer) return false;
      if (selectedSeries !== 'All' && plan.series !== selectedSeries) return false;
      
      if (selectedSection !== 'All') {
        if (selectedSection === 'Single' && plan.sections !== 'Single') return false;
        if (selectedSection === 'Double' && plan.sections !== 'Double') return false;
        if (selectedSection === 'Triple' && plan.sections !== 'Triple') return false;
      }

      if (selectedBeds !== 'All' && plan.bedrooms < (selectedBeds as number)) return false;
      if (tourOnly && !plan.hasTour) return false;

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
          if (a.hasTour !== b.hasTour) return a.hasTour ? -1 : 1;
          return b.squareFeet - a.squareFeet;
      }
    });

    return list;
  }, [floorplans, selectedManufacturer, selectedSeries, selectedSection, selectedBeds, tourOnly, searchQuery, sortBy]);

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

      {/* Top Bar with Seal Logo & Primary Actions */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 no-print">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
          
          {/* Brand Wordmark with Official Seal */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                setActiveViewMode('catalog');
                resetAllFilters();
              }}
              className="flex items-center gap-2.5 text-slate-900 whitespace-nowrap shrink-0 text-left cursor-pointer"
            >
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
            </button>
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Kiosk #1 · 145 Models
            </span>
          </div>

          {/* Clean Navigation Links with 3D Tour Theater */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => {
                setActiveViewMode('catalog');
                setTourOnly(false);
              }}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeViewMode === 'catalog' && !tourOnly ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
              }`}
            >
              Floorplans Catalog ({stats.total})
            </button>
            
            <button 
              onClick={() => {
                setActiveViewMode('3d-theater');
                setTourOnly(true);
              }}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg ${
                activeViewMode === '3d-theater' || tourOnly 
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' 
                  : 'hover:text-slate-900 text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>3D Virtual Tours ({stats.toursCount})</span>
            </button>

            <button 
              onClick={() => setActiveViewMode('dealership-info')}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'dealership-info' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Showroom Info</span>
            </button>

            <button 
              onClick={() => setIsStaffModalOpen(true)}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-500 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Staff Desk</span>
            </button>
          </nav>

          {/* Join Showroom Waitlist */}
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
                Explore {stats.total} factory-built homes from Golden West, Marlette, and Clayton Homes. Step inside {stats.toursCount} interactive 3D virtual tours right on this kiosk screen, customize finishes, and print take-home specification sheets.
              </p>
            </div>

            {/* Live Showroom Queue & Wait Time Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shrink-0 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Current Wait Time</div>
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

        {/* Dealership Info Panel (when activeViewMode === 'dealership-info') */}
        {activeViewMode === 'dealership-info' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/mvhBremertonCap_8f5d5a13.png" 
                  alt="Mountain View Homes" 
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Mountain View Homes of Bremerton</h2>
                  <p className="text-xs text-slate-500">Kitsap County's Premier Factory-Built Home Center</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveViewMode('catalog')}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Back to Floorplans
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Bremerton Sales Center</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3472 West Belfair Valley Road<br />
                  Bremerton, WA 98312
                </p>
                <div className="pt-2">
                  <a 
                    href="tel:3609798430" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>(360) 979-8430</span>
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Showroom Display Hours</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Monday – Saturday:</strong> 10:00 AM – 4:00 PM</div>
                  <div><strong>Sunday:</strong> 11:00 AM – 3:00 PM</div>
                  <div className="text-slate-400 text-[11px] pt-1">Lot walk-ins always welcome</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>Factory Builders</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Proudly featuring <strong>Clayton Built</strong>, <strong>Golden West</strong>, and <strong>Marlette Homes</strong>. Built with Pacific Northwest energy efficiency and engineered for Kitsap and Olympic Peninsula land.
                </p>
                <div className="pt-1 flex gap-3 text-xs text-slate-500 font-semibold">
                  <a href="https://www.mtviewhomes.com" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1">
                    <span>mtviewhomes.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ON-PAGE INTERACTIVE 3D TOUR THEATER */}
        {/* Shows whenever 3D theater view is active OR as the centerpiece above the catalog */}
        {(activeViewMode === '3d-theater' || tourOnly) && (
          <OnPageTourShowcase
            floorplansWithTours={floorplansWithTours}
            activeTourPlan={onPageTourPlan}
            onSelectTourPlan={(plan) => setOnPageTourPlan(plan)}
            onOpenFullscreen={(plan) => setActiveTourPlan(plan)}
            onPrint={(plan) => setActivePrintPlan({ floorplan: plan, totalPrice: plan.basePrice })}
            onCustomize={(plan) => setActiveDetailPlan(plan)}
            onBookAppointment={(plan) => {
              setAppointmentSelectedPlan(plan);
              setIsAppointmentModalOpen(true);
            }}
          />
        )}

        {/* Comprehensive Showroom Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
          
          {/* Row 1: Manufacturer Tabs + 3D Tour Toggle */}
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
              onClick={() => {
                const nextTourOnly = !tourOnly;
                setTourOnly(nextTourOnly);
                if (nextTourOnly) {
                  setActiveViewMode('3d-theater');
                }
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                tourOnly
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/30'
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
                placeholder="Search models, Casita, ADU, Tempo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
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
                    if (fp.hasTour) {
                      setOnPageTourPlan(fp);
                      setActiveTourPlan(fp);
                    } else {
                      setActiveDetailPlan(fp);
                    }
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

      {/* Kiosk Bottom Dealership Footer */}
      <footer className="border-t border-slate-200/90 bg-white py-5 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">Mountain View Homes of Bremerton</span>
            <span>·</span>
            <span>3472 West Belfair Valley Rd, Bremerton, WA 98312</span>
            <span>·</span>
            <span className="font-semibold text-emerald-800">(360) 979-8430</span>
            <span>·</span>
            <span>HUD Certified & State Modular IRC Construction</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem(CURRENT_CATALOG_STORAGE_KEY);
                setFloorplans(INITIAL_FLOORPLANS);
                resetAllFilters();
              }}
              className="text-slate-400 hover:text-slate-700 text-[11px] underline cursor-pointer"
              title="Reload catalog from factory spreadsheet"
            >
              Refresh 145 Catalog
            </button>
            <span>·</span>
            <button
              onClick={() => setIsScreensaverActive(true)}
              className="hover:text-slate-800 text-[11px] underline cursor-pointer"
            >
              Screensaver
            </button>
            <span>·</span>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="hover:text-slate-800 text-[11px] font-semibold text-slate-700 cursor-pointer"
            >
              Staff Desk
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
            if (fp.hasTour) {
              setOnPageTourPlan(fp);
              setActiveTourPlan(fp);
            }
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
