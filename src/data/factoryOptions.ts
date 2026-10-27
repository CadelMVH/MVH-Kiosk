/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official 2026 Options and Décor Matrix for Mountain View Homes of Bremerton
 * Grounded in:
 * - 2026 Option Pages (Golden West / Clayton Built / Marlette)
 * - Clayton Hermiston Décor Matrix (1/27/2026)
 * - Master Pricing List (10/1/2026)
 */

export interface OptionItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  badge?: string;
  swatchHex?: string;
  specDetails?: string;
}

export const DECOR_MATRIX = {
  hardwoodCabinets: [
    { id: 'cab-white', name: 'White Shaker', swatch: '#F8F9FA', desc: 'Crisp factory painted white hardwood' },
    { id: 'cab-sunny-valley', name: 'Sunny Valley', swatch: '#D8C3A5', desc: 'Warm natural honey blonde tone' },
    { id: 'cab-club-oak-grey', name: 'Club Oak Grey', swatch: '#7D7F7D', desc: 'Contemporary driftwood grey stain' },
    { id: 'cab-onyx', name: 'Onyx Black', swatch: '#1F2022', desc: 'Dramatic matte obsidian finish' },
    { id: 'cab-rustic-hickory', name: 'Rustic Hickory', swatch: '#A07855', desc: 'Natural grain with rich knot character' },
    { id: 'cab-hazelnut', name: 'Hazelnut', swatch: '#8D5B4C', desc: 'Rich amber chestnut hardwood' },
  ],

  cabinetHardware: [
    { id: 'hw-bn-knob', name: 'Brushed Nickel Round Knob', finish: 'Brushed Nickel', price: 0 },
    { id: 'hw-bn-pull', name: 'Brushed Nickel Square Pull', finish: 'Brushed Nickel', price: 0 },
    { id: 'hw-mb-knob', name: 'Matte Black Round Knob', finish: 'Matte Black', price: 43 },
    { id: 'hw-mb-pull', name: 'Matte Black Square Pull', finish: 'Matte Black', price: 75 },
    { id: 'hw-bb-egg', name: 'Brushed Brass Egg Knob', finish: 'Brushed Brass', price: 75 },
    { id: 'hw-bb-pull', name: 'Brushed Brass Square Pull', finish: 'Brushed Brass', price: 125 },
  ],

  countertops: [
    { id: 'ct-sierra', name: 'Sierra Cascade (Laminate)', type: 'Laminate', price: 0, desc: 'Factory standard durable laminate with crescent edge' },
    { id: 'ct-carrara', name: 'White Carrara (Laminate)', type: 'Laminate', price: 50, desc: 'Classic Italian marble veining' },
    { id: 'ct-soapstone', name: 'Terrena Soapstone (Laminate)', type: 'Laminate', price: 50, desc: 'Deep charcoal textured soapstone' },
    { id: 'ct-portoro', name: 'Portoro (Laminate)', type: 'Laminate', price: 50, desc: 'Dramatic black marble with gold veining' },
    { id: 'ct-paladina', name: 'Grey Paladina (Laminate)', type: 'Laminate', price: 50, desc: 'Soft mist grey granite pattern' },
    { id: 'ct-bellavati-prestwick', name: 'Prestwick Solid Surface / Quartz', type: 'Quartz', price: 1850, desc: '3cm non-porous quartz with 4" matching splash and polished flat edge' },
    { id: 'ct-bellavati-argon', name: 'Argon Bellavati Quartz', type: 'Quartz', price: 1850, desc: 'Warm ivory with subtle pearl veining' },
    { id: 'ct-bellavati-haven', name: 'Haven Bellavati Quartz', type: 'Quartz', price: 1850, desc: 'Pure snowy quartz with soft grey undertones' },
  ],

  vinylFlooringLux: [
    { id: 'vnl-lx311', name: 'LX 311 - Aged European Oak', tone: 'Medium Warm', desc: 'Commercial-grade luxury vinyl plank with embossed grain' },
    { id: 'vnl-lx275', name: 'LX 275 - Vintage White', tone: 'Light Coastal', desc: 'Bleached coastal white oak finish' },
    { id: 'vnl-lx324', name: 'LX 324 - Nordic White', tone: 'Scandinavian Light', desc: 'Clean minimalist pale blonde grain' },
    { id: 'vnl-lx350', name: 'LX 350 - Dusty Acorn', tone: 'Warm Earth', desc: 'Rich northwestern forest acorn brown' },
    { id: 'vnl-lx277', name: 'LX 277 - Greige', tone: 'Neutral Greige', desc: 'Popular designer balanced grey-beige' },
    { id: 'vnl-lx365', name: 'LX 365 - Natural Slate Charcoal', tone: 'Dark Slate', desc: 'Textured stone tile look with warmth' },
  ],

  carpetShaw: [
    { id: 'cpt-canyon', name: 'Cape Cod 25 oz. - Canyon Cove', spec: '25 oz. FHA Certified w/ 5.3# Rebond Pad', price: 0 },
    { id: 'cpt-silversmith', name: 'Cape Cod 25 oz. - Silversmith', spec: '25 oz. FHA Certified w/ 5.3# Rebond Pad', price: 0 },
    { id: 'cpt-coffee-bean', name: 'Cape Cod 25 oz. - Coffee Bean', spec: '25 oz. FHA Certified w/ 5.3# Rebond Pad', price: 0 },
    { id: 'cpt-truespirit-liberty', name: 'True Spirit 39 oz. - Lady Liberty', spec: 'Heavy 39 oz. Plush w/ 7# High-Density Rebond Pad', price: 822 },
    { id: 'cpt-truespirit-concrete', name: 'True Spirit 39 oz. - Concrete', spec: 'Heavy 39 oz. Plush w/ 7# High-Density Rebond Pad', price: 822 },
    { id: 'cpt-truespirit-truffle', name: 'True Spirit 39 oz. - Truffle', spec: 'Heavy 39 oz. Plush w/ 7# High-Density Rebond Pad', price: 822 },
  ],

  interiorPaintSW: [
    { id: 'pt-greek-villa', name: 'SW 7551 - Greek Villa (Flat)', swatch: '#F0ECE1', desc: 'Warm, soft off-white without yellow undertones' },
    { id: 'pt-knitting-needles', name: 'SW 7672 - Knitting Needles (Eggshell)', swatch: '#CDC8BE', desc: 'Refined silver-grey with subtle sheen' },
    { id: 'pt-shiitake', name: 'SW 9173 - Shiitake (Eggshell)', swatch: '#CEC4B4', desc: 'Cozy modern greige neutral' },
  ],

  exteriorPaintSW: [
    { id: 'ext-billiard-green', name: 'SW 0016 - Billiard Green', swatch: '#20392C', desc: 'Deep Pacific Northwest evergreen' },
    { id: 'ext-crabby-apple', name: 'SW 7592 - Crabby Apple', swatch: '#7D322B', desc: 'Rustic heritage barn red' },
    { id: 'ext-french-roast', name: 'SW 6069 - French Roast', swatch: '#3E322A', desc: 'Rich dark espresso cedar' },
    { id: 'ext-warm-stone', name: 'SW 7032 - Warm Stone', swatch: '#877B6F', desc: 'Earthy Olympic boulder tan' },
    { id: 'ext-attitude-gray', name: 'SW 7060 - Attitude Gray', swatch: '#70746F', desc: 'Cool mountain slate gray' },
    { id: 'ext-pure-white', name: 'SW 7005 - Pure White', swatch: '#F2F1EC', desc: 'Timeless crisp craftsman white' },
    { id: 'ext-proper-gray', name: 'SW 6003 - Proper Gray', swatch: '#938B82', desc: 'Soft elegant neutral gray' },
    { id: 'ext-urbane-bronze', name: 'SW 7048 - Urbane Bronze', swatch: '#45423C', desc: 'Sherwin-Williams Color of the Year deep bronze' },
    { id: 'ext-greenblack', name: 'SW 6994 - Greenblack', swatch: '#2B312E', desc: 'Ultra-modern dark forest charcoal' },
    { id: 'ext-cornwall-slate', name: 'SW 9131 - Cornwall Slate', swatch: '#687271', desc: 'Coastal Puget Sound slate blue-grey' },
  ],

  roofing: [
    { id: 'roof-shingle-charcoal', name: 'GAF Timberline HDZ - Charcoal', type: 'Shingle', price: 0, desc: 'Lifetime architectural shingles with WindProven warranty' },
    { id: 'roof-shingle-weathered', name: 'GAF Timberline HDZ - Weathered Wood', type: 'Shingle', price: 0, desc: 'Warm dimensional cedar-look architectural shingles' },
    { id: 'roof-shingle-shakewood', name: 'GAF Timberline HDZ - Shakewood', type: 'Shingle', price: 0, desc: 'Rich earthtone shake profile' },
    { id: 'roof-metal-sandstone', name: 'Architectural Standing-Seam Metal - Sandstone Beige', type: 'Metal', price: 2850, desc: '50-year commercial standing seam metal roof' },
    { id: 'roof-metal-green', name: 'Architectural Standing-Seam Metal - Pine Green', type: 'Metal', price: 2850, desc: 'Forest green heavy-gauge standing seam metal' },
    { id: 'roof-metal-red', name: 'Architectural Standing-Seam Metal - Barn Red', type: 'Metal', price: 2850, desc: 'Classic Northwest heritage metal roof' },
  ],
};

