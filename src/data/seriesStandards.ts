/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SeriesStandardSpec {
  seriesName: string;
  manufacturer: string;
  year: string;
  pdfAssetPath: string;
  tagline: string;
  construction: string[];
  exterior: string[];
  energySaving: string[];
  interior: string[];
  kitchen: string[];
  bathrooms: string[];
  utilityAndHeating: string[];
  safety: string[];
}

export const SERIES_STANDARDS: Record<string, SeriesStandardSpec> = {
  // 1. Golden West - Dream Silver Series
  'Dream Silver': {
    seriesName: 'Dream Silver Series',
    manufacturer: 'Golden West',
    year: '2025/2026',
    pdfAssetPath: '/assets/aistudio/Dream_Silver_Series_Standards_2025_-_GW_8a4c3071.pdf',
    tagline: 'Golden West Standard Features · Proven Value & Durability',
    construction: [
      '2x6 Floor Joists on 16" Centers',
      '2x6 Exterior Walls on 16" Centers',
      '19/32" OSB Tongue & Groove Floor Decking',
      'In-Floor Waste Plumbing with Kiln-Dried Lumber',
      '96" Sidewall (Flat Ceiling Throughout)',
      '30# Roof Snow Load with 2x8 Rough Sawn Fascia',
      '3/12 Nominal Roof Pitch (4:12 Pitch on Single Sections)',
      'Foundation Ready Chassis System'
    ],
    exterior: [
      'LP SmartPanel Siding with 5/50 Year Limited Warranty',
      'Whole House Moisture Barrier Housewrap',
      'Architectural Fiberglass Shingles',
      '36" Front and Rear Doors with Deadbolts',
      'Continuous Eave Soffit Venting & Ridge-Style Roof Venting',
      '4" Window Trim & 14" Eaves (Double Wide) / 6" Eaves (Single Wide)',
      'Exterior GFI Receptacle & Exterior Entry Porch Lights'
    ],
    energySaving: [
      'ENERGY STAR Standard Certified',
      'Dual-Pane Low-E / Argon Gas Insulated Windows',
      '6" Recessed LED Lighting Throughout',
      'R-40 Blown-in Ceiling Insulation',
      'R-21 Exterior Wall Insulation',
      'R-33 Floor Insulation'
    ],
    interior: [
      'Tape & Texture Drywall Throughout with Round Sheetrock Corners',
      'Brocade Style Ceiling Drywall Finish',
      'Raised Panel Cabinet Doors (Dove White or Knotty Alder)',
      'No-Wax Vinyl Flooring in Kitchen, Utility, and Bathrooms',
      'New Wave 25oz Carpet with 5# Carpet Pad',
      'Laminated Countertops with Crescent Counter Edge',
      '2-Panel Interior Doors with Nickel Hardware Throughout',
      'Wood Window Interior Wrap & Baseboard Molding'
    ],
    kitchen: [
      'SAMSUNG Stainless Steel 18 cu. ft. Refrigerator with Ice Maker',
      'SAMSUNG Stainless Steel 30" Free Standing Glass Top Range',
      '30" Stainless Steel Exhaust Fan over Range',
      '8" Deep Stainless Steel Kitchen Sink with Single Lever Sprayer Faucet',
      'Dedicated Fire Extinguisher Under Kitchen Sink'
    ],
    bathrooms: [
      '60" Fiberglass Tub/Shower in Each Bathroom',
      'Adjustable Shower Heads & China Lavatory Sinks',
      '36" Comfort Height Lavatory Vanity Cabinets',
      'Comfort Height Elongated Toilets',
      'Exhaust Fans with Integrated Light in Each Bathroom'
    ],
    utilityAndHeating: [
      '200 Amp Electrical Service with All Copper Wiring',
      'ecobee Smart Thermostat',
      'Forced Air Electric Downflow Furnace (AC/HP Ready)',
      '40 Gallon Electric Quick-Recovery Water Heater',
      'Plumbed and Wired for Full-Size Washer & Dryer',
      'Shut-Off Valves at All Toilets, Sinks & Whole House Master Shut-Off'
    ],
    safety: [
      'Interconnected Smoke Alarms in All Bedrooms & Living Areas',
      'Deadbolts on Front and Rear Exterior Doors',
      'GFI Receptacles in All Wet Areas',
      'Egress Windows in All Bedrooms'
    ]
  },

  // 2. Golden West - Inspiration Gold Series
  'Inspiration Gold': {
    seriesName: 'Inspiration Gold Series',
    manufacturer: 'Golden West',
    year: '2025/2026',
    pdfAssetPath: '/assets/aistudio/Inspiration_Gold_Series_Standards_2025_-_GW_95c551de.pdf',
    tagline: 'Golden West Flagship Luxury · 9-Foot Ceilings & Premium Finishes',
    construction: [
      '2x6 Floor Joists on 16" Centers & 2x6 Exterior Walls on 16" Centers',
      '108" Sidewall (9-Foot Flat Ceilings Throughout)',
      'Architectural Fiberglass Shingles with 30# Roof Snow Load',
      '19/32" OSB Tongue & Groove Floor Decking',
      'In-Floor Waste Plumbing & Kiln-Dried Lumber Framing',
      'Gable Over Front Door (Per Model) with 2x8 Rough Sawn Fascia',
      '3/12 Nominal Roof Pitch (4:12 on Single Wides)',
      'Foundation Ready Engineered Chassis'
    ],
    exterior: [
      'LP SmartPanel Siding with 5/50 Year Limited Warranty',
      'Whole House Moisture Barrier Wrap',
      '36" Front and Rear Doors with Heavy-Duty Deadbolts',
      '14" Eaves (Double Wide) / 6" Eaves (Single Wide)',
      'Continuous Eave Soffit Venting & Ridge-Style Roof Venting',
      '4" Window Architectural Trim & Exterior GFI Receptacle'
    ],
    energySaving: [
      'ENERGY STAR Standard Certified',
      'Dual-Pane Low-E / Argon Filled Energy-Saving Windows',
      '6" Recessed LED Lighting Throughout',
      'R-40 Blown-in Ceiling Insulation',
      'R-21 Exterior Wall Insulation',
      'R-33 Floor Insulation'
    ],
    interior: [
      'Tape & Texture Drywall Throughout with Round Sheetrock Corners',
      'Ceiling Coffer (2 per Print on Multi-Sections)',
      'Crown Molding in Living Area & Ceiling Fan with Light in Living Room',
      'Seamless Raised Panel Cabinet Doors',
      'Ceramic / Glass Backsplash in Kitchen (Level #8)',
      'New Wave 25oz Carpet with 5# Carpet Pad',
      'Built-in Entertainment Center (Per Model)',
      'Integrated USB Charging Port (1 Std)'
    ],
    kitchen: [
      'SAMSUNG Stainless Steel 18 cu. ft. Refrigerator with Ice Maker',
      'SAMSUNG Stainless Steel Free Standing Glass Top Range',
      '30" Stainless Steel Exhaust Fan over Range',
      '8" Deep Stainless Steel Sink with Single Lever Sprayer Faucet',
      'Laminated Countertops with Full Backsplash & Fire Extinguisher Under Sink'
    ],
    bathrooms: [
      '60" Fiberglass Tub/Shower in Each Bathroom',
      'Gun Slot Architectural Accent Window Over Tub/Shower (Per Model)',
      '36" Comfort Height Lavatory Cabinets with China Sinks',
      'Wood Trimmed Mirrors & Comfort Height Elongated Toilets',
      'Power Exhaust Fans with Integrated Lighting'
    ],
    utilityAndHeating: [
      '200 Amp Electrical Service with All Copper Wiring',
      'ecobee Smart Thermostat',
      'Forced Air Electric Downflow Furnace (AC/HP Ready)',
      '40 Gallon Electric Water Heater & Freezer Receptacle (Per Model)',
      'Plumbed/Wired for Washer and Dryer & Whole House Master Water Shut-Off'
    ],
    safety: [
      'Interconnected Smoke Alarms in All Bedrooms & Living Areas',
      'Deadbolts on Front and Rear Doors & Egress Windows in All Bedrooms',
      'GFI Receptacles in All Wet Locations & Porch Entry Lights'
    ]
  },

  // 3. Clayton Built - Tempo Series
  'Tempo': {
    seriesName: 'Tempo Specs',
    manufacturer: 'Clayton Homes',
    year: '2025/2026',
    pdfAssetPath: '/assets/aistudio/Tempo_Series_Standards_2025_-_GW_bb4f7a09.pdf',
    tagline: 'Clayton Built Standard Features · Modern Craftsmanship',
    construction: [
      '8-Foot Flat Ceilings Throughout',
      '2"x6" Exterior Wall Framing on 16" Centers',
      'Tape & Texture Drywall Throughout',
      '30-Year Architectural Shingles with Upgrade Roof Load Options',
      'Congoleum Lux Linoleum Flooring',
      '14" Eaves (Double Wide) / 6" Eaves (Single Wides)',
      'Ceiling Air Return Ventilation System'
    ],
    exterior: [
      'Craftsman Style Front Door with Kwikset Thumb-Latch Hardware',
      'Half Lite Rear Door with Heavy-Duty Deadbolts',
      'Whole House Vapor Wrap & LP SmartSide Siding',
      'WUI (California/PNW Wildfire Urban Interface) Ready Option',
      'Ridge Ventilation & Continuous Eave Soffit Venting'
    ],
    energySaving: [
      'ENERGY STAR Ready Thermal Envelope',
      'R-40 Roof Insulation',
      'R-21 Exterior Wall Insulation',
      'R-33 Floor Joist Insulation',
      'Dual Pane Insulated Low-E Windows'
    ],
    interior: [
      'Tape & Texture Drywall Throughout with Clean Modern Corners',
      'Hardwood Cabinets Featuring Tall 42" Overhead Cabinets',
      'LED Recessed Can Lights Throughout Entire Home',
      'Ceiling Fan Prep in Living Room and Primary Bedroom',
      'Kwikset Door Hardware Throughout with Brushed Finishes'
    ],
    kitchen: [
      'SAMSUNG Stainless Steel Appliance Package (18 cu. ft. Top Freezer)',
      '36" Stainless Steel European Chimney Range Hood',
      'Pfister Faucets Throughout Featuring Brushed Nickel Pull-Down in Kitchen',
      'Garbage Disposal Wiring Option Included',
      'Hardwood Face Frames and Shelving'
    ],
    bathrooms: [
      'Full One-Piece Fiberglass Tubs and Showers',
      'Pfister Brushed Nickel Bathroom Faucets',
      'Comfort Height Vanities with Ample Storage',
      'Water-Saving Elongated Commode Fixtures'
    ],
    utilityAndHeating: [
      'Carrier High-Efficiency Forced Air Furnace',
      'ecobee Smart Programmable Thermostat',
      '200 Amp Electrical Panel Service',
      'Pre-plumbed and Pre-wired for Washer & Dryer'
    ],
    safety: [
      'Interconnected Smoke and Carbon Monoxide Detectors',
      'Kwikset Exterior Deadbolts with Thumb-Latch Security',
      'Bedrooms Equipped with Emergency Egress Sashes'
    ]
  },

  // 4. Marlette - Columbia River Collection
  'Columbia River': {
    seriesName: 'Columbia River Collection',
    manufacturer: 'Marlette',
    year: '2025/2026',
    pdfAssetPath: '/assets/aistudio/Columbia_River_59620786.pdf',
    tagline: 'Marlette Luxury Standard Features · Architectural Distinction',
    construction: [
      'Floor Joists: 2x6 on 16" o.c. (up to 13\'4" width) / 2x8 on 16" o.c. (15\' width)',
      '19/32" T&G OSB Floor Decking with 9" Set Back Frame',
      '2x6 Exterior Walls on 16" o.c. & 2x3 Interior Walls on 24" o.c.',
      'Double 2x3 Marriage Line Walls on 24" o.c.',
      '30# Roof Load on 24" o.c. Engineered Rafters',
      'Roof Pitch: 4/12 on Single Sections / Nominal 3/12 on Multi-Sections',
      'Sidewalls: 9\' Sidewalls w/ Flat Ceilings (Multi-Sections) / 8\' (Single Sections)',
      '20\' Open Faced Dormer with Board & Batt Accent Area w/ 5/4" Trim Posts (Multi-Sections)'
    ],
    exterior: [
      '3/8" LP SmartPanel Vertical Siding with Housewrap Under Siding All Around',
      '8" Cement Fascia with Painted Drip Edge to Match',
      'Architectural Shingles with Vented Ridgecap (100% of Ridgeline)',
      'SmartPanel Soffit Vented & 4" LP Window Trim',
      'Front Door: 36" 6-Panel Fiberglass w/ Peephole & Knocker',
      'Rear Door: 36" Fiberglass 9-Lite Door with Brushed Nickel Hardware',
      '16" Eaves All Around on Multi-Sections'
    ],
    energySaving: [
      'Energy Star Certified Construction',
      'White Vinyl Framed, Argon Gas Filled Low-E Windows',
      '36" x 77" Tall Windows in Main Living Areas',
      'Transom Window Over Front Door and Kitchen Window (Multi-Sections)',
      'R-38 Roof Insulation, R-19 Wall Insulation, R-33 Floor Insulation'
    ],
    interior: [
      'Orange Peel Drywall Texture with Rounded Drywall Corners',
      'Full Hardwood Cabinet System (Doors, Face Frames & Sidepanels)',
      '42" Overhead Cabinets with Crown Moulding (Multi-Sections)',
      '25 oz. Cape Cod Carpet with 8# Heavy-Duty Carpet Pad',
      'LUX Vinyl Sheet Flooring & 2" Blinds Throughout',
      '2 1/4" x 1/2" Door Casing with 2 1/2" x 3/4" Headers',
      'White Wood Window Sills with Trim in Dry Areas / Laminate in Wet Areas'
    ],
    kitchen: [
      '27.4 Cu. Ft. Side-by-Side Stainless Steel Refrigerator w/ Ice & Water in Door',
      'Smooth Top, Self-Cleaning Stainless Steel Electric Range',
      'Above-Range Stainless Steel Microwave & Energy Star Rated Dishwasher',
      'Full Tile Backsplash from Counter to Microwave Behind Range',
      'Stellen 1-Handle Pull-Down Kitchen Faucet in Stainless Steel',
      '8" Deep Stainless Steel Sink with Plumbed Icemaker Line'
    ],
    bathrooms: [
      'Weller Brushed Nickel 2-Handle Faucets & Matching Towel Bar/Tissue Holder',
      'Rectangular China Sinks with Pop-Up Drain & Raised Elongated Toilets',
      'Fiberglass 60x32 Tub/Shower with Center Drain & Power Exhaust Fan',
      'Recessed LED Lights Centered Over Sinks & Bank of Drawers in Bath #1',
      '4" Laminate Backsplash in Bathrooms and Utility'
    ],
    utilityAndHeating: [
      'Toe Kick Heat Registers in Kitchen and Both Bathrooms',
      'In-Floor Crossover Heat Duct System with Honeywell Programmable Thermostat',
      'Heat Pump / Air Conditioning Ready Electrical & Mechanical Prep',
      'Rheem 50 Gallon Electric Water Heater',
      '200 Amp Electrical Service with Two 3/4" Panel Conduits',
      'Whole House Master Water Shut-Off Valve & Hose Bibb'
    ],
    safety: [
      'Combination Carbon Monoxide and Smoke Detectors',
      'All Copper Electrical Wiring & Exterior GFI Protected Outlets',
      'Rectangular Black Lantern Exterior Lighting at All Doors'
    ]
  },

  // 5. Marlette - Imagine Series
  'Imagine': {
    seriesName: 'Imagine Standard Features',
    manufacturer: 'Marlette',
    year: '2025/2026',
    pdfAssetPath: '/assets/aistudio/Imagine_905b1d03.pdf',
    tagline: 'Marlette Practical Elegance · Smart Space Planning & Quality Built',
    construction: [
      'Floor Joists: 2x6 on 16" o.c. (12\' & 13\'4" floors) / 2x6 on 16" o.c. with 12" I-Beam (15\' floors)',
      '19/32" T&G OSB Floor Decking with 9" Setback Frame',
      '2x6 Exterior Walls on 16" o.c. & 2x3 Interior Walls on 24" o.c.',
      'Double 2x3 Marriage Line Walls on 24" o.c.',
      '8\' Sidewalls with Flat Ceilings Throughout',
      '30# Roof Load on 24" o.c. Engineered Rafters',
      'Single Section Homes = 4/12 Roof Pitch / Multi-Section = Nominal 3/12 Roof Pitch'
    ],
    exterior: [
      '3/8" LP SmartPanel Vertical Siding with Housewrap Under Siding All Around',
      '8" Cement Fascia with Painted Drip Edge to Match',
      'Architectural Fiberglass Shingles with SmartPanel Soffit Vented',
      'Vented Ridgecap (100% of Ridgeline)',
      'Front Door: 36" 6-Panel Fiberglass w/ Peephole & Knocker',
      'Rear Door: 36" 9-Lite Fiberglass w/ Brushed Nickel Knob',
      '16" Eaves All Around on Multi-Section Models'
    ],
    energySaving: [
      'Energy Star Certified Rating',
      'White Vinyl Framed, Argon Gas Low-E Insulated Windows',
      'R-38 Roof Insulation, R-19 Wall Insulation, R-33 Floor Insulation',
      'Recessed LED Lighting Package Per Electrical Print'
    ],
    interior: [
      'Orange Peel Drywall Texture with Rounded Drywall Corners',
      'Full Hardwood Cabinet System (Doors, Face Frames & Sidepanels)',
      '42" Overhead Cabinets with Flat Crown Moulding',
      'Blonde Maple Lined Base and Overhead Cabinets',
      '25 oz. Cape Cod Carpet with 5# Carpet Pad',
      'LUX Vinyl Sheet Flooring & 3 1/2" Baseboard in Vinyl Areas',
      'White Interior Doors with 3 Hinges & Brushed Nickel Door Knobs',
      'White Cased Window Wrap on All Windows'
    ],
    kitchen: [
      'Energy Star Rated 18 Cu. Ft. Stainless Steel Refrigerator w/ Ice Maker',
      'Smooth Top, Self-Cleaning Stainless Steel Electric Range',
      'Stainless Steel Vented Range Hood',
      'Stellen 1-Handle Pull-Down Stainless Steel Kitchen Faucet',
      '8" Deep Stainless Steel Kitchen Sink with Plumbed Icemaker Line',
      'Bank of Drawers in Kitchen (2 Large & 1 Small)'
    ],
    bathrooms: [
      'Drop-In Deck Tub & 60" Fiberglass Double Seat Shower w/ Framed Door in Bath #1',
      'Weller Brushed Nickel 2-Handle Faucets & Square China Sinks w/ Pop-Up',
      'Fiberglass 60x32 Tub/Shower with Center Drain in Bath #2 & #3',
      'Raised Elongated Commodes & Power Exhaust Bath Fans',
      '4" Laminate Backsplash and Sidesplash Throughout'
    ],
    utilityAndHeating: [
      'In-Floor Crossover Heat Duct System with Honeywell Programmable Thermostat',
      'Heat Pump / Air Conditioner Ready Mechanical Integration',
      'Rheem 50 Gallon Electric Water Heater',
      '200 Amp Electrical Service with Two 3/4" Conduits in Panel Box',
      'Shut-Off Valves at All Sinks and Commodes & Whole House Master Water Shut-Off'
    ],
    safety: [
      'Combination Smoke and Carbon Monoxide Detectors',
      'Exterior GFI Receptacles & Rectangular Black Lantern Exterior Lights',
      'Emergency Bedroom Egress Windows'
    ]
  },

  // 6. Marlette - Majestic Collection
  'Majestic': {
    seriesName: 'Majestic Collection',
    manufacturer: 'Marlette',
    year: '2025/2026',
    pdfAssetPath: '/assets/aistudio/Majestic_06b3e0ff.pdf',
    tagline: 'Marlette Ultra-Luxury Estate Series · Farmhouse Sink, Matte Black & Tray Ceilings',
    construction: [
      'Floor Joists: 2x6 on 16" o.c. (13\'4" width) / 2x8 on 16" o.c. (15\' width)',
      'Structural Sheathing Under Drywall on Front Door Sidewall & Marriage Lines',
      '19/32" T&G OSB Floor Decking with 9" Set Back Frame',
      '2x6 Exterior Walls on 16" o.c. & 2x4 Interior Walls on 24" o.c.',
      'Double 2x4 Marriage Line Walls on 24" o.c.',
      '9\' Sidewalls with Flat Ceilings & Two Tray Ceilings Per Print',
      'Recessed Front Entry with Composite Decking & 24\' Dormer w/ Eyebrow and Shake Accent'
    ],
    exterior: [
      'Cement Lap Siding on Front Door Sidewall / 3/8" LP Vertical Siding on 3 Walls',
      'Housewrap Under Siding All Around with 5/4 Window Trim',
      '8" Cement Fascia & Architectural Fiberglass Shingles with 100% Vented Ridgecap',
      'Front Door: 36" Craftsman Fiberglass with Matte Black Thumblatch',
      'Rear Door: 36" 9-Lite Fiberglass with Matte Black Handle',
      '16" Eaves All Around on 26\'8" and 40\' Wide Homes'
    ],
    energySaving: [
      'Energy Star Certified Luxury Build',
      'White Vinyl Framed, Argon Gas Filled Low-E Insulated Windows',
      'Transom Window Over Front Door and Kitchen Window',
      'R-38 Roof Insulation, R-19 Wall Insulation, R-33 Floor Insulation',
      'Comprehensive Recessed LED Lighting in Primary Bed (4), Secondary (2), Kitchen, Foyer & Baths'
    ],
    interior: [
      'Orange Peel Drywall Texture with Rounded Drywall Corners',
      '42" Overhead Hardwood Kitchen Cabinets with Crown Moulding & Lip Moulding',
      'Matte Black Levered Interior Door Handles & Matte Black Round Cabinet Hardware',
      'Deluxe Ballbearing Drawer Guides & Pot & Pan Pullout Shelves (1 Set)',
      '25 oz. Cape Cod Carpet with 8# Heavy-Duty Carpet Pad',
      'LUX Vinyl Sheet Flooring & 2" Blinds Throughout',
      'Utility Room Door with Cold Air Return (C.A.R.) Grill & Seat Alcove (Model Specific)',
      'Twin Overhead Laundry Cabinets with Integrated Hanging Rod'
    ],
    kitchen: [
      'Stainless Steel Apron-Front Flat Farmhouse Kitchen Sink',
      'Neera Matte Black Culinary High-Arc Kitchen Faucet',
      '27.4 Cu. Ft. Side-by-Side Stainless Steel Refrigerator w/ In-Door Ice & Water',
      'Self-Cleaning, Smooth Top Electric Range & Above-Range Microwave in Stainless Steel',
      'Energy Star Rated Stainless Steel Dishwasher & Wire/Switch for Garbage Disposal',
      'Full Designer Tile Backsplash from Counter to Overhead Behind Range',
      'Furniture-Style Kitchen Island (Model Specific)'
    ],
    bathrooms: [
      '60" Fiberglass Double Seat Shower with Frameless Glass Door in Bath #1',
      'Drop-In Deck Soaking Tub with Dedicated Accent Window Over Tub',
      'Weller Matte Black 2-Handle Faucets with Matching Matte Black Towel Bar & Tissue Holder',
      'Wood Framed Mirrors & Rectangular China Sinks with Pop-Up Drains',
      'Raised Elongated Stools & Power Exhaust Fans with Recessed LED Over Sinks',
      'Designer Tile Backsplash in Bathrooms & Utility'
    ],
    utilityAndHeating: [
      'Toe Kick Heat Registers in Kitchen and Bathrooms with In-Floor Crossover Duct System',
      'Honeywell Programmable Thermostat & Heat Pump / AC Ready Mechanicals',
      'Rheem 50 Gallon Electric Water Heater',
      '200 Amp Electrical Service with Two 3/4" Conduits in Panel Box',
      'Deep Utility Sink (Model Specific) & Plumbed/Wired for Washer/Dryer',
      'Master Water Shut-Off Valve & Shut-Off Valves Throughout'
    ],
    safety: [
      'Combination Smoke & Carbon Monoxide Detectors',
      '3-Way Light Switches in Kitchen, Utility, and Hallways',
      'Recessed LED Lighting at Front Entry & Matte Black Exterior Fixtures',
      'GFI Outlets at All Wet Areas'
    ]
  }
};

