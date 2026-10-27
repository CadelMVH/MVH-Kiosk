# Timber & Stone Homes — Dealership Showroom Kiosk

A dedicated, touch-first showroom kiosk web application for manufactured and modular home dealerships, empowering walk-in clients to browse floorplans with natural voice or touch, explore immersive 3D virtual walkthroughs, customize interior/exterior packages, print detailed spec brochures on demand, and book future sales appointments or join the live dealership waitlist when sales consultants are busy.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key architectural directions were confirmed during initial clarification:
> - **Kiosk Direction**: Purpose-built branded touch kiosk application rather than a developer chat interface like Open WebUI. This guarantees full kiosk lockdown, customer-grade touchscreen ergonomics, and unified 3D/print workflows.
> - **AI Engine**: Cloud Gemini API (`gemini-3.8-flash` via secure server-side API proxy) for sub-second natural language interpretation, speech parsing, and smart multi-criteria floorplan matching.
> - **Catalog & 3D Tours**: Rich curated inventory of single-wide, double-wide, and modular homes featuring interactive 3D virtual tours, architectural floorplan blueprints, and a built-in Dealership Inventory Manager to add or adjust homes.

---

## 1. Overview & Core Concept

### What It Does
The Dealership Kiosk acts as an always-ready digital sales concierge on the showroom floor. Customers can either tap through the visual catalog or press the prominent microphone button to speak in everyday conversational English (e.g., *"We need at least 3 bedrooms, an open kitchen with an island, under $175,000, and a covered porch"*). The kiosk instantly analyzes their preferences, spotlights matching floorplans, enables full-screen 3D virtual walkthroughs, calculates monthly/total estimated pricing with customizable options (finishes, porches, kitchen upgrades), triggers instant printable spec sheets, and facilitates self-service appointment scheduling or queue check-in.

### Target Audience & Persona
- **Walk-in Home Buyers & Families**: Exploring housing options at their own pace; desiring visual clarity, straightforward pricing, and instant answers without feeling pressured.
- **Dealership Sales Team & Management**: Ensuring zero walk-aways during peak showroom rush hours by capturing qualified leads and queueing appointments automatically.

### Key Value Delivered
- **Zero Walk-Away Loss**: Transforms waiting time into engaging discovery and captures client contact information into an organized queue.
- **Effortless Discovery**: Removes sales friction by translating vague natural language requests into exact floorplan matches with transparent specs.

---

## 2. User Experience & Visual Design

### Touch-First Showroom Ergonomics
Designed specifically for landscape touchscreens (kiosks, all-in-ones, iPads, or TV displays) with minimum **$48 \times 48\text{px}$** touch targets, high-contrast daylight legibility, generous touch spacing, and an automatic **Idle Screensaver / Reset Timer** (resets to welcoming attractor screen after 2 minutes of inactivity).

### Visual Identity & Theme
- **Aesthetic Direction**: High-end architectural studio meets modern home showroom. Warm, trustworthy, crisp, and tactile.
- **Color Palette (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Crisp chalk white (`#FBFBFB`) and clean stone surfaces (`#F4F4F5`).
  - `30% Structural Surfaces`: Deep charcoal headers (`#18181B`), warm timber neutrals (`#E2DFD8`), and subtle hairline borders (`#E4E4E7`).
  - `10% Accent Budget`: Warm architectural spruce / amber (`#0F766E` and `#B45309`) concentrated exclusively on active filters, primary CTAs, and microphone recording pulses.
- **Typography**:
  - *Display / Headings*: Plus Jakarta Sans (bold, modern architectural character).
  - *Body Prose*: Plus Jakarta Sans (clean, highly legible at distance).
  - *Technical Specs & Pricing*: Tabular figures with JetBrains Mono (`tabular-nums`) for square footage, dimensions, bedroom/bath counts, and financing estimates.

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IDLE ATTRACTOR SCREEN                           │
│  "Touch anywhere or tap the mic to find your dream manufactured home"  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Touch or Voice)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     INTERACTIVE SHOWROOM BROWSER                       │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ AI Voice Assistant Bar  │  │ Filter Pills (Width, Beds, Price)   │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Floorplan Card Grid (Photos, Dimensions, Price, 3D Tour Badge)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │ Select Floorplan              │ Busy / Need Rep
                   ▼                               ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       FLOORPLAN DETAIL & 3D TOUR     │  │   APPOINTMENT & WAITLIST     │
