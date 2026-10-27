import React from 'react';
import { Floorplan, SelectedOptions } from '../types';
import { FloorplanBlueprint } from './FloorplanBlueprint';
import { Printer, X, Download, QrCode, CheckCircle2, Phone, MapPin, Globe } from 'lucide-react';

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

  const selectedExterior = selectedOptions 
    ? floorplan.options.exteriorFinish.find(o => o.id === selectedOptions.exteriorFinishId)
    : floorplan.options.exteriorFinish[0];

  const selectedKitchen = selectedOptions
    ? floorplan.options.kitchenPackage.find(o => o.id === selectedOptions.kitchenPackageId)
    : floorplan.options.kitchenPackage[0];

  const selectedPorch = selectedOptions
    ? floorplan.options.porchPackage.find(o => o.id === selectedOptions.porchPackageId)
    : floorplan.options.porchPackage[0];

  const selectedAppliance = selectedOptions
    ? floorplan.options.appliancePackage.find(o => o.id === selectedOptions.appliancePackageId)
    : floorplan.options.appliancePackage[0];

  const estimatedMonthly = Math.round(totalPrice * 0.007);

  return (
    <>
      {/* On-Screen Print Preview Modal */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none no-print">
        <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Print Take-Home Spec Sheet</h3>
                <p className="text-xs text-slate-400">Ready to print to showroom printer or save as PDF brochure</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-950"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document Now</span>
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Preview Scroller */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950/70 flex justify-center">
            <div className="bg-white text-slate-900 w-full max-w-2xl p-8 rounded-lg shadow-2xl border border-slate-300 font-sans text-xs">
              
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <img 
                    src="/assets/aistudio/mvhBremertonCap_8f5d5a13.png" 
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
                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>3472 West Belfair Valley Rd, Bremerton, WA 98312</span>
                      <span>·</span>
                      <span>(360) 979-8430</span>
                      <span>·</span>
                      <span>mtviewhomes.com</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SPECIFICATION SHEET</div>
                  <div className="text-sm font-bold text-slate-900">{floorplan.name}</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-bold">
                    DATE: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Photo & Overview Strip */}
              <div className="grid grid-cols-2 gap-4 mb-4 items-center">
                <div className="h-36 rounded-md overflow-hidden border border-slate-200">
                  <img 
                    src={floorplan.exteriorImageUrl} 
                    alt={floorplan.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-base font-bold text-slate-900">{floorplan.name}</div>
                  <div className="text-xs text-slate-600 leading-snug">{floorplan.tagline}</div>
                  
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-200 text-[11px] font-mono">
                    <div>Series: <strong>{floorplan.series}</strong></div>
                    <div>Dimensions: <strong>{floorplan.dimensions}</strong></div>
                    <div>Bedrooms: <strong>{floorplan.bedrooms} Beds</strong></div>
                    <div>Bathrooms: <strong>{floorplan.bathrooms} Baths</strong></div>
                    <div>Square Feet: <strong>{floorplan.squareFeet.toLocaleString()}</strong></div>
                    <div>Status: <strong>{floorplan.status}</strong></div>
                  </div>
                </div>
              </div>

              {/* Architectural Schematic Box */}
              <div className="mb-4">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>Architectural Floorplan Blueprint</span>
                  <span className="text-[10px] font-mono text-slate-500 font-normal">HUD CERTIFIED SCHEMATIC</span>
                </div>
                <div className="scale-90 origin-top -mb-4">
                  <FloorplanBlueprint floorplan={floorplan} />
                </div>
              </div>

              {/* Configured Pricing & Selected Packages */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Pricing & Selected Customization Packages
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700">
                  <div>Base Price: <strong className="font-mono">${floorplan.basePrice.toLocaleString()}</strong></div>
                  <div>Exterior: <strong>{selectedExterior?.name || 'Standard'}</strong></div>
                  <div>Kitchen: <strong>{selectedKitchen?.name || 'Standard'}</strong></div>
                  <div>Porch: <strong>{selectedPorch?.name || 'Standard'}</strong></div>
                  <div>Appliances: <strong>{selectedAppliance?.name || 'Standard'}</strong></div>
                  <div>Estimated Monthly: <strong className="font-mono text-emerald-800">${estimatedMonthly.toLocaleString()}/mo*</strong></div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="font-bold text-slate-900">Total Configured Price:</span>
                  <span className="text-base font-extrabold font-mono text-slate-900">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Factory Construction Specs Table */}
              <div className="border border-slate-200 rounded-lg p-3 text-[10px] text-slate-600 mb-4">
                <div className="font-bold text-slate-900 text-[11px] mb-1.5 uppercase">Certified Factory Construction Specifications</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Framing: <span className="font-medium text-slate-800">{floorplan.specs.framing}</span></div>
                  <div>Insulation: <span className="font-medium text-slate-800">{floorplan.specs.insulation}</span></div>
                  <div>Roof: <span className="font-medium text-slate-800">{floorplan.specs.roofPitch}</span></div>
                  <div>Code: <span className="font-medium text-slate-800">{floorplan.specs.hudCodeCertification}</span></div>
                </div>
              </div>

              {/* Footer Notice & QR Code */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[9px] text-slate-500">
                <div>
                  <p>* Estimated monthly payment based on 30-year fixed loan at 7.25% APR with 10% down payment. Taxes and insurance not included.</p>
                  <p className="mt-0.5 font-medium text-slate-700">Present this sheet to your sales consultant for priority lot reservations.</p>
                </div>
                <div className="text-right shrink-0 ml-4 font-mono">
                  MOUNTAIN VIEW HOMES OF BREMERTON · KIOSK PRINT
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Pure Print-Only DOM Representation (Triggered by Browser window.print()) */}
      <div className="print-only">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/assets/aistudio/mvhBremertonCap_8f5d5a13.png" 
              alt="Mountain View Homes of Bremerton Logo" 
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Mountain View Homes of Bremerton</h1>
              <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: '#4B5563' }}>Premier Manufactured & Modular Homes · Bremerton, WA</p>
              <p style={{ fontSize: '10px', margin: '2px 0 0 0', color: '#6B7280' }}>3472 West Belfair Valley Rd, Bremerton, WA 98312 · (360) 979-8430 · mtviewhomes.com</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#6B7280' }}>SPECIFICATION SHEET</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0' }}>{floorplan.name}</div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>DATE: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Home Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div style={{ height: '140px', overflow: 'hidden', border: '1px solid #D1D5DB', borderRadius: '4px' }}>
            <img 
              src={floorplan.exteriorImageUrl} 
              alt={floorplan.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{floorplan.name}</h2>
            <p style={{ fontSize: '11px', color: '#4B5563', margin: '0 0 8px 0' }}>{floorplan.tagline}</p>
            <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
              <div>Series: <strong>{floorplan.series}</strong></div>
              <div>Dimensions: <strong>{floorplan.dimensions}</strong></div>
              <div>Bedrooms / Baths: <strong>{floorplan.bedrooms} Beds / {floorplan.bathrooms} Baths</strong></div>
              <div>Total Living Area: <strong>{floorplan.squareFeet.toLocaleString()} SQ FT</strong></div>
              <div>Current Availability: <strong>{floorplan.status}</strong></div>
            </div>
          </div>
        </div>

        {/* Blueprint Layout */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>ARCHITECTURAL BLUEPRINT & SCHEMATIC</div>
          <FloorplanBlueprint floorplan={floorplan} />
        </div>

        {/* Pricing & Options */}
        <div style={{ border: '1px solid #E5E7EB', padding: '10px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#F9FAFB' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>CONFIGURED PRICING BREAKDOWN</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
            <div>Base Model Price: <strong>${floorplan.basePrice.toLocaleString()}</strong></div>
            <div>Exterior Siding: <strong>{selectedExterior?.name || 'Standard'}</strong></div>
            <div>Gourmet Kitchen: <strong>{selectedKitchen?.name || 'Standard'}</strong></div>
            <div>Porch / Decking: <strong>{selectedPorch?.name || 'Standard'}</strong></div>
            <div>Appliance Collection: <strong>{selectedAppliance?.name || 'Standard'}</strong></div>
            <div>Estimated Monthly: <strong>${estimatedMonthly.toLocaleString()}/mo*</strong></div>
          </div>
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #D1D5DB', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
            <span>TOTAL CONFIGURED PRICE:</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Certified Specs */}
        <div style={{ fontSize: '10px', color: '#4B5563', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
          <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '3px' }}>CERTIFIED FACTORY CONSTRUCTION SPECIFICATIONS</div>
          <div>Framing: {floorplan.specs.framing} · Insulation: {floorplan.specs.insulation} · Roof: {floorplan.specs.roofPitch} · Code: {floorplan.specs.hudCodeCertification}</div>
          <div style={{ marginTop: '4px', fontSize: '9px' }}>
            * Payment estimate based on 30-year fixed rate at 7.25% APR with 10% down payment. Taxes and site prep not included. Quote valid for 30 days.
          </div>
        </div>
      </div>
    </>
  );
};
