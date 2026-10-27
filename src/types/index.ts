/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CustomOption {
  id: string;
  name: string;
  price: number;
  description: string;
  imageThumbnailUrl?: string;
}

export interface TourHotspot {
  id: string;
  title: string;
  yaw: number;
  pitch: number;
  description: string;
}

export interface Floorplan {
  id: string;
  name: string;
  manufacturer?: string;
  series: string;
  modelNumber?: string;
  modelName?: string;
  category?: string;
  tagline: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  width?: number;
  length?: number;
  dimensions: string;
  sections?: string;
  basePrice: number;
  estimatedMonthly: number;
  exteriorImageUrl: string;
  photos?: string[];
  floorplanPdf?: string;
  hasTour?: boolean;
  tourType?: 'matterport' | 'momento360' | 'other' | 'canvas';
  primaryTour?: string;
  matterportUrl?: string;
  momento360Url?: string;
  otherTourUrl?: string;
  keyFeatures: string[];
  tourHotspots?: TourHotspot[];
  specs: {
    roofPitch: string;
    insulation: string;
    exteriorSiding: string;
    ceilingHeight: string;
    framing: string;
    hudCodeCertification: string;
  };
  rawSpecs?: {
    construction: string;
    exterior: string;
    interior: string;
    utilities: string;
    kitchenBath: string;
  };
  options: {
    exteriorFinish: CustomOption[];
    kitchenPackage: CustomOption[];
    porchPackage: CustomOption[];
    appliancePackage: CustomOption[];
  };
  status: string;
}

export interface SelectedOptions {
  exteriorPackageId?: string;
  appliancePackageId?: string;
  bathroomPackageId?: string;
  interiorPackageId?: string;
  fireplacePackageId?: string;
  energyPackageId?: string;
  doorPackageId?: string;
  // Décor selections
  cabinetFinish?: string;
  cabinetHardware?: string;
  countertopType?: string;
  flooringType?: string;
  carpetType?: string;
  interiorPaint?: string;
  exteriorPaint?: string;
  roofingType?: string;
  // Legacy compatibility
  exteriorFinishId?: string;
  kitchenPackageId?: string;
  porchPackageId?: string;
}

export interface AppointmentBooking {
  id: string;
  ticketNumber: string;
  clientName: string;
  phone: string;
  email?: string;
  type: 'live_waitlist' | 'future_appointment';
  date: string;
  timeSlot: string;
  interestedPlanName?: string;
  notes?: string;
  partySize: number;
  status: 'waiting' | 'called' | 'in_consultation' | 'scheduled' | 'completed';
  createdAt: string;
}

export interface AiQueryResult {
  conversationalResponse: string;
  matchedFloorplanId?: string;
  action: 'filter_catalog' | 'open_floorplan' | 'open_3d_tour' | 'print_spec' | 'schedule_appointment' | 'general_advice';
  extractedFilters?: {
    series?: string;
    manufacturer?: string;
    minBeds?: number;
    minBaths?: number;
    maxPrice?: number;
    hasTour?: boolean;
  };
}
