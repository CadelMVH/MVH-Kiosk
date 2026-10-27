import React, { useState } from 'react';
import { Floorplan, SelectedOptions } from '../types';
import { FloorplanBlueprint } from './FloorplanBlueprint';
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
  ExternalLink
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
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  const photos = floorplan.photos && floorplan.photos.length > 0 
    ? floorplan.photos 
    : [floorplan.exteriorImageUrl];

  // Selected customization state
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    exteriorFinishId: floorplan.options?.exteriorFinish[0]?.id || 'ext-1',
    kitchenPackageId: floorplan.options?.kitchenPackage[0]?.id || 'kit-1',
    porchPackageId: floorplan.options?.porchPackage[0]?.id || 'porch-1',
    appliancePackageId: floorplan.options?.appliancePackage[0]?.id || 'app-1',
  });

  // Calculate pricing based on chosen options
  const selectedExterior = floorplan.options?.exteriorFinish.find(o => o.id === selectedOptions.exteriorFinishId);
  const selectedKitchen = floorplan.options?.kitchenPackage.find(o => o.id === selectedOptions.kitchenPackageId);
  const selectedPorch = floorplan.options?.porchPackage.find(o => o.id === selectedOptions.porchPackageId);
  const selectedAppliance = floorplan.options?.appliancePackage.find(o => o.id === selectedOptions.appliancePackageId);

  const optionsTotal = 
    (selectedExterior?.price || 0) + 
    (selectedKitchen?.price || 0) + 
    (selectedPorch?.price || 0) + 
    (selectedAppliance?.price || 0);

  const configuredTotalPrice = floorplan.basePrice + optionsTotal;
  const configuredMonthly = Math.round(configuredTotalPrice * 0.007);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in select-none">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
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
              <div className="flex items-center gap-2">
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
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    3D Tour Ready
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'customizer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Finishes & Customizer</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'specs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Manufacturer Specifications</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {floorplan.hasTour && (
              <button
                onClick={() => onOpenTour(floorplan)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Launch 3D Tour</span>
              </button>
            )}

            {floorplan.floorplanPdf && (
              <a
                href={floorplan.floorplanPdf}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold transition-colors border border-sky-200"
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Original PDF</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: CUSTOMIZER */}
          {activeTab === 'customizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Customizer */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* 1. Exterior Finish */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">1. Exterior Siding Package</h4>
                      <p className="text-xs text-slate-500">Pacific Northwest certified siding packages with 5/50 year warranty</p>
                    </div>
                    {selectedExterior && selectedExterior.price > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        +${selectedExterior.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {floorplan.options?.exteriorFinish.map(opt => {
                      const isSelected = selectedOptions.exteriorFinishId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, exteriorFinishId: opt.id }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-slate-900 bg-slate-900/5 ring-2 ring-slate-900/20' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span 
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-xs" 
                              style={{ backgroundColor: opt.previewColor || '#94A3B8' }}
                            />
                            {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                          </div>
                          <div className="font-semibold text-xs text-slate-900">{opt.name}</div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{opt.description}</div>
                          <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                            {opt.price === 0 ? 'Included' : `+$${opt.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Kitchen & Countertop Package */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">2. Kitchen Cabinetry & Countertop Package</h4>
                      <p className="text-xs text-slate-500">Solid wood face-frame cabinetry, quartz counters, and soft-close hardware</p>
                    </div>
                    {selectedKitchen && selectedKitchen.price > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        +${selectedKitchen.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {floorplan.options?.kitchenPackage.map(opt => {
                      const isSelected = selectedOptions.kitchenPackageId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, kitchenPackageId: opt.id }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-slate-900 bg-slate-900/5 ring-2 ring-slate-900/20' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-slate-900">{opt.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{opt.description}</div>
                          <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                            {opt.price === 0 ? 'Included' : `+$${opt.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Porch & Outdoor Living */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">3. Front Porch & Entry Package</h4>
                      <p className="text-xs text-slate-500">Covered cedar timber post porches engineered for Pacific Northwest rain protection</p>
                    </div>
                    {selectedPorch && selectedPorch.price > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        +${selectedPorch.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {floorplan.options?.porchPackage.map(opt => {
                      const isSelected = selectedOptions.porchPackageId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, porchPackageId: opt.id }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-slate-900 bg-slate-900/5 ring-2 ring-slate-900/20' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-slate-900">{opt.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{opt.description}</div>
                          <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                            {opt.price === 0 ? 'Included' : `+$${opt.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Appliance Package */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">4. Kitchen Appliance Collection</h4>
                      <p className="text-xs text-slate-500">Samsung & Frigidaire stainless steel or matte black appliances</p>
                    </div>
                    {selectedAppliance && selectedAppliance.price > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        +${selectedAppliance.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {floorplan.options?.appliancePackage.map(opt => {
                      const isSelected = selectedOptions.appliancePackageId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, appliancePackageId: opt.id }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-slate-900 bg-slate-900/5 ring-2 ring-slate-900/20' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-slate-900">{opt.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{opt.description}</div>
                          <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                            {opt.price === 0 ? 'Included' : `+$${opt.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Price Breakdown */}
              <div className="lg:col-span-4 sticky top-0 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">
                    Pricing Breakdown
                  </h4>

                  <div className="space-y-2 pb-4 border-b border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Factory Estimate</span>
                      <span className="font-mono font-semibold">${floorplan.basePrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Siding Selection</span>
                      <span className="font-mono">{selectedExterior?.price ? `+$${selectedExterior.price.toLocaleString()}` : '$0'}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Kitchen Upgrade</span>
                      <span className="font-mono">{selectedKitchen?.price ? `+$${selectedKitchen.price.toLocaleString()}` : '$0'}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Porch Selection</span>
                      <span className="font-mono">{selectedPorch?.price ? `+$${selectedPorch.price.toLocaleString()}` : '$0'}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Appliance Suite</span>
                      <span className="font-mono">{selectedAppliance?.price ? `+$${selectedAppliance.price.toLocaleString()}` : '$0'}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase">Estimated Total</span>
                      <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                        ${configuredTotalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Est. Monthly Payment</div>
                        <div className="text-[10px] text-emerald-700">30-Year Fixed · 10% Down</div>
                      </div>
                      <div className="text-base font-bold font-mono text-emerald-900">
                        ${configuredMonthly.toLocaleString()}/mo
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 space-y-2.5">
                    <button
                      onClick={() => onPrint(floorplan, selectedOptions, configuredTotalPrice)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-sky-400" />
                      <span>Print Take-Home Spec Sheet</span>
                    </button>

                    {floorplan.hasTour && (
                      <button
                        onClick={() => onOpenTour(floorplan)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Launch 3D Virtual Tour</span>
                      </button>
                    )}

                    <button
                      onClick={() => onBookAppointment(floorplan)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-300 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Speak with Sales / Join Waitlist</span>
                    </button>
                  </div>
                </div>

                {/* Quick Dimensions */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Quick Dimensions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div>Dimensions: <strong className="text-slate-800">{floorplan.dimensions}</strong></div>
                    <div>Square Feet: <strong className="text-slate-800">{floorplan.squareFeet.toLocaleString()}</strong></div>
                    <div>Bedrooms: <strong className="text-slate-800">{floorplan.bedrooms} Beds</strong></div>
                    <div>Bathrooms: <strong className="text-slate-800">{floorplan.bathrooms} Baths</strong></div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="relative aspect-[16/9] max-h-[60vh] bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
                <img 
                  src={photos[selectedPhotoIdx]} 
                  alt={`${floorplan.name} Photo ${selectedPhotoIdx + 1}`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedPhotoIdx(prev => (prev > 0 ? prev - 1 : photos.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedPhotoIdx(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        idx === selectedPhotoIdx ? 'border-emerald-600 scale-105' : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Architectural Layout & Blueprints</h3>
                  <p className="text-xs text-slate-500">Dimensions: {floorplan.dimensions} · {floorplan.bedrooms} Beds / {floorplan.bathrooms} Baths · {floorplan.squareFeet.toLocaleString()} SQ FT</p>
                </div>
                {floorplan.floorplanPdf && (
                  <a
                    href={floorplan.floorplanPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Manufacturer PDF</span>
                  </a>
                )}
              </div>

              <FloorplanBlueprint floorplan={floorplan} interactive />
            </div>
          )}

          {/* TAB 4: MANUFACTURER SPECS */}
          {activeTab === 'specs' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {floorplan.manufacturer} Factory Construction Specifications
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manufactured to HUD / IRC building codes with Pacific Northwest thermal packages
                </p>
              </div>

              {/* Raw Specs from Spreadsheet */}
              {floorplan.rawSpecs && (
                <div className="space-y-4">
                  {floorplan.rawSpecs.construction && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <h4 className="font-bold text-slate-900 mb-1">Construction & Framing</h4>
                      <p className="text-slate-700 leading-relaxed">{floorplan.rawSpecs.construction}</p>
                    </div>
                  )}

                  {floorplan.rawSpecs.exterior && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <h4 className="font-bold text-slate-900 mb-1">Exterior & Roofing</h4>
                      <p className="text-slate-700 leading-relaxed">{floorplan.rawSpecs.exterior}</p>
                    </div>
                  )}

                  {floorplan.rawSpecs.interior && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <h4 className="font-bold text-slate-900 mb-1">Interior & Drywall Finishes</h4>
                      <p className="text-slate-700 leading-relaxed">{floorplan.rawSpecs.interior}</p>
                    </div>
                  )}

                  {floorplan.rawSpecs.kitchenBath && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <h4 className="font-bold text-slate-900 mb-1">Kitchen & Bathroom Features</h4>
                      <p className="text-slate-700 leading-relaxed">{floorplan.rawSpecs.kitchenBath}</p>
                    </div>
                  )}

                  {floorplan.rawSpecs.utilities && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <h4 className="font-bold text-slate-900 mb-1">Utilities, Electrical & Plumbing</h4>
                      <p className="text-slate-700 leading-relaxed">{floorplan.rawSpecs.utilities}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
