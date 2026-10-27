import React, { useState } from 'react';
import { Floorplan, SelectedOptions } from '../types';
import { FloorplanBlueprint } from './FloorplanBlueprint';
import { FACTORY_UPGRADE_PACKAGES, DECOR_MATRIX } from '../data/factoryOptions';
import { 
  X, 
  Eye, 
  Printer, 
  Calendar, 
  Check, 
  DollarSign, 
  Home, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Info,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  Zap,
  Droplets,
  Palette
} from 'lucide-react';

interface FloorplanDetailModalProps {
  floorplan: Floorplan;
  onClose: () => void;
  onOpenTour: (floorplan: Floorplan) => void;
  onPrint: (floorplan: Floorplan, options: SelectedOptions, calculatedPrice: number) => void;
  onBookAppointment: (floorplan: Floorplan) => void;
}

export const FloorplanDetailModal: React.FC<FloorplanDetailModalProps> = ({
  floorplan,
  onClose,
  onOpenTour,
  onPrint,
  onBookAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'customizer' | 'gallery' | 'blueprint' | 'specs'>('customizer');
  const [customizerSection, setCustomizerSection] = useState<'cabinets' | 'kitchen' | 'bath' | 'flooring' | 'exterior' | 'energy'>('cabinets');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  const photos = floorplan.photos && floorplan.photos.length > 0 
    ? floorplan.photos 
    : [floorplan.exteriorImageUrl];

  // Selected customization state grounded in 2026 Option Pages & Décor Matrix
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    // Packages
    exteriorPackageId: 'ext-std',
    appliancePackageId: 'app-std',
    bathroomPackageId: 'bath-std',
    interiorPackageId: 'int-std',
    fireplacePackageId: 'fp-none',
    energyPackageId: 'nrg-std',
    doorPackageId: 'door-std',
    // Décor Matrix
    cabinetFinish: 'White Shaker',
    cabinetHardware: 'Brushed Nickel Round Knob',
    countertopType: 'Sierra Cascade (Laminate)',
    flooringType: 'LX 311 - Aged European Oak',
    carpetType: 'Cape Cod 25 oz. - Canyon Cove',
    interiorPaint: 'SW 7551 - Greek Villa (Flat)',
    exteriorPaint: 'SW 7005 - Pure White',
    roofingType: 'GAF Timberline HDZ - Charcoal',
  });

  // Calculate package pricing
  const currentExterior = FACTORY_UPGRADE_PACKAGES.exteriorPackages.find(p => p.id === selectedOptions.exteriorPackageId);
  const currentAppliance = FACTORY_UPGRADE_PACKAGES.appliancePackages.find(p => p.id === selectedOptions.appliancePackageId);
  const currentBath = FACTORY_UPGRADE_PACKAGES.bathroomPackages.find(p => p.id === selectedOptions.bathroomPackageId);
  const currentInterior = FACTORY_UPGRADE_PACKAGES.interiorTreatmentPackages.find(p => p.id === selectedOptions.interiorPackageId);
  const currentFireplace = FACTORY_UPGRADE_PACKAGES.fireplaces.find(p => p.id === selectedOptions.fireplacePackageId);
  const currentEnergy = FACTORY_UPGRADE_PACKAGES.energyAndUtilities.find(p => p.id === selectedOptions.energyPackageId);
  const currentDoor = FACTORY_UPGRADE_PACKAGES.entryDoors.find(p => p.id === selectedOptions.doorPackageId);

  // Décor item pricing (Quartz, premium carpets, metal roofing)
  const currentCountertop = DECOR_MATRIX.countertops.find(c => c.name === selectedOptions.countertopType);
  const currentCarpet = DECOR_MATRIX.carpetShaw.find(c => c.name === selectedOptions.carpetType);
  const currentRoof = DECOR_MATRIX.roofing.find(r => r.name === selectedOptions.roofingType);
  const currentHardware = DECOR_MATRIX.cabinetHardware.find(h => h.name === selectedOptions.cabinetHardware);

  const optionsTotal = 
    (currentExterior?.price || 0) +
    (currentAppliance?.price || 0) +
    (currentBath?.price || 0) +
    (currentInterior?.price || 0) +
    (currentFireplace?.price || 0) +
    (currentEnergy?.price || 0) +
    (currentDoor?.price || 0) +
    (currentCountertop?.price || 0) +
    (currentCarpet?.price || 0) +
    (currentRoof?.price || 0) +
    (currentHardware?.price || 0);

  const configuredTotalPrice = floorplan.basePrice + optionsTotal;
  // 30-year fixed, 10% down, 7.25% APR (~0.0068218 monthly factor)
  const configuredMonthly = Math.round((configuredTotalPrice * 0.9) * 0.0068218);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in select-none">
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-4">
            <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
              <img 
                src={floorplan.exteriorImageUrl} 
                alt={floorplan.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{floorplan.name}</h2>
                {floorplan.manufacturer && (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-semibold">
                    {floorplan.manufacturer}
                  </span>
                )}
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-medium">
                  {floorplan.series}
                </span>
                {floorplan.hasTour && (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>3D Tour Available</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{floorplan.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Customizer, Photos, Blueprint, Specs) */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-200 bg-white overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customizer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'customizer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>2026 Options & Décor Customizer</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'gallery'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>Photo Gallery ({photos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'blueprint'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Architectural Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'specs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Factory Specifications</span>
            </button>
          </div>

          {floorplan.floorplanPdf && (
            <a
              href={floorplan.floorplanPdf}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Factory PDF</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>

        {/* Modal Main Body Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* TAB 1: 2026 OPTIONS & DÉCOR CUSTOMIZER */}
          {activeTab === 'customizer' && (
            <div className="p-6 space-y-6">
              
              {/* Customizer Sub-category Tabs */}
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 overflow-x-auto scrollbar-none">
                {[
                  { id: 'cabinets', label: 'Cabinets & Hardware', icon: Sparkles },
                  { id: 'kitchen', label: 'Kitchen & Appliances', icon: Droplets },
                  { id: 'bath', label: 'Bathrooms & Spa', icon: Layers },
                  { id: 'flooring', label: 'Flooring & Paint', icon: Palette },
                  { id: 'exterior', label: 'Exterior & Roof', icon: Home },
                  { id: 'energy', label: 'Energy & Climate', icon: Zap },
                ].map(sub => {
                  const Icon = sub.icon;
                  const isActive = customizerSection === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setCustomizerSection(sub.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-section 1: Cabinets & Hardware */}
              {customizerSection === 'cabinets' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Hardwood Cabinet Finishes (Décor Matrix)</h3>
                    <p className="text-xs text-slate-500 mb-3">Genuine factory-finished hardwood cabinets built with kiln-dried solid lumber.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {DECOR_MATRIX.hardwoodCabinets.map(cab => {
                        const isSelected = selectedOptions.cabinetFinish === cab.name;
                        return (
                          <button
                            key={cab.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, cabinetFinish: cab.name }))}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div 
                              className="w-full h-12 rounded-xl mb-2 border border-black/10 shadow-inner" 
                              style={{ backgroundColor: cab.swatch }}
                            />
                            <div className="font-bold text-xs text-slate-900 truncate">{cab.name}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{cab.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Cabinet Hardware Pulls</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {DECOR_MATRIX.cabinetHardware.map(hw => {
                        const isSelected = selectedOptions.cabinetHardware === hw.name;
                        return (
                          <button
                            key={hw.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, cabinetHardware: hw.name }))}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{hw.name}</div>
                              <div className="text-[11px] text-slate-500">{hw.finish}</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-emerald-800">
                                {hw.price === 0 ? 'Included' : `+$${hw.price}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-section 2: Kitchen & Appliances */}
              {customizerSection === 'kitchen' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Factory Appliance Packages (2026 Options)</h3>
                    <p className="text-xs text-slate-500 mb-3">Stainless steel Samsung & Frigidaire suites installed at the factory with full warranties.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {FACTORY_UPGRADE_PACKAGES.appliancePackages.map(pkg => {
                        const isSelected = selectedOptions.appliancePackageId === pkg.id;
                        return (
                          <button
                            key={pkg.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, appliancePackageId: pkg.id }))}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-slate-900">{pkg.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  {pkg.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-3">{pkg.description}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Upgrade Price</span>
                              <span className="font-mono font-bold text-sm text-emerald-800">
                                {pkg.price === 0 ? 'Included in Base' : `+$${pkg.price.toLocaleString()}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Countertops & Surfaces (Décor Matrix)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {DECOR_MATRIX.countertops.map(ct => {
                        const isSelected = selectedOptions.countertopType === ct.name;
                        return (
                          <button
                            key={ct.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, countertopType: ct.name }))}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400">{ct.type}</span>
                              <div className="font-bold text-xs text-slate-900 mt-0.5">{ct.name}</div>
                              <p className="text-[11px] text-slate-500 mt-1">{ct.desc}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 font-mono text-xs font-bold text-emerald-800">
                              {ct.price === 0 ? 'Standard' : `+$${ct.price.toLocaleString()}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-section 3: Bathrooms & Spa */}
              {customizerSection === 'bath' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Glamour Master Bath & Shower Suites</h3>
                  <p className="text-xs text-slate-500">Upgrade to deep soaking garden tubs, freestanding tubs, or hand-laid ceramic tile showers.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FACTORY_UPGRADE_PACKAGES.bathroomPackages.map(bp => {
                      const isSelected = selectedOptions.bathroomPackageId === bp.id;
                      return (
                        <button
                          key={bp.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, bathroomPackageId: bp.id }))}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-900">{bp.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {bp.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">{bp.description}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">Upgrade Price</span>
                            <span className="font-mono font-bold text-sm text-emerald-800">
                              {bp.price === 0 ? 'Standard Tub/Shower' : `+$${bp.price.toLocaleString()}`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-section 4: Flooring & Paint */}
              {customizerSection === 'flooring' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">LUX Luxury Vinyl Plank Flooring</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {DECOR_MATRIX.vinylFlooringLux.map(vnl => {
                        const isSelected = selectedOptions.flooringType === vnl.name;
                        return (
                          <button
                            key={vnl.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, flooringType: vnl.name }))}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-slate-400 uppercase">{vnl.tone}</span>
                            <div className="font-bold text-xs text-slate-900 mt-1">{vnl.name}</div>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{vnl.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Shaw Carpet & High-Density Rebond Pad</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {DECOR_MATRIX.carpetShaw.map(cpt => {
                        const isSelected = selectedOptions.carpetType === cpt.name;
                        return (
                          <button
                            key={cpt.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, carpetType: cpt.name }))}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{cpt.name}</div>
                              <div className="text-[11px] text-slate-500">{cpt.spec}</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-emerald-800">
                                {cpt.price === 0 ? 'Included' : `+$${cpt.price}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Sherwin-Williams Interior Paint</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {DECOR_MATRIX.interiorPaintSW.map(pt => {
                        const isSelected = selectedOptions.interiorPaint === pt.name;
                        return (
                          <button
                            key={pt.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, interiorPaint: pt.name }))}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div 
                              className="w-10 h-10 rounded-xl border border-black/10 shrink-0" 
                              style={{ backgroundColor: pt.swatch }}
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-900">{pt.name}</div>
                              <div className="text-[10px] text-slate-500">{pt.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Fireplace & Feature Wall (2026 Options)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {FACTORY_UPGRADE_PACKAGES.fireplaces.map(fp => {
                        const isSelected = selectedOptions.fireplacePackageId === fp.id;
                        return (
                          <button
                            key={fp.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, fireplacePackageId: fp.id }))}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{fp.name}</div>
                              <p className="text-[11px] text-slate-500 mt-1">{fp.description}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 font-mono text-xs font-bold text-emerald-800">
                              {fp.price === 0 ? 'None' : `+$${fp.price.toLocaleString()}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-section 5: Exterior & Roof */}
              {customizerSection === 'exterior' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Architectural Exterior Elevation Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {FACTORY_UPGRADE_PACKAGES.exteriorPackages.map(ep => {
                        const isSelected = selectedOptions.exteriorPackageId === ep.id;
                        return (
                          <button
                            key={ep.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, exteriorPackageId: ep.id }))}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-slate-900">{ep.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  {ep.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-3">{ep.description}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Upgrade Price</span>
                              <span className="font-mono font-bold text-sm text-emerald-800">
                                {ep.price === 0 ? 'Standard Exterior' : `+$${ep.price.toLocaleString()}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">GAF Timberline Shingles & Metal Roofing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {DECOR_MATRIX.roofing.map(rf => {
                        const isSelected = selectedOptions.roofingType === rf.name;
                        return (
                          <button
                            key={rf.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, roofingType: rf.name }))}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <span className="text-[9px] font-mono text-slate-400 uppercase">{rf.type}</span>
                              <div className="font-bold text-xs text-slate-900 mt-0.5">{rf.name}</div>
                              <p className="text-[11px] text-slate-500 mt-1">{rf.desc}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 font-mono text-xs font-bold text-emerald-800">
                              {rf.price === 0 ? 'Standard Shingle' : `+$${rf.price.toLocaleString()}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Exterior Entry & Patio Doors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {FACTORY_UPGRADE_PACKAGES.entryDoors.map(dr => {
                        const isSelected = selectedOptions.doorPackageId === dr.id;
                        return (
                          <button
                            key={dr.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, doorPackageId: dr.id }))}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{dr.name}</div>
                              <p className="text-[11px] text-slate-500 mt-1">{dr.description}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 font-mono text-xs font-bold text-emerald-800">
                              {dr.price === 0 ? 'Standard 36" Door' : `+$${dr.price.toLocaleString()}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-section 6: Energy & Climate */}
              {customizerSection === 'energy' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Pacific Northwest Energy Star & Utility Packages</h3>
                  <p className="text-xs text-slate-500">Engineered for cold Kitsap County winters and Olympic Peninsula moisture.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FACTORY_UPGRADE_PACKAGES.energyAndUtilities.map(nrg => {
                      const isSelected = selectedOptions.energyPackageId === nrg.id;
                      return (
                        <button
                          key={nrg.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, energyPackageId: nrg.id }))}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-900">{nrg.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {nrg.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">{nrg.description}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">Upgrade Price</span>
                            <span className="font-mono font-bold text-sm text-emerald-800">
                              {nrg.price === 0 ? 'Standard PNW Thermal' : `+$${nrg.price.toLocaleString()}`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="p-6 space-y-4">
              <div className="relative aspect-[16/9] max-h-[500px] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img 
                  src={photos[selectedPhotoIdx]} 
                  alt={`${floorplan.name} Photo ${selectedPhotoIdx + 1}`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedPhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedPhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {photos.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {photos.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedPhotoIdx === idx 
                          ? 'border-emerald-600 ring-2 ring-emerald-500/40' 
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARCHITECTURAL BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="p-6 space-y-4">
              <FloorplanBlueprint floorplan={floorplan} />
            </div>
          )}

          {/* TAB 4: MANUFACTURER SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Certified Structural Envelope</h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Exterior Framing:</span>
                      <span className="font-medium text-slate-900">{floorplan.specs.framing}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Thermal Insulation:</span>
                      <span className="font-medium text-slate-900">{floorplan.specs.insulation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Roof Load & Pitch:</span>
                      <span className="font-medium text-slate-900">{floorplan.specs.roofPitch}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Exterior Cladding:</span>
                      <span className="font-medium text-slate-900">{floorplan.specs.exteriorSiding}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Building Code:</span>
                      <span className="font-medium text-slate-900">{floorplan.specs.hudCodeCertification}</span>
                    </div>
                  </div>
                </div>

                {floorplan.rawSpecs && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Factory Systems & Mechanical</h4>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div>
                        <div className="font-semibold text-slate-900">Plumbing & Electrical:</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{floorplan.rawSpecs.utilities}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="font-semibold text-slate-900">Kitchen & Bath Appointments:</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{floorplan.rawSpecs.kitchenBath}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Price Bar & Actions */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Master List Base</span>
              <div className="text-base font-bold text-slate-800 font-mono">
                ${floorplan.basePrice.toLocaleString()}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Upgrades Total</span>
              <div className="text-base font-bold text-emerald-700 font-mono">
                +${optionsTotal.toLocaleString()}
              </div>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Configured Retail</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                ${configuredTotalPrice.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">
                Est. <strong className="text-emerald-700 font-mono">${configuredMonthly.toLocaleString()}/mo*</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {floorplan.hasTour && (
              <button
                onClick={() => onOpenTour(floorplan)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Step Inside (3D)</span>
              </button>
            )}

            <button
              onClick={() => onPrint(floorplan, selectedOptions, configuredTotalPrice)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print Configured Specs</span>
            </button>

            <button
              onClick={() => onBookAppointment(floorplan)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Reserve & Meet Consultant</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
