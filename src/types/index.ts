export interface CustomOption {
  id: string;
  name: string;
  price: number;
  description: string;
  previewColor?: string;
}

export interface TourHotspot {
  id: string;
  roomName: string;
  pitch: number;
  yaw: number;
  description: string;
  imageUrl: string;
  keyHighlights: string[];
}

export interface Floorplan {
  id: string;
  name: string;
  manufacturer?: string;
  series: string; // e.g. 'Dream Silver' | 'Inspiration Gold' | 'Columbia River' | 'Imagine' | 'Majestic' | 'Tempo' | 'Duplex' | 'Dream Park Model'
  category?: string;
  modelNumber?: string;
  modelName?: string;
  tagline: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  width?: number;
  length?: number;
  sections?: string; // 'Single' | 'Double' | 'Triple'
  dimensions: string; // e.g. "28' x 56'"
  basePrice: number;
  estimatedMonthly: number;
  description: string;
  keyFeatures: string[];
  exteriorImageUrl: string;
  photos?: string[];
  showOnKiosk?: boolean;
  hasTour?: boolean;
  primaryTour?: string;
  tourType?: 'matterport' | 'momento360' | 'custom' | 'none' | string;
  matterportUrl?: string;
  momento360Url?: string;
  otherTourUrl?: string;
  floorplanPdf?: string;
  tourImagePreviewUrl?: string;
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
  exteriorFinishId: string;
  kitchenPackageId: string;
  porchPackageId: string;
  appliancePackageId: string;
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
