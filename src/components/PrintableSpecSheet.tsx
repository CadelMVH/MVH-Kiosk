import React from 'react';
import { Floorplan, SelectedOptions } from '../types';
import { FloorplanPdfRenderer } from './FloorplanPdfRenderer';
import { FloorplanBlueprint } from './FloorplanBlueprint';
import { FACTORY_UPGRADE_PACKAGES } from '../data/factoryOptions';
import { getSeriesStandards } from '../data/seriesStandards';
import { 
  Printer, 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Home, 
  Layers 
} from 'lucide-react';
import { assetUrl } from '../lib/assetUrl';

interface PrintableSpecSheetProps {
  floorplan: Floorplan;
  selectedOptions?: SelectedOptions;
  totalPrice?: number;
  onClose: () => void;
}

export const PrintableSpecSheet: React.FC<PrintableSpecSheetProps> = ({
  floorplan,
  selectedOptions,
  totalPrice = floorplan.basePrice,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Resolve packages
  const exteriorPkg = FACTORY_UPGRADE_PACKAGES.exteriorPackages.find(p => p.id === selectedOptions?.exteriorPackageId);
  const appliancePkg = FACTORY_UPGRADE_PACKAGES.appliancePackages.find(p => p.id === selectedOptions?.appliancePackageId);
  const bathPkg = FACTORY_UPGRADE_PACKAGES.bathroomPackages.find(p => p.id === selectedOptions?.bathroomPackageId);
  const fireplacePkg = FACTORY_UPGRADE_PACKAGES.fireplaces.find(p => p.id === selectedOptions?.fireplacePackageId);
  const energyPkg = FACTORY_UPGRADE_PACKAGES.energyAndUtilities.find(p => p.id === selectedOptions?.energyPackageId);
  const doorPkg = FACTORY_UPGRADE_PACKAGES.entryDoors.find(p => p.id === selectedOptions?.doorPackageId);

  // Retrieve comprehensive factory series standards
  const seriesStandards = getSeriesStandards(floorplan.series, floorplan.manufacturer);

  const estimatedMonthly = Math.round((totalPrice * 0.9) * 0.0068218);

  return (
    <>
      {/* On-Screen Print Preview Modal */}
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none no-print">
        <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Print Take-Home Spec Sheet</h3>
                <p className="text-xs text-slate-400">
                  {floorplan.name} · {seriesStandards.seriesName} Standards & Certified Architectural Blueprint
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Direct Link to Official Series PDF */}
              {seriesStandards.pdfAssetPath && (
                <a
                  href={assetUrl(seriesStandards.pdfAssetPath)}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  title="Open original manufacturer series standards PDF sheet"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Series Standards PDF</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Preview Scroller */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70 flex justify-center">
            <div className="bg-white text-slate-900 w-full max-w-3xl p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-300 font-sans text-xs space-y-5">
              
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={assetUrl("/assets/aistudio/mvhBremertonCap_8f5d5a13.png")} 
                    alt="Mountain View Homes of Bremerton Logo" 
                    className="w-14 h-14 object-contain shrink-0"
                  />
                  <div>
                    <div className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
                      Mountain View Homes of Bremerton
                    </div>
                    <div className="text-[11px] font-medium text-slate-600">
                      Manufactured & Modular Homes Showroom · Bremerton, WA
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>3472 West Belfair Valley Rd, Bremerton, WA 98312</span>
                      <span>·</span>
                      <span>(360) 979-8430</span>
                      <span>·</span>
                      <span>mtviewhomes.com</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">TAKE-HOME SPEC SHEET</div>
                  <div className="text-sm font-bold text-slate-900">{floorplan.name}</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-bold">
                    DATE: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    SERIES: {seriesStandards.seriesName}
                  </div>
                </div>
              </div>

              {/* Photo & Overview Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="h-40 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                  <img 
                    src={floorplan.exteriorImageUrl} 
                    alt={floorplan.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">{floorplan.name}</div>
                    <div className="text-xs text-slate-600 leading-snug">{floorplan.tagline}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-200 text-[11px]">
                    <div>Manufacturer: <strong>{floorplan.manufacturer}</strong></div>
                    <div>Series: <strong>{floorplan.series}</strong></div>
                    <div>Dimensions: <strong>{floorplan.dimensions}</strong></div>
                    <div>Living Area: <strong>{floorplan.squareFeet.toLocaleString()} SQ FT</strong></div>
                    <div>Bedrooms / Baths: <strong>{floorplan.bedrooms} Beds / {floorplan.bathrooms} Baths</strong></div>
                    <div>Sections: <strong>{floorplan.sections || 'Standard'}</strong></div>
                  </div>
                </div>
              </div>

              {/* Specific Architectural Floorplan Blueprint from PDF */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Architectural Floorplan Blueprint (Certified Factory PDF)</span>
                  </span>
                  {floorplan.floorplanPdf && (
                    <span className="text-[10px] font-mono text-slate-500 font-normal">
                      MODEL SPECIFIC SCHEMATIC
                    </span>
                  )}
                </div>

                {floorplan.floorplanPdf ? (
                  <FloorplanPdfRenderer
                    pdfUrl={floorplan.floorplanPdf}
                    planName={floorplan.name}
                  />
                ) : (
                  <FloorplanBlueprint floorplan={floorplan} />
                )}
              </div>

              {/* Configured Pricing & Selected Options Matrix */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center justify-between">
                  <span>Configuration & Pricing Summary (2026 Master Price List)</span>
                  <span className="text-[10px] text-emerald-700 font-bold font-mono">RETAIL PRICING</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-[11px] text-slate-700">
                  <div>Base Retail Price: <strong className="font-mono text-slate-900">${floorplan.basePrice.toLocaleString()}</strong></div>
                  <div>Exterior Package: <strong>{exteriorPkg?.name || 'Standard'}</strong></div>
                  <div>Appliance Suite: <strong>{appliancePkg?.name || 'Standard'}</strong></div>
                  <div>Bath Suite: <strong>{bathPkg?.name || 'Standard'}</strong></div>
                  <div>Cabinet Finish: <strong>{selectedOptions?.cabinetFinish || 'White Shaker'}</strong></div>
                  <div>Countertops: <strong>{selectedOptions?.countertopType || 'Sierra Cascade'}</strong></div>
                  <div>Flooring Type: <strong>{selectedOptions?.flooringType || 'LX 311 European Oak'}</strong></div>
                  {fireplacePkg && fireplacePkg.price > 0 && (
                    <div>Fireplace: <strong>{fireplacePkg.name}</strong></div>
                  )}
                  {energyPkg && energyPkg.price > 0 && (
                    <div>Energy Star: <strong>{energyPkg.name}</strong></div>
                  )}
                  <div>Estimated Payment: <strong className="font-mono text-emerald-800">${estimatedMonthly.toLocaleString()}/mo*</strong></div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-xs">Total Configured Retail Price:</span>
                  <span className="text-base font-extrabold font-mono text-slate-900">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Comprehensive Home Series Standard Specifications */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{seriesStandards.seriesName} Standard Factory Specifications ({seriesStandards.year})</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {seriesStandards.tagline}
                    </p>
                  </div>
                  {seriesStandards.pdfAssetPath && (
                    <a
                      href={assetUrl(seriesStandards.pdfAssetPath)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <span>View Factory PDF Sheet</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-slate-700">
                  {/* Construction Features */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 uppercase text-[10px] flex items-center gap-1">
                      <Layers className="w-3 h-3 text-amber-600" />
                      <span>Construction & Framing</span>
                    </span>
                    <ul className="space-y-1 pl-3.5 list-disc text-slate-600">
                      {seriesStandards.construction.slice(0, 5).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Energy Saving Features */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 uppercase text-[10px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-600" />
                      <span>Thermal Envelope & Energy Star</span>
                    </span>
                    <ul className="space-y-1 pl-3.5 list-disc text-slate-600">
                      {seriesStandards.energySaving.slice(0, 5).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Kitchen & Appliances */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 uppercase text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>Kitchen & Appliances</span>
                    </span>
                    <ul className="space-y-1 pl-3.5 list-disc text-slate-600">
                      {seriesStandards.kitchen.slice(0, 4).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Utility, Heating & Safety */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 uppercase text-[10px] flex items-center gap-1">
                      <Home className="w-3 h-3 text-indigo-600" />
                      <span>Plumbing, Electrical & Utility</span>
                    </span>
                    <ul className="space-y-1 pl-3.5 list-disc text-slate-600">
                      {seriesStandards.utilityAndHeating.slice(0, 4).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer Notice */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[9px] text-slate-500">
                <div>
                  <p>* Estimated monthly payment based on 30-year fixed loan at 7.25% APR with 10% down payment. Taxes and site prep not included.</p>
                  <p className="mt-0.5 font-medium text-slate-700">Present this specification sheet to your Mountain View Homes sales consultant for lot reservation.</p>
                </div>
                <div className="text-right shrink-0 ml-4 font-mono font-bold text-slate-700">
                  MOUNTAIN VIEW HOMES OF BREMERTON
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Pure Print-Only DOM Representation (Triggered by Browser window.print()) */}
      <div className="print-only">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={assetUrl("/assets/aistudio/mvhBremertonCap_8f5d5a13.png")} 
              alt="Mountain View Homes of Bremerton Logo" 
              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            />
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Mountain View Homes of Bremerton</h1>
              <p style={{ fontSize: '10px', margin: '2px 0 0 0', color: '#4B5563' }}>Premier Manufactured & Modular Homes · Bremerton, WA</p>
              <p style={{ fontSize: '9px', margin: '2px 0 0 0', color: '#6B7280' }}>3472 West Belfair Valley Rd, Bremerton, WA 98312 · (360) 979-8430 · mtviewhomes.com</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#6B7280' }}>TAKE-HOME SPEC SHEET</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', margin: '2px 0' }}>{floorplan.name}</div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace' }}>DATE: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Home Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ height: '130px', overflow: 'hidden', border: '1px solid #D1D5DB', borderRadius: '4px' }}>
            <img 
              src={floorplan.exteriorImageUrl} 
              alt={floorplan.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 3px 0' }}>{floorplan.name}</h2>
            <p style={{ fontSize: '10px', color: '#4B5563', margin: '0 0 6px 0' }}>{floorplan.tagline}</p>
            <div style={{ fontSize: '10px', lineHeight: '1.5' }}>
              <div>Series: <strong>{floorplan.series}</strong> ({seriesStandards.seriesName})</div>
              <div>Dimensions: <strong>{floorplan.dimensions}</strong></div>
              <div>Bedrooms / Baths: <strong>{floorplan.bedrooms} Beds / {floorplan.bathrooms} Baths</strong></div>
              <div>Total Living Area: <strong>{floorplan.squareFeet.toLocaleString()} SQ FT</strong></div>
              <div>Current Availability: <strong>{floorplan.status}</strong></div>
            </div>
          </div>
        </div>

        {/* Blueprint Layout from PDF */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>
            ARCHITECTURAL FLOORPLAN BLUEPRINT ({floorplan.name})
          </div>
          {floorplan.floorplanPdf ? (
            <FloorplanPdfRenderer
              pdfUrl={floorplan.floorplanPdf}
              planName={floorplan.name}
              forPrint={true}
            />
          ) : (
            <FloorplanBlueprint floorplan={floorplan} />
          )}
        </div>

        {/* Selected Upgrades & Decor Matrix */}
        <div style={{ border: '1px solid #000', padding: '8px', marginBottom: '12px', backgroundColor: '#F9FAFB' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>
            Configuration & Pricing Summary (2026 Master Price List)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
            <div>Base Retail Price: <strong>${floorplan.basePrice.toLocaleString()}</strong></div>
            <div>Exterior Package: <strong>{exteriorPkg?.name || 'Standard'}</strong></div>
            <div>Appliance Suite: <strong>{appliancePkg?.name || 'Standard'}</strong></div>
            <div>Bath Suite: <strong>{bathPkg?.name || 'Standard'}</strong></div>
            <div>Cabinet Finish: <strong>{selectedOptions?.cabinetFinish || 'White Shaker'}</strong></div>
            <div>Countertops: <strong>{selectedOptions?.countertopType || 'Sierra Cascade'}</strong></div>
            <div>Flooring: <strong>{selectedOptions?.flooringType || 'LX 311 European Oak'}</strong></div>
            <div>Estimated Monthly: <strong>${estimatedMonthly.toLocaleString()}/mo*</strong></div>
          </div>
          <div style={{ borderTop: '1px solid #000', marginTop: '6px', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Total Configured Retail Price:</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Home Series Standard Specs */}
        <div style={{ border: '1px solid #D1D5DB', padding: '8px', fontSize: '9px', marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}>
            {seriesStandards.seriesName} Certified Factory Standards ({seriesStandards.year})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#111827' }}>Construction & Framing:</div>
              <ul style={{ margin: '2px 0 0 12px', padding: 0 }}>
                {seriesStandards.construction.slice(0, 4).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#111827' }}>Energy Star & Insulation:</div>
              <ul style={{ margin: '2px 0 0 12px', padding: 0 }}>
                {seriesStandards.energySaving.slice(0, 4).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #D1D5DB', paddingTop: '6px', fontSize: '8px', color: '#4B5563', display: 'flex', justifyContent: 'space-between' }}>
          <div>* Estimated monthly payment based on 30-year fixed loan at 7.25% APR with 10% down.</div>
          <div>Mountain View Homes of Bremerton · Showroom Kiosk Document</div>
        </div>
      </div>
    </>
  );
};