│ • Interactive 3D Walkthrough Viewer  │  │ • Schedule Future Meeting    │
│ • Architectural Blueprint & Specs    │  │ • "Speak With Next Available │
│ • Options & Finishes Customizer      │  │   Sales Consultant" Queue    │
│ • [ Print Spec Sheet / Send to Phone]│  │ • SMS / Email Lead Capture   │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

### 1. Bespoke Web Kiosk vs. Open WebUI
- **Decision**: Built from the ground up as a dedicated kiosk application rather than wrapping Open WebUI.
- **Why**: Open WebUI is a chat-bubble UI tailored for developers and prompt engineers. A showroom kiosk requires visual cards, integrated 3D tour viewports, instant print CSS stylesheets, and strict kiosk lockdown (no sidebars, API key exposures, or user configuration menus).

### 2. Speech-to-Intent Pipeline
- **Decision**: Dual voice input utilizing the standard browser **Web Speech API** for instant speech-to-text recognition, coupled with a server-side **Gemini 3.8 Flash** model with structured function calling.
- **Why**: Web Speech API provides zero-latency client-side transcription without sending huge raw audio payloads over the network. Gemini parses nuanced natural speech (e.g., *"We want something roomy with a master suite split from the kids' rooms under 2000 sq ft"*) and returns structured filter parameters and direct action triggers (e.g. `open_tour`, `filter_catalog`, `schedule_appointment`).

### 3. Dedicated Print-Ready Spec Sheets
- **Decision**: Built-in CSS `@media print` optimized template and one-click PDF generation.
- **Why**: In kiosk setups, customers love taking home a physical spec sheet with floor dimensions, architectural diagram, standard features, and dealer contact details. A single tap prints clean 8.5x11 sheets directly to the dealership printer.

### 4. Waitlist & Appointment Booking System
- **Decision**: Self-service calendar for booking upcoming appointments (morning/afternoon slots with chosen sales specialists) alongside an immediate **"Join Showroom Waitlist"** queue ticket generator.
- **Why**: Solves the core dealer problem: when sales consultants are busy, customers can register their mobile number, receive a queue ticket, and explore homes on the kiosk while awaiting their turn.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                             CLIENT BROWSER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation (Dealership Brand · Voice Search · Waitlist · Rep)│  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Catalog View / 3D Virtual Tour Modal / Customizer / Print Sheet  │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Appointment Scheduler & Live Queue Desk Modal                    │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Dealership Inventory Admin Panel (Quick edits, prices & plans)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ /api/ai/recommend
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NODE / EXPRESS SERVER                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ @google/genai SDK (model: gemini-3.8-flash)                      │  │
│  │ User-Agent: 'aistudio-build'                                     │  │
│  │ Structured Output Schema & Intent Classification                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models

```typescript
interface Floorplan {
  id: string;
  name: string;
  series: 'Single-Wide' | 'Double-Wide' | 'Triple-Wide' | 'Modular';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  dimensions: string; // e.g., "28' x 60'"
  basePrice: number;
  description: string;
  keyFeatures: string[];
  exteriorImageUrl: string;
  floorplanBlueprintUrl: string;
  virtualTour3DUrl: string; // Matterport/3D tour embed URL
  availableOptions: {
    kitchen: { name: string; price: number }[];
    porch: { name: string; price: number }[];
    exterior: { name: string; price: number }[];
  };
}

interface AppointmentBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredDate: string;
  preferredTime: string;
  interestedFloorplanId?: string;
  type: 'future_appointment' | 'live_waitlist_queue';
  status: 'waiting' | 'in_consultation' | 'scheduled' | 'completed';
  createdAt: string;
}
```

---

## 5. Implementation Sequence

1. **Server Setup**: Create an Express server endpoint `/api/ai/query` using `@google/genai` (`gemini-3.8-flash`) to handle natural speech queries, map user preferences to floorplan filters, and trigger UI commands.
2. **Catalog & 3D Tour Data**: Seed realistic manufactured home floorplans (single-wide, double-wide, modular) complete with high-res architectural blueprints, 3D interactive viewer states, and options pricing.
3. **Kiosk UI & Voice Engine**: Build the touch-optimized kiosk layout with the live microphone assistant, quick category chips, price sliders, and floorplan card grid.
4. **Interactive 3D Walkthrough & Options Customizer**: Full-screen 3D inspection modal, finish/cabinet toggles, and live price estimator.
5. **Print Engine**: Dedicated print stylesheet formatting floorplans, specs, and dealership contact info onto clean printable pages.
6. **Appointment & Queue System**: Self-service calendar booking modal + instant showroom waitlist check-in with ticket generation.
7. **Dealer Admin / Inventory Manager**: Staff mode to toggle homes in-stock, edit pricing, and view the live customer waitlist.
