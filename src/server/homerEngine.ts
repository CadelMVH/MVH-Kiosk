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
  if (nameMatch && nameMatch[1] && !['looking', 'interested', 'ready', 'here'].includes(nameMatch[1].toLowerCase())) {
    dossier.clientName = nameMatch[1].trim();
    dossier.notes.push(`Client Name: ${dossier.clientName}`);
  }

  // 2. Detect Phone Number
  const phoneMatch = query.match(/(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) {
    dossier.phone = phoneMatch[0].trim();
    dossier.notes.push(`Phone: ${dossier.phone}`);
  }

  // 3. Detect Email
  const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    dossier.email = emailMatch[0].trim();
    dossier.notes.push(`Email: ${dossier.email}`);
  }

  // 4. Detect Property & Land Status
  const towns = ['poulsbo', 'port orchard', 'bremerton', 'silverdale', 'kingston', 'bainbridge', 'belfair', 'mason county', 'kitsap', 'gig harbor', 'allyn', 'shelton', 'seabeck', 'hansville'];
  for (const town of towns) {
    if (lower.includes(town)) {
      const formattedTown = town.charAt(0).toUpperCase() + town.slice(1);
      dossier.propertyLocation = formattedTown;
      dossier.notes.push(`Location / Area of Interest: ${formattedTown}`);
      break;
    }
  }

  if (lower.includes('own land') || lower.includes('have land') || lower.includes('bought land') || lower.includes('my lot') || lower.includes('our parcel') || lower.includes('acre')) {
    dossier.propertyStatus = 'Owns private land/parcel';
    dossier.notes.push('Owns private property ready for installation');
  } else if (lower.includes('looking for land') || lower.includes('need land') || lower.includes('shopping for property')) {
    dossier.propertyStatus = 'Actively seeking land/parcel';
    dossier.notes.push('Looking for land in Kitsap/Olympic Peninsula area');
  } else if (lower.includes('park') || lower.includes('community') || lower.includes('mobile home park')) {
    dossier.propertyStatus = 'Mobile home park community space';
    dossier.notes.push('Planning placement in a manufactured home park');
  } else if (lower.includes('adu') || lower.includes('casita') || lower.includes('backyard') || lower.includes('mother-in-law') || lower.includes('accessory')) {
    dossier.propertyStatus = 'Accessory Dwelling Unit (ADU/Casita) on existing residential lot';
    dossier.desiredSections = 'ADU / Single';
    dossier.notes.push('ADU / Casita secondary residence placement');
  }

  // 5. Detect Bedrooms & Bathrooms
  if (lower.includes('4 bed') || lower.includes('4-bed') || lower.includes('four bed')) dossier.bedroomsNeeded = 4;
  else if (lower.includes('3 bed') || lower.includes('3-bed') || lower.includes('three bed')) dossier.bedroomsNeeded = 3;
  else if (lower.includes('2 bed') || lower.includes('2-bed') || lower.includes('two bed')) dossier.bedroomsNeeded = 2;
  else if (lower.includes('1 bed') || lower.includes('1-bed') || lower.includes('one bed')) dossier.bedroomsNeeded = 1;

  if (lower.includes('2 bath') || lower.includes('2-bath') || lower.includes('two bath')) dossier.bathroomsNeeded = 2;
  else if (lower.includes('1 bath') || lower.includes('1-bath') || lower.includes('one bath')) dossier.bathroomsNeeded = 1;

  // 6. Detect Section Preferences
  if (lower.includes('triple') || lower.includes('triple-wide') || lower.includes('estate')) dossier.desiredSections = 'Triple';
  else if (lower.includes('double') || lower.includes('double-wide') || lower.includes('multi-section')) dossier.desiredSections = 'Double';
  else if (lower.includes('single') || lower.includes('single-wide')) dossier.desiredSections = 'Single';

  // 7. Detect Budget & Financing
  const budgetMatch = query.match(/(?:under|below|budget|around|max)?\s*\$?(\d{2,3})(?:,\d{3}|k|000)/i);
  if (budgetMatch) {
    const rawNum = budgetMatch[1];
    dossier.targetBudget = `$${rawNum},000`;
    dossier.notes.push(`Target Budget: ~${dossier.targetBudget}`);
  }

  if (lower.includes('cash') || lower.includes('paying cash')) {
    dossier.financingType = 'Cash Buyer';
    dossier.notes.push('Financing: Cash buyer');
  } else if (lower.includes('loan') || lower.includes('mortgage') || lower.includes('finance') || lower.includes('construction-to-perm') || lower.includes('chattel')) {
    dossier.financingType = 'Financing / Construction Loan Needed';
    dossier.notes.push('Financing: Inquiring about financing / loan packages');
  }

  // 8. Detect Must-Have Features
  const featureKeywords: Record<string, string> = {
    'porch': 'Covered Timber Porch',
    'island': 'Gourmet Kitchen Island',
    'farmhouse': 'Farmhouse Sink & Style',
    'tub': 'Soaking Garden Tub',
    'glamour': 'Glamour Spa Bathroom',
    'shower': 'Walk-in Ceramic Tile Shower',
    'fireplace': 'Stone Fireplace',
    'skid': '4x6 Skid Foundation System',
    'vaulted': 'Vaulted Ceilings',
    'garage': 'Garage Ready Prep',
    'energy star': 'Energy Star High-Efficiency Package',
    'drywall': 'Tape & Texture Drywall Throughout',
    'pantry': 'Walk-in Pantry'
  };

  for (const [key, label] of Object.entries(featureKeywords)) {
    if (lower.includes(key) && !dossier.mustHaveFeatures.includes(label)) {
      dossier.mustHaveFeatures.push(label);
    }
  }

  // 9. Detect Timeline
  if (lower.includes('asap') || lower.includes('immediately') || lower.includes('right away') || lower.includes('next month')) {
    dossier.timeline = 'Immediate / Ready to order';
  } else if (lower.includes('spring') || lower.includes('summer') || lower.includes('few months') || lower.includes('3 months')) {
    dossier.timeline = 'Spring / Next 3-6 Months';
  } else if (lower.includes('just looking') || lower.includes('exploring') || lower.includes('browsing') || lower.includes('next year')) {
    dossier.timeline = 'Exploring Options / 6-12 Months';
  }

  // 10. Record Interested Floorplan
  if (matchedPlan?.name && !dossier.interestedPlanNames.includes(matchedPlan.name)) {
    dossier.interestedPlanNames.push(matchedPlan.name);
  }

  // Deduplicate notes
  dossier.notes = Array.from(new Set(dossier.notes));

  // Synthesize sales summary for agents
  const clientRef = dossier.clientName ? `Client ${dossier.clientName}` : 'Showroom Guest';
  const landRef = dossier.propertyLocation ? `in ${dossier.propertyLocation}` : (dossier.propertyStatus ? `(${dossier.propertyStatus})` : '');
  const bedRef = dossier.bedroomsNeeded ? `${dossier.bedroomsNeeded}-bed` : '';
  const budgetRef = dossier.targetBudget ? `around ${dossier.targetBudget}` : '';
  const featuresRef = dossier.mustHaveFeatures.length > 0 ? `Interested in: ${dossier.mustHaveFeatures.slice(0, 3).join(', ')}.` : '';
  const modelRef = dossier.interestedPlanNames.length > 0 ? `Favorited: ${dossier.interestedPlanNames.join(', ')}.` : '';

  dossier.consultationSummary = `${clientRef} ${landRef}. Looking for ${bedRef || 'manufactured home'} ${budgetRef}. ${featuresRef} ${modelRef}`.trim();

  return dossier;
}