// Official 2026 Option Pages Packages & Pricing
export const FACTORY_UPGRADE_PACKAGES = {
  exteriorPackages: [
    {
      id: 'ext-std',
      name: 'Factory Standard Exterior',
      price: 0,
      description: 'Standard 4" window trim, 3:12/4:12 roof pitch, LP SmartSide siding with 5/50 year warranty, front & rear porch lights.',
      badge: 'Included'
    },
    {
      id: 'ext-residential',
      name: 'Residential Exterior Package',
      price: 1616,
      description: '8\' 9:12 architectural gable w/ extended eaves, (2) 8" traditional columns on front sidewall, lap siding between columns, (2) coach lights at front door, decorative shutters, and 5/4 window trim.',
      badge: 'Popular Upgrade'
    },
    {
      id: 'ext-craftsman',
      name: 'Craftsman Architectural Package',
      price: 2495,
      description: 'Dual 9:12 architectural gables with box-out eaves, (8) rows lap siding on front elevation, vertical board & batten accent in gables, recessed entryway, and 5/4 heavy window surrounds.',
      badge: 'Best Seller'
    },
    {
      id: 'ext-shady-cove',
      name: 'Shady Cove Luxury Package',
      price: 3850,
      description: 'Large double gable system, authentic stacked stone wainscot accents, 14" extended Northwest overhang eaves, 4-board artisan shutters, and factory painted designer entry door.',
      badge: 'Premium Facade'
    }
  ],

  appliancePackages: [
    {
      id: 'app-std',
      name: 'Factory Standard Appliance Package',
      price: 0,
      description: 'Frigidaire 18 cu. ft. top-freezer refrigerator in stainless steel, 30" smooth top self-cleaning range, and ice maker water line.',
      badge: 'Included'
    },
    {
      id: 'app-gourmet-elec',
      name: '"Gourmet" Electric Stainless Package',
      price: 1926,
      description: 'Samsung 22 cu. ft. counter-depth French door refrigerator w/ ice & water, smooth top self-clean range w/ air fry convection, 1.6 cu. ft. microwave rangehood, and 24" quiet stainless dishwasher.',
      badge: 'Most Popular'
    },
    {
      id: 'app-gourmet-gas',
      name: '"Gourmet" Gas Stainless Package',
      price: 2022,
      description: 'Samsung 22 cu. ft. counter-depth refrigerator w/ ice & water, 5-burner gas convection range w/ air fry & griddle, microwave rangehood, and 24" stainless dishwasher.',
      badge: 'Gas Enthusiast'
    },
    {
      id: 'app-chefs-elec',
      name: '"The Chef\'s" Ultimate Electric Package',
      price: 2799,
      description: 'Huge 32 cu. ft. Samsung French door refrigerator w/ bottom freezer & dual ice makers, 5-burner smooth top convection range, 2.1 cu. ft. 5-speed microwave hood, and 3rd-rack hidden control dishwasher.',
      badge: 'Chef Tier'
    },
    {
      id: 'app-chefs-gas',
      name: '"The Chef\'s" Ultimate Gas Package',
      price: 2901,
      description: 'Huge 32 cu. ft. Samsung French door refrigerator, high-output commercial style 5-burner gas range w/ non-stick cast iron griddle, 2.1 cu. ft. microwave, and ultra-quiet 3rd-rack dishwasher.',
      badge: 'Executive Tier'
    }
  ],

  bathroomPackages: [
    {
      id: 'bath-std',
      name: 'Factory Standard Bath Suite',
      price: 0,
      description: '60" 1-piece fiberglass tub/shower, elongated comfort-height toilets, dual-lever chrome faucets, and 36" vanity cabinets.',
      badge: 'Included'
    },
    {
      id: 'bath-oval-glamour',
      name: 'Glamour Bath w/ 60" Oval Drop-In Tub',
      price: 1850,
      description: 'Separate 60" oval deep soaking tub, window over tub, fiberglass walk-in shower stall, and dual lavy sinks.',
      badge: 'Soaking Tub'
    },
    {
      id: 'bath-permalux-72',
      name: 'Glamour Bath w/ 72" Permalux Soaking Tub',
      price: 2350,
      description: 'Expansive 72" Permalux luxury garden soaking tub, oversized glass shower, and vanity drawer bank.',
      badge: '72" Garden Tub'
    },
    {
      id: 'bath-freestanding-59',
      name: 'Spa Bath w/ 59" Freestanding Acrylic Tub',
      price: 4100,
      description: 'Modern 59" freestanding soaking tub, floor-mounted gooseneck filler, separate shower stall, and wood-framed mirrors.',
      badge: 'Modern Luxury'
    },
    {
      id: 'bath-ceramic-tile-shower',
      name: '60"x42" Hand-Laid Ceramic Tile Shower',
      price: 4350,
      description: 'Custom 60"x42" ceramic tile shower to ceiling, fiberglass pan, accent tile mosaic niche, and sliding barn door shower door.',
      badge: 'Hand-Laid Tile'
    },
    {
      id: 'bath-spa-ceramic-72',
      name: '72"x48" Super Spa Ceramic Shower w/ Bench',
      price: 5450,
      description: 'Massive 72"x48" spa ceramic tile shower, half glass architectural wall, built-in tiled shaving bench, dual showerheads, and rain head.',
      badge: 'Ultimate Spa'
    },
    {
      id: 'bath-palisade-niche',
      name: '60"x42" Palisade Stone Shower w/ Niche',
      price: 2750,
      description: 'Low-maintenance waterproof interlocking Palisade marble-look shower with integrated shampoo niche and clear glass enclosure.',
      badge: 'Easy Clean'
    }
  ],

  interiorTreatmentPackages: [
    {
      id: 'int-std',
      name: 'Factory Standard Interior Trim',
      price: 0,
      description: 'Tape & texture drywall throughout, square sheetrock corners, brocade ceilings, and standard door moldings.',
      badge: 'Included'
    },
    {
      id: 'int-dream-treatment',
      name: 'Dream Treatment Trim Package',
      price: 550,
      description: '4" ceiling crown moulding in living areas, 4" laminate splash in kitchen and baths, drawer over door kitchen cabinets, and overhead crown moulding.',
      badge: 'Value Pack'
    },
    {
      id: 'int-dream-deluxe',
      name: 'Dream Deluxe Architectural Trim Package',
      price: 5208,
      description: 'Full 9\' sidewall ceilings throughout, 52" tall overhead kitchen cabinets, built-in dishwasher, wood trimmed vanity mirrors, bank of drawers in both baths, 2-1/4" baseboards, and whole-house mini blinds.',
      badge: 'Complete Upgrade'
    }
  ],

  fireplaces: [
    {
      id: 'fp-none',
      name: 'No Fireplace (Open Wall Space)',
      price: 0,
      description: 'Full open wall space ideal for custom entertainment centers or art display.',
      badge: 'Included'
    },
    {
      id: 'fp-electric-ceramic',
      name: 'Electric Fireplace w/ Ceramic Surround',
      price: 1761,
      description: 'Modern clean-burning electric fireplace with multi-color LED flame settings, built-in heater, and ceramic tile surround.',
      badge: 'Clean Electric'
    },
    {
      id: 'fp-electric-palisade',
      name: 'Electric Fireplace w/ Palisade to Ceiling',
      price: 1824,
      description: 'Full floor-to-ceiling Palisade marble-look feature wall with recessed electric fireplace and TV conduit prep.',
      badge: 'Floor to Ceiling'
    },
    {
      id: 'fp-wood-stacked-stone',
      name: 'Stacked Stone Wood Burning Fireplace',
      price: 1937,
      description: 'Authentic wood-burning fireplace with dry-stack stone facade, custom cabinet-match mantel, and ceramic tile hearth.',
      badge: 'Real Wood'
    },
    {
      id: 'fp-gas-stacked-stone',
      name: 'Stacked Stone Gas Fireplace',
      price: 2722,
      description: 'Direct-vent high-efficiency gas fireplace with realistic ceramic birch logs, wall thermostat switch, and dry-stack stone to ceiling.',
      badge: 'Instant Gas Heat'
    },
    {
      id: 'fp-wood-stove-hud',
      name: 'HUD-Approved Cast Iron Wood Stove',
      price: 6563,
      description: 'Heavy cast-iron wood stove certified for manufactured home installations with custom stone backer wall and fireproof hearth.',
      badge: 'Cabin Warmth'
    }
  ],

  energyAndUtilities: [
    {
      id: 'nrg-std',
      name: 'Pacific Northwest Thermal Zone Energy Specs',
      price: 0,
      description: 'R-33 floor insulation, R-21 exterior wall insulation, R-40 ceiling insulation, dual-pane Low-E vinyl windows, and EcoBee smart thermostat.',
      badge: 'Included'
    },
    {
      id: 'nrg-neem-plus',
      name: 'NEEM+ (2.0) Northwest Energy Star Certification',
      price: 5353,
      description: 'Ultra-efficient certified high-performance energy package with air sealing, advanced heat pump testing, and lowest monthly electric bills.',
      badge: 'Energy Star'
    },
    {
      id: 'nrg-gas-package',
      name: 'Complete Gas Home Package',
      price: 2807,
      description: 'High-efficiency gas forced-air downflow furnace, gas water heater, gas range hookup, and 200-amp electrical panel.',
      badge: 'Gas Conversion'
    },
    {
      id: 'nrg-r52-ceiling',
      name: 'R-52 High-Density Ceiling Insulation',
      price: 1152,
      description: 'Replaces standard R-40 ceiling insulation with heavy R-52 blown insulation for maximum winter heat retention in Pacific Northwest climates.',
      badge: 'Max Thermal'
    },
    {
      id: 'nrg-generator-ready',
      name: 'Generator-Ready Transfer Switch & Hookup',
      price: 1326,
      description: 'Dedicated exterior generator inlet receptacle, interlock circuit breaker, and sub-panel wiring for backup storm power.',
      badge: 'Storm Ready'
    },
    {
      id: 'nrg-solar-prep',
      name: 'Solar Panel Ready Roof & Chase Conduit',
      price: 285,
      description: 'Factory-installed roof penetration chase and dedicated electrical conduit to main breaker panel for future rooftop solar install.',
      badge: 'Solar Ready'
    }
  ],

  entryDoors: [
    {
      id: 'door-std',
      name: 'Standard 36"x80" Steel Inswing Door w/ Deadbolt',
      price: 0,
      description: 'Insulated steel core front entry door with deadbolt lock.',
      badge: 'Included'
    },
    {
      id: 'door-double-french',
      name: 'Double French Doors w/ Internal Mini Blinds',
      price: 1906,
      description: 'Full-lite double French patio doors with tempered glass and dust-free internal tilt mini-blinds.',
      badge: 'Dual French'
    },
    {
      id: 'door-craftsman',
      name: 'Craftsman Entry Door w/ Shelf & Deadbolt',
      price: 700,
      description: 'Craftsman 3-lite top grid with dental shelf detail and heavy-duty deadbolt.',
      badge: 'Craftsman Style'
    },
    {
      id: 'door-frosted-oval',
      name: 'GW-3 Nicholas Frosted Oval Glass Door',
      price: 805,
      description: 'Decorative beveled frosted oval glass front door providing privacy and natural illumination.',
      badge: 'Decorative Glass'
    },
    {
      id: 'door-sliding-glass',
      name: '72"x80" Sliding Glass Patio Door w/ Blinds',
      price: 734,
      description: 'Energy-smart dual pane sliding glass door with factory vertical blind.',
      badge: 'Patio Slider'
    },
    {
      id: 'door-barn-interior',
      name: 'Solid Core Grey Barn Door w/ Black Hardware (Interior)',
      price: 1018,
      description: 'Modern sliding solid-core timber barn door with matte black roller track for primary bedroom or den.',
      badge: 'Barn Door'
    }
  ]
};