/**
 * Resolves standard specifications for any given home based on its series or manufacturer.
 */
export function getSeriesStandards(seriesName?: string, manufacturer?: string): SeriesStandardSpec {
  if (seriesName && SERIES_STANDARDS[seriesName]) {
    return SERIES_STANDARDS[seriesName];
  }

  // Fallbacks by manufacturer
  if (seriesName?.toLowerCase().includes('silver')) return SERIES_STANDARDS['Dream Silver'];
  if (seriesName?.toLowerCase().includes('gold') || seriesName?.toLowerCase().includes('inspiration')) return SERIES_STANDARDS['Inspiration Gold'];
  if (seriesName?.toLowerCase().includes('tempo')) return SERIES_STANDARDS['Tempo'];
  if (seriesName?.toLowerCase().includes('columbia')) return SERIES_STANDARDS['Columbia River'];
  if (seriesName?.toLowerCase().includes('imagine')) return SERIES_STANDARDS['Imagine'];
  if (seriesName?.toLowerCase().includes('majestic')) return SERIES_STANDARDS['Majestic'];

  if (manufacturer === 'Marlette') return SERIES_STANDARDS['Columbia River'];
  if (manufacturer === 'Clayton Homes') return SERIES_STANDARDS['Tempo'];
  
  // Default to Golden West Dream Silver
  return SERIES_STANDARDS['Dream Silver'];
}