/**
 * Intelligent, comprehensive HOM̂ER conversational engine.
 * Maintains context, performs real app actions, and avoids repetitive default answers.
 */
export function statefulHomerEngine({
  query,
  history = [],
  dossier,
  catalog
}: ProcessQueryParams): AiQueryResult {
  const lower = query.toLowerCase();

  // 1. Check for Direct Navigation / View Switch Commands
  if (lower.includes('slideshow') || lower.includes('screensaver')) {
    return {
      conversationalResponse: "**Hi, I'm HOM̂ER!** Starting our showroom fullscreen photo slideshow featuring homes Mountain View Homes has built and delivered across Kitsap County!",
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
      conversationalResponse: "**Hi, I'm HOM̂ER!** Opening our photo gallery of **12 real homes we have built and installed** in Bremerton, Poulsbo, Port Orchard, and across the Olympic Peninsula!",
      action: 'open_built_homes',
      navigationTarget: 'built-homes',
      clientDossier: extractClientDossier(query, history, dossier)
    };
  }

  // 2. Human Escalation / Specialist Hand-Off
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
    const summary = updatedDossier.consultationSummary || 'Guest ready for consultation';

    return {
      conversationalResponse: "**Hi, I'm HOM̂ER!** It sounds like you're ready to get into the details! I have packaged up our notes on your preferences and am waving down one of our design specialists right now to meet with you.",
      action: 'schedule_appointment',
      clientDossier: updatedDossier,
      followUpPrompt: "Please confirm your name and phone number on the waitlist desk so our consultant can greet you."
    };
  }

  // 3. Permitting & Zoning in Kitsap County
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
      conversationalResponse: `**Hi, I'm HOM̂ER!** For placing a manufactured home in **${loc}**, here are the key guidelines:\n\n• **Residential Placement Permit (RPP):** Handled through the Kitsap County Department of Community Development (DCD)\n• **Health District:** Septic system review or public sewer availability is required before placement\n• **ADU Casitas:** Secondary dwelling units up to 900 sq ft are widely permitted on qualifying single-family residential parcels\n• **4x6 Skid Foundation:** Our engineered skid tie-downs satisfy local frost-depth, high-wind, and seismic anchoring codes\n\n*Would you like me to note your parcel details for our site evaluation specialist, or show you our popular ADU casitas?*`,
      action: 'general_advice',
      clientDossier: updatedDossier,
      followUpPrompt: "Do you already have a parcel tax number or address in Kitsap County?"
    };
  }

  // 4. Foundation & 4x6 Skid Framing Specs
  if (
    lower.includes('skid') || 
    lower.includes('framing') || 
    lower.includes('foundation') || 
    lower.includes('4x6') || 
    lower.includes('chassis') || 
    lower.includes('joist') || 
    lower.includes('seismic') ||
    lower.includes('construction')
  ) {
    return {
      conversationalResponse: `**Hi, I'm HOM̂ER!** Mountain View Homes builds with our heavy-duty **Pacific Northwest 4x6 Skid Foundation System**:\n\n• **Ground-Contact 4x6 Skids:** Pressure-treated continuous runners elevate the chassis for optimal moisture airflow in our damp climate\n• **Transverse Floor Joists:** 2x6 or 2x8 joists spaced 16" on-center anchored securely with engineered tie-downs\n• **Steel I-Beam Frame:** Structural steel chassis with full outriggers for Washington State L&I seismic and wind zone ratings\n\n*Would you like to step inside a 3D virtual tour or print a certified factory spec sheet?*`,
      action: 'general_advice',
      clientDossier: extractClientDossier(query, history, dossier)
    };
  }

  // 5. Greetings & Open Inquiries
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
      conversationalResponse: `**Good day! I'm HOM̂ER** (Home Options & Model Exploration Resource), your showroom guide here at Mountain View Homes of Bremerton!\n\nI can help you browse our **145 manufactured homes**, step inside **69 interactive 3D virtual tours**, review **4x6 skid framing specs**, or print spec sheets.\n\n*To help me find your best match: Do you already have a piece of land in Kitsap or Mason County, or are you shopping for property?*`,
      action: 'general_advice',
      clientDossier: extractClientDossier(query, history, dossier),
      followUpPrompt: "Tell me if you have land or what bedroom count you need!"
    };
  }

  // 6. Responses about Having Land / Location
  if (
    lower.includes('have land') || 
    lower.includes('own land') || 
    lower.includes('acres') || 
    lower.includes('poulsbo') || 
    lower.includes('port orchard') || 
    lower.includes('bremerton') || 
    lower.includes('belfair') || 
    lower.includes('silverdale')
  ) {
    const updatedDossier = extractClientDossier(query, history, dossier);
    const loc = updatedDossier.propertyLocation || 'your property';

    // Recommend top popular double-wide or multi-section homes suited for private land
    const topPick = catalog.find(h => h.hasTour && h.bedrooms === 3 && h.sections === 'Double') || catalog[1];

    return {
      conversationalResponse: `**That's wonderful!** Having land in **${loc}** is a huge advantage. Our homes are engineered specifically for Pacific Northwest lots with our moisture-resistant **4x6 skid foundation system**.\n\nA great home to consider is the **${topPick.name}** (${topPick.squareFeet.toLocaleString()} sq ft, ${topPick.bedrooms} bed, ${topPick.bathrooms} bath) with an interactive 3D virtual tour ready to view.\n\n*How many bedrooms and bathrooms does your family need?*`,
      matchedFloorplanId: topPick.id,
      action: 'open_floorplan',
      clientDossier: updatedDossier
    };
  }

  // 7. Search & Matching Logic
  // Look for direct model matches first
  let matched = catalog.find(h => lower.includes(h.name.toLowerCase()));

  // If no direct name match, match by specific customer criteria
  if (!matched) {
    const wantsTour = lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough') || lower.includes('inside') || lower.includes('virtual');
    const isAduOrCasita = lower.includes('adu') || lower.includes('casita') || lower.includes('tiny') || lower.includes('cottage') || lower.includes('backyard') || lower.includes('1 bed');
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
      else if (wants3Bed) matched = catalog.find(h => h.hasTour && h.bedrooms === 3 && h.sections === 'Double');
      else if (wants4Bed) matched = catalog.find(h => h.hasTour && h.bedrooms === 4);
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
      matched = catalog.find(h => h.description.toLowerCase().includes('island') && h.hasTour);
    } else {
      // Pick a flagship popular model, NOT always Casita!
      matched = catalog.find(h => h.series === 'Tempo' && h.bedrooms === 3) || catalog.find(h => h.series === 'Inspiration Gold') || catalog[0];
    }
  }

  if (!matched) matched = catalog[0];

  const updatedDossier = extractClientDossier(query, history, dossier, matched);

  // 8. Determine Action and Construct Natural Response
  if (lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough') || lower.includes('step inside')) {
    return {
      conversationalResponse: `**Hi, I'm HOM̂ER!** Stepping inside the interactive **3D Virtual Tour for the ${matched.name}**! You can explore the living room, kitchen, and bedrooms right now on screen.`,
      matchedFloorplanId: matched.id,
      action: 'open_3d_tour',
      clientDossier: updatedDossier
    };
  }

  if (lower.includes('print') || lower.includes('spec sheet') || lower.includes('take home')) {
    return {
      conversationalResponse: `**Hi, I'm HOM̂ER!** Preparing the Take-Home Spec Sheet for the **${matched.name}** with its certified architectural blueprint and ${matched.series} standards for printing!`,
      matchedFloorplanId: matched.id,
      action: 'print_spec',
      clientDossier: updatedDossier
    };
  }

  if (lower.includes('customize') || lower.includes('detail') || lower.includes('options') || lower.includes('cabinet') || lower.includes('countertop')) {
    return {
      conversationalResponse: `**Hi, I'm HOM̂ER!** Opening the custom finish configurator for the **${matched.name}**. You can choose cabinet finishes, countertops, and luxury upgrades.`,
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

  const tourNote = matched.hasTour ? " It also has an interactive **3D virtual tour** available!" : "";

  return {
    conversationalResponse: `**Hi, I'm HOM̂ER!** I recommend looking at the **${matched.name}** by **${matched.manufacturer}** (${matched.series} Series). It features ${filterDesc}.${tourNote}\n\n*Would you like me to open the 3D virtual tour, customize finishes, or wave down a design specialist?*`,
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
