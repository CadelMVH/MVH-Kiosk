/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientLeadDossier, AiQueryResult, AiChatMessage } from '../types';

interface ProcessQueryParams {
  query: string;
  history?: AiChatMessage[];
  dossier?: ClientLeadDossier;
  catalog: any[];
}

/**
 * Extracts and updates client profile & consultation notes from ongoing dialogue.
 */
export function extractClientDossier(
  query: string,
  history: AiChatMessage[] = [],
  existing?: ClientLeadDossier,
  matchedPlan?: any
): ClientLeadDossier {
  const dossier: ClientLeadDossier = {
    clientName: existing?.clientName,
    phone: existing?.phone,
    email: existing?.email,
    targetBudget: existing?.targetBudget,
    propertyStatus: existing?.propertyStatus,
    propertyLocation: existing?.propertyLocation,
    bedroomsNeeded: existing?.bedroomsNeeded,
    bathroomsNeeded: existing?.bathroomsNeeded,
    desiredSections: existing?.desiredSections,
    preferredManufacturer: existing?.preferredManufacturer,
    preferredSeries: existing?.preferredSeries,
    timeline: existing?.timeline,
    financingType: existing?.financingType,
    mustHaveFeatures: existing?.mustHaveFeatures ? [...existing.mustHaveFeatures] : [],
    interestedPlanNames: existing?.interestedPlanNames ? [...existing.interestedPlanNames] : [],
    notes: existing?.notes ? [...existing.notes] : [],
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const lower = query.toLowerCase();

  // 1. Detect Client Name
  const nameMatch = query.match(/(?:my name is|i am|i'm|call me|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1] && !['looking', 'interested', 'ready', 'here', 'wondering', 'hoping'].includes(nameMatch[1].toLowerCase())) {
    dossier.clientName = nameMatch[1].trim();
    if (!dossier.notes.some(n => n.startsWith('Client Name:'))) {
      dossier.notes.push(`Client Name: ${dossier.clientName}`);
    }
  }

  // 2. Detect Phone Number
  const phoneMatch = query.match(/(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) {
    dossier.phone = phoneMatch[0].trim();
    if (!dossier.notes.some(n => n.startsWith('Phone:'))) {
      dossier.notes.push(`Phone: ${dossier.phone}`);
    }
  }

  // 3. Detect Email
  const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    dossier.email = emailMatch[0].trim();
    if (!dossier.notes.some(n => n.startsWith('Email:'))) {
      dossier.notes.push(`Email: ${dossier.email}`);
    }
  }

  // 4. Detect Property / Location
  const cities = ['poulsbo', 'port orchard', 'bremerton', 'belfair', 'silverdale', 'kingston', 'bainbridge', 'seabeck', 'allyn', 'shelton', 'gig harbor'];
  for (const city of cities) {
    if (lower.includes(city)) {
      const capCity = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      dossier.propertyLocation = capCity;
      if (!dossier.notes.some(n => n.includes(capCity))) {
        dossier.notes.push(`Location / Area of Interest: ${capCity}`);
      }
      break;
    }
  }

  if (lower.includes('own land') || lower.includes('have land') || lower.includes('own property') || lower.includes('my property') || lower.includes('acres') || lower.includes('our lot') || lower.includes('my parcel')) {
    dossier.propertyStatus = 'Owns private land/parcel';
    if (!dossier.notes.some(n => n.includes('private property'))) {
      dossier.notes.push('Owns private property ready for installation');
    }
  } else if (lower.includes('park') || lower.includes('community') || lower.includes('leased land')) {
    dossier.propertyStatus = 'Manufactured home community / Park';
  } else if (lower.includes('looking for land') || lower.includes('need land') || lower.includes('buying land')) {
    dossier.propertyStatus = 'Shopping for land / lot';
  }

  // 5. Detect Bedrooms & Bathrooms
  if (lower.includes('5 bed') || lower.includes('5-bed') || lower.includes('5 bedroom') || lower.includes('five bed')) {
    dossier.bedroomsNeeded = 5;
  } else if (lower.includes('4 bed') || lower.includes('4-bed') || lower.includes('4 bedroom') || lower.includes('four bed')) {
    dossier.bedroomsNeeded = 4;
  } else if (lower.includes('3 bed') || lower.includes('3-bed') || lower.includes('3 bedroom') || lower.includes('three bed')) {
    dossier.bedroomsNeeded = 3;
  } else if (lower.includes('2 bed') || lower.includes('2-bed') || lower.includes('2 bedroom') || lower.includes('two bed')) {
    dossier.bedroomsNeeded = 2;
  } else if (lower.includes('1 bed') || lower.includes('1-bed') || lower.includes('single bed') || lower.includes('adu') || lower.includes('casita')) {
    dossier.bedroomsNeeded = 1;
  }

  if (lower.includes('3 bath') || lower.includes('three bath')) {
    dossier.bathroomsNeeded = 3;
  } else if (lower.includes('2 bath') || lower.includes('2.5 bath') || lower.includes('two bath')) {
    dossier.bathroomsNeeded = 2;
  } else if (lower.includes('1 bath') || lower.includes('one bath')) {
    dossier.bathroomsNeeded = 1;
  }

  // 6. Detect Budget
  const budgetMatch = query.match(/(?:\$|budget\s*(?:of|is)?\s*)\s*(\d{2,3}(?:,\d{3})*(?:k|000)?)/i);
  if (budgetMatch) {
    let raw = budgetMatch[1].toLowerCase().replace(/,/g, '');
    let num = raw.includes('k') ? parseInt(raw.replace('k', ''), 10) * 1000 : parseInt(raw, 10);
    if (!isNaN(num) && num > 20000) {
      dossier.targetBudget = `$${num.toLocaleString()}`;
      if (!dossier.notes.some(n => n.startsWith('Target Budget:'))) {
        dossier.notes.push(`Target Budget: ${dossier.targetBudget}`);
      }
    }
  }

  // 7. Detect Must-Have Features
  const featureKeywords: Record<string, string> = {
    'island': 'Gourmet Kitchen Island',
    'pantry': 'Walk-In Pantry',
    'porch': 'Front Covered Porch',
    'tub': 'Free-Standing Soaking Tub',
    'walk-in shower': 'Walk-In Tile Shower',
    'tile shower': 'Walk-In Tile Shower',
    'heat pump': 'Energy Star Heat Pump HVAC',
    'zerh': 'Zero Energy Ready Home (ZERH)',
    'crawlspace': 'Load-Bearing Crawlspace Foundation',
    'fireplace': 'Fireplace Package',
    'farmhouse': 'Farmhouse Sink & Trim',
    'open concept': 'Open Great Room Layout',
    'double wide': 'Multi-Section Double Wide',
    'single wide': 'Single Wide Section',
    'adu': 'Accessory Dwelling Unit (ADU)'
  };

  for (const [kw, label] of Object.entries(featureKeywords)) {
    if (lower.includes(kw) && !dossier.mustHaveFeatures.includes(label)) {
      dossier.mustHaveFeatures.push(label);
    }
  }

  // 8. Track Interested Models
  if (matchedPlan?.name && !dossier.interestedPlanNames.includes(matchedPlan.name)) {
    dossier.interestedPlanNames.push(matchedPlan.name);
  }

  // 9. Generate Concise Consultation Summary for Sales Agents
  const parts: string[] = [];
  parts.push(dossier.clientName ? `Client ${dossier.clientName}` : 'Showroom Guest');
  if (dossier.propertyLocation) parts.push(`in ${dossier.propertyLocation}`);
  if (dossier.propertyStatus) parts.push(`(${dossier.propertyStatus})`);
  if (dossier.bedroomsNeeded) parts.push(`Looking for ${dossier.bedroomsNeeded}-bed / ${dossier.bathroomsNeeded || 2}-bath`);
  if (dossier.targetBudget) parts.push(`Target budget ${dossier.targetBudget}`);
  if (dossier.mustHaveFeatures.length > 0) parts.push(`Wishlist: ${dossier.mustHaveFeatures.slice(0, 3).join(', ')}`);
  if (dossier.interestedPlanNames.length > 0) parts.push(`Favorited: ${dossier.interestedPlanNames.slice(-2).join(', ')}`);

  dossier.consultationSummary = parts.join('. ') + '.';

  return dossier;
}

/**
 * Intelligent domain reasoning engine for Mountain View Homes of Bremerton.
 * Synthesizes:
 * - 145 Floorplans and 69 3D Virtual Tours
 * - Clayton Albany Homeowner's Manual (Warranties, Systems, Ventilation, Care)
 * - Site Construction Manual 2025 (Site Prep, Foundations, Crawlspaces, Crossovers)
 * - Zero Energy Ready Home (ZERH v1) & Energy Star specifications
 * - Directives: Never introduce yourself. Directly answer questions and reason about client requirements.
 */
export function statefulHomerEngine({
  query,
  history = [],
  dossier,
  catalog
}: ProcessQueryParams): AiQueryResult {
  const lower = query.toLowerCase();

  // 1. View / Gallery Navigation Actions
  if (lower.includes('slideshow') || lower.includes('screensaver')) {
    return {
      conversationalResponse: "Starting the showroom fullscreen slideshow featuring real homes built and installed across Kitsap and Mason County.",
      action: 'open_slideshow',
      navigationTarget: 'slideshow',
      clientDossier: extractClientDossier(query, history, dossier)
    };
  }

  if (
    lower.includes('built home') || 
    lower.includes('homes we have built') || 
    lower.includes('homes you have built') ||
    lower.includes("homes you've built") ||
    lower.includes("homes built") ||
    lower.includes('past project') || 
    lower.includes('portfolio') || 
    lower.includes('gallery') ||
    (lower.includes('built') && (lower.includes('photo') || lower.includes('picture') || lower.includes('show')))
  ) {
    return {
      conversationalResponse: "Opening our photo portfolio of **12 real homes built and installed** in Bremerton, Poulsbo, Port Orchard, and across the Olympic Peninsula.",
      action: 'open_built_homes',
      navigationTarget: 'built-homes',
      clientDossier: extractClientDossier(query, history, dossier)
    };
  }

  // 2. Sales Specialist Consultation & Appointment Hand-Off
  if (
    lower.includes('speak with') || 
    lower.includes('talk to') || 
    lower.includes('sales rep') || 
    lower.includes('sales agent') || 
    lower.includes('consultant') || 
    lower.includes('appointment') || 
    lower.includes('waitlist') || 
    lower.includes('meet someone') ||
    lower.includes('ready to buy') ||
    lower.includes('finance') ||
    lower.includes('apply')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    const summary = updatedDossier.consultationSummary || 'Guest ready for showroom consultation';

    return {
      conversationalResponse: `Connecting you with our sales desk right now. I have summarized your preferences into a consultation brief so our design specialist has all your requirements ready.\n\n• **Client Summary:** ${summary}\n\nPlease confirm your name and phone number on screen to be greeted immediately.`,
      action: 'schedule_appointment',
      clientDossier: updatedDossier,
      followUpPrompt: "Please verify your contact details so our specialist can step over."
    };
  }

  // 3. Site Preparation, Grading, and Foundation Engineering (from Site Construction Manual 2025)
  if (
    lower.includes('site prep') || 
    lower.includes('grading') || 
    lower.includes('drainage') || 
    lower.includes('crawlspace') || 
    lower.includes('footing') || 
    lower.includes('frost line') ||
    lower.includes('pier') ||
    lower.includes('anchor') ||
    lower.includes('foundation') ||
    lower.includes('soil')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    return {
      conversationalResponse: `Here are our certified engineering requirements for site preparation and foundations:\n\n• **Site Grading & Drainage:** Ground must be graded with a minimum slope of **5 inches within the first 10 feet** away from the home perimeter to prevent water ponding under the crawlspace.\n• **Foundation Types:**\n  - **Load-Bearing Perimeter Crawlspace:** Continuous concrete strip footing or poured slab with 2x6 or 2x10 pressure-treated sill plates bolted to the foundation wall and recessed frame.\n  - **Pier & Ground Anchor:** Engineered concrete block piers on 4" precast or poured footings, secured with 3,150 lb rated soil anchors and stabilizer plates.\n• **Frost Depth:** Footings must be placed below the local design frost depth (12"–18" across the Puget Sound region).\n• **Moisture Barrier & Ventilation:** A **6-mil continuous polyethylene ground vapor barrier** overlapping 12" is required, paired with crawlspace skirting providing 1 sq ft of free ventilation per 1,500 sq ft of floor area equipped with rodent-proof operable dampers.\n\n*Would you like to review specific models that fit your parcel, or schedule a free site consultation?*`,
      action: 'general_advice',
      clientDossier: updatedDossier,
      followUpPrompt: "Do you have a specific property parcel you are planning to build on?"
    };
  }

  // 4. Energy Efficiency & Zero Energy Ready Home (ZERH v1 / Energy Star)
  if (
    lower.includes('energy') || 
    lower.includes('insulation') || 
    lower.includes('zerh') || 
    lower.includes('heat pump') || 
    lower.includes('hvac') || 
    lower.includes('duct') || 
    lower.includes('r-value') ||
    lower.includes('thermal') ||
    lower.includes('ventilation') ||
    lower.includes('window')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    return {
      conversationalResponse: `Our homes are built to exceed Pacific Northwest climate demands with **Zero Energy Ready Home (ZERH v1)** and **Energy Star** specifications:\n\n• **Thermal Envelope:** Advanced high-efficiency insulation with **R-38 in ceilings**, **R-21 in exterior 2x6 walls**, and **R-22 in floors**.\n• **Heating & Cooling:** High-efficiency ducted heat pumps providing whisper-quiet heating and summer air conditioning.\n• **Hybrid Water Heating:** Energy-efficient heat pump water heaters with dedicated drain pan and exterior T/P relief lines.\n• **Continuous Air Quality:** HUD Code 24 CFR 3280 compliant **Whole-House Ventilation System** providing balanced fresh air exchanges without thermal loss.\n• **Windows & Sealing:** Low-E argon insulated vinyl windows and continuous non-porous marriage wall gaskets on all multi-section sets.\n\n*Would you like to step inside one of our 3D walkthroughs to see these energy-efficient layouts?*`,
      action: 'general_advice',
      clientDossier: updatedDossier,
      followUpPrompt: "Would you like me to filter for our most energy-efficient double-wide models?"
    };
  }

  // 5. Warranty & Construction Quality (from Clayton Albany Homeowner's Manual)
  if (
    lower.includes('warranty') || 
    lower.includes('defect') || 
    lower.includes('guarantee') || 
    lower.includes('maintenance') || 
    lower.includes('albany') || 
    lower.includes('hud code') ||
    lower.includes('plumbing') ||
    lower.includes('electrical')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    return {
      conversationalResponse: `Here is an overview of our manufacturer warranty and factory-built quality standards:\n\n• **Clayton Albany 1-Year Limited Warranty:** 12 months of comprehensive warranty coverage from the date of initial installation covering structural systems, factory plumbing, electrical, and materials.\n• **Cosmetic Defect Reporting:** 30-day reporting window for any transit cosmetic items (drywall adjustments, trim, and floor transitions).\n• **Electrical Systems:** 100A or 200A 120/240V AC service panels with dedicated 4-wire feeders, isolated neutral bars, and GFI protection at kitchen countertops, baths, and exterior heat tape outlets.\n• **Plumbing & Safety:** FlowGuard Gold or PEX water systems designed for up to 80 psi with factory-calibrated anti-scald mixing valves preset to 105°F (max safe limit 120°F).\n• **Annual Care:** Routine homeowner maintenance includes yearly roof and gutter inspections, annual check of the crawlspace belly board (Flex-Mend sealing), and verifying home level within 90 days of set.\n\n*Would you like to print a certified factory spec sheet for a specific model?*`,
      action: 'general_advice',
      clientDossier: updatedDossier,
      followUpPrompt: "Ask for any model's spec sheet or warranty details."
    };
  }

  // 6. Kitsap & Mason County Permitting
  if (
    lower.includes('permit') || 
    lower.includes('zoning') || 
    lower.includes('dcd') || 
    lower.includes('county') || 
    lower.includes('setback') || 
    lower.includes('health district') || 
    lower.includes('rpp') || 
    lower.includes('septic')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    const loc = updatedDossier.propertyLocation || 'Kitsap County';

    return {
      conversationalResponse: `For installing a manufactured home in **${loc}**, the critical local requirements include:\n\n• **Residential Placement Permit (RPP):** Submitted directly through the Kitsap County Department of Community Development (DCD) or Mason County Community Services.\n• **Health District Approval:** Septic design verification or public sewer availability letter must be secured before permit issuance.\n• **Accessory Dwelling Units (ADUs):** Detached or attached ADU Casitas up to 900 sq ft are permitted on qualifying residential parcels.\n• **Engineered Foundation Review:** SAA/L&I certified foundation and tie-down plan conforming to local wind and frost penetration codes.\n\n*Would you like our site evaluation coordinator to review your parcel?*`,
      action: 'general_advice',
      clientDossier: updatedDossier,
      followUpPrompt: "Do you have your parcel tax ID or address ready?"
    };
  }

  // 7. Series Comparison: Tempo vs Inspiration Gold vs Dream Silver
  if (lower.includes('difference') || lower.includes('compare') || (lower.includes('tempo') && lower.includes('gold')) || (lower.includes('silver') && lower.includes('gold'))) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    return {
      conversationalResponse: `Here is a breakdown of our primary home series:\n\n• **Tempo Series (Clayton Homes):**\n  - Outstanding modern value with open-concept great rooms, clean shaker cabinetry, and built-in entertainment spaces.\n  - Great for both private acreage and family neighborhoods.\n• **Inspiration Gold Series (Golden West):**\n  - Premium craftsmanship with upgraded **2x6 exterior walls**, high roof pitches with architectural shingles, crown molding, and luxury master bath suites with free-standing tubs.\n• **Dream Silver Series (Golden West):**\n  - Efficient layouts ranging from compact **409 sq ft ADU Casitas** to spacious family multi-sections, featuring durable finishes and energy-smart packages.\n\n*Which series matches what you have in mind?*`,
      action: 'filter_catalog',
      clientDossier: updatedDossier
    };
  }

  // 8. Greetings & Open Questions (No Self-Introduction!)
  if (
    lower.startsWith('hi') || 
    lower.startsWith('hello') || 
    lower.startsWith('hey') || 
    lower.includes('good morning') || 
    lower.includes('good afternoon') ||
    lower === 'who are you' ||
    lower === 'help'
  ) {
    return {
      conversationalResponse: `Welcome to Mountain View Homes of Bremerton! You can explore **145 manufactured homes**, step inside **69 interactive 3D virtual walkthroughs**, review site installation requirements, or customize decor options.\n\n*To help find your ideal floorplan: How many bedrooms do you need, and do you already have a parcel in Kitsap or Mason County?*`,
      action: 'general_advice',
      clientDossier: extractClientDossier(query, history, dossier),
      followUpPrompt: "Share your target bedroom count or property location."
    };
  }

  // 9. Responses About Having Land or Location
  if (
    lower.includes('have land') || 
    lower.includes('own land') || 
    lower.includes('acres') || 
    lower.includes('poulsbo') || 
    lower.includes('port orchard') || 
    lower.includes('bremerton') || 
    lower.includes('belfair') || 
    lower.includes('silverdale') ||
    lower.includes('kingston')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    const loc = updatedDossier.propertyLocation || 'your land';

    const topPick = catalog.find(h => h.hasTour && h.bedrooms === (updatedDossier.bedroomsNeeded || 3) && h.sections === 'Double') || 
                    catalog.find(h => h.hasTour && h.bedrooms === 3) || 
                    catalog[1];

    return {
      conversationalResponse: `Having property in **${loc}** gives you incredible flexibility. For private acreage, our double-wide models provide generous open-concept floorplans and full Energy Star packages.\n\nA great model to explore is the **${topPick.name}** (${topPick.squareFeet.toLocaleString()} sq ft, ${topPick.bedrooms} bed, ${topPick.bathrooms} bath) with a full 3D walkthrough.\n\n*Would you like to step inside the 3D tour, or see all matching floorplans?*`,
      matchedFloorplanId: topPick.id,
      action: 'open_floorplan',
      clientDossier: updatedDossier
    };
  }

  // 10. Floorplan Search & Intent Reasoning
  let matched = catalog.find(h => lower.includes(h.name.toLowerCase()));

  if (!matched) {
    const wantsTour = lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough') || lower.includes('inside') || lower.includes('virtual');
    const isAduOrCasita = lower.includes('adu') || lower.includes('casita') || lower.includes('tiny') || lower.includes('cottage') || lower.includes('backyard') || lower.includes('1 bed') || lower.includes('one bed');
    const wants3Bed = lower.includes('3 bed') || lower.includes('3-bed') || lower.includes('three bed');
    const wants4Bed = lower.includes('4 bed') || lower.includes('4-bed') || lower.includes('four bed');
    const wants2Bed = lower.includes('2 bed') || lower.includes('2-bed') || lower.includes('two bed');
    const wantsTempo = lower.includes('tempo');
    const wantsMarlette = lower.includes('marlette') || lower.includes('majestic') || lower.includes('columbia') || lower.includes('imagine');
    const wantsGoldenWest = lower.includes('golden west') || lower.includes('inspiration') || lower.includes('silver');

    if (wantsTour) {
      if (isAduOrCasita) matched = catalog.find(h => h.hasTour && h.name.toLowerCase().includes('casita'));
      else if (wantsTempo) matched = catalog.find(h => h.hasTour && h.series === 'Tempo');
      else if (wantsGoldenWest) matched = catalog.find(h => h.hasTour && (h.series === 'Inspiration Gold' || h.manufacturer === 'Golden West'));
      else if (wantsMarlette) matched = catalog.find(h => h.hasTour && h.manufacturer === 'Marlette');
      else if (wants4Bed) matched = catalog.find(h => h.hasTour && h.bedrooms === 4);
      else if (wants3Bed) matched = catalog.find(h => h.hasTour && h.bedrooms === 3 && h.sections === 'Double');
      else if (wants2Bed) matched = catalog.find(h => h.hasTour && h.bedrooms === 2);
      else matched = catalog.find(h => h.hasTour && h.series === 'Tempo') || catalog.find(h => h.hasTour);
    } else if (isAduOrCasita) {
      matched = catalog.find(h => h.name.toLowerCase().includes('casita')) || catalog.find(h => h.bedrooms === 1);
    } else if (wantsTempo) {
      matched = catalog.find(h => h.series === 'Tempo' && (wants3Bed ? h.bedrooms === 3 : true));
    } else if (lower.includes('inspiration')) {
      matched = catalog.find(h => h.series === 'Inspiration Gold');
    } else if (lower.includes('columbia')) {
      matched = catalog.find(h => h.series === 'Columbia River');
    } else if (lower.includes('majestic')) {
      matched = catalog.find(h => h.series === 'Majestic');
    } else if (wants4Bed) {
      matched = catalog.find(h => h.bedrooms === 4 && h.hasTour) || catalog.find(h => h.bedrooms === 4);
    } else if (wants3Bed) {
      matched = catalog.find(h => h.bedrooms === 3 && h.hasTour && h.sections === 'Double') || catalog.find(h => h.bedrooms === 3);
    } else if (wants2Bed) {
      matched = catalog.find(h => h.bedrooms === 2 && h.hasTour) || catalog.find(h => h.bedrooms === 2);
    } else if (lower.includes('porch')) {
      matched = catalog.find(h => h.name.toLowerCase().includes('porch') || h.description.toLowerCase().includes('porch'));
    } else if (lower.includes('island')) {
      matched = catalog.find(h => h.description.toLowerCase().includes('island') && h.hasTour) || catalog.find(h => h.description.toLowerCase().includes('island'));
    } else {
      matched = catalog.find(h => h.series === 'Tempo' && h.bedrooms === 3) || catalog.find(h => h.series === 'Inspiration Gold') || catalog[0];
    }
  }

  if (!matched) matched = catalog[0];

  const updatedDossier = extractClientDossier(query, history, dossier, matched);

  // 11. Determine Action and Direct Response (No Self-Introduction!)
  if (lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough') || lower.includes('step inside')) {
    return {
      conversationalResponse: `Stepping inside the **3D Virtual Tour for the ${matched.name}**! You can explore the living space, kitchen layout, and bedrooms on screen.`,
      matchedFloorplanId: matched.id,
      action: 'open_3d_tour',
      clientDossier: updatedDossier
    };
  }

  if (lower.includes('print') || lower.includes('spec sheet') || lower.includes('take home') || lower.includes('blueprint')) {
    return {
      conversationalResponse: `Preparing the printable **Take-Home Spec Sheet for the ${matched.name}**, featuring its architectural blueprint and certified factory standards.`,
      matchedFloorplanId: matched.id,
      action: 'print_spec',
      clientDossier: updatedDossier
    };
  }

  if (lower.includes('customize') || lower.includes('options') || lower.includes('decor') || lower.includes('cabinet') || lower.includes('countertop')) {
    return {
      conversationalResponse: `Opening the custom finish configurator for the **${matched.name}**. You can review available cabinet options, countertops, and luxury upgrades.`,
      matchedFloorplanId: matched.id,
      action: 'open_floorplan',
      clientDossier: updatedDossier
    };
  }

  // General Filter / Recommendation
  let filterDesc = '';
  if (matched.bedrooms) filterDesc += `**${matched.bedrooms} bedrooms**, `;
  if (matched.bathrooms) filterDesc += `**${matched.bathrooms} baths**, `;
  filterDesc += `and **${matched.squareFeet.toLocaleString()} sq ft**`;

  const tourNote = matched.hasTour ? " An interactive **3D virtual walkthrough** is available to explore." : "";

  return {
    conversationalResponse: `Take a look at the **${matched.name}** by **${matched.manufacturer}** (${matched.series} Series). It features ${filterDesc}.${tourNote}\n\n*Would you like to open the 3D walkthrough, customize options, or connect with a specialist?*`,
    matchedFloorplanId: matched.id,
    action: 'filter_catalog',
    clientDossier: updatedDossier,
    extractedFilters: {
      manufacturer: matched.manufacturer,
      series: matched.series,
      minBeds: matched.bedrooms,
      hasTour: matched.hasTour
    }
  };
}
