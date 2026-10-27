import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini SDK on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Load real floorplans catalog from spreadsheet json
let floorplansCatalog: any[] = [];
try {
  const raw = fs.readFileSync(path.join(__dirname, 'src/data/floorplans.json'), 'utf8');
  floorplansCatalog = JSON.parse(raw);
  console.log(`Loaded ${floorplansCatalog.length} floorplans from catalog into server`);
} catch (err) {
  console.warn('Could not load floorplans.json:', err);
}

// Generate inventory summary for Gemini system prompt
const INVENTORY_SUMMARY = floorplansCatalog
  .slice(0, 35) // Top representative models across series
  .map(h => `ID: "${h.id}" | Name: "${h.name}" | Mfr: "${h.manufacturer}" | Series: "${h.series}" | Beds: ${h.bedrooms} | Baths: ${h.bathrooms} | SqFt: ${h.squareFeet} | ${h.sections} Section | Tour: ${h.hasTour ? 'Yes' : 'No'}`)
  .join('\n');

// Resilient Catalog Matcher Helper
function fallbackCatalogMatcher(query: string) {
  const lower = query.toLowerCase();

  // Try direct model name match
  let matched = floorplansCatalog.find(h => lower.includes(h.name.toLowerCase()));

  if (!matched) {
    if (lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough')) {
      if (lower.includes('casita') || lower.includes('adu')) {
        matched = floorplansCatalog.find(h => h.hasTour && h.name.toLowerCase().includes('casita'));
      } else if (lower.includes('tempo')) {
        matched = floorplansCatalog.find(h => h.hasTour && h.series === 'Tempo');
      } else if (lower.includes('marlette') || lower.includes('majestic')) {
        matched = floorplansCatalog.find(h => h.hasTour && (h.manufacturer === 'Marlette' || h.series === 'Majestic'));
      } else if (lower.includes('golden west') || lower.includes('inspiration')) {
        matched = floorplansCatalog.find(h => h.hasTour && (h.manufacturer === 'Golden West' || h.series === 'Inspiration Gold'));
      } else if (lower.includes('single')) {
        matched = floorplansCatalog.find(h => h.hasTour && h.sections === 'Single');
      } else if (lower.includes('double')) {
        matched = floorplansCatalog.find(h => h.hasTour && h.sections === 'Double');
      } else {
        matched = floorplansCatalog.find(h => h.hasTour);
      }
    } else if (lower.includes('casita') || lower.includes('adu') || lower.includes('tiny')) {
      matched = floorplansCatalog.find(h => h.name.toLowerCase().includes('casita') || h.squareFeet < 600);
    } else if (lower.includes('tempo')) {
      matched = floorplansCatalog.find(h => h.series === 'Tempo');
    } else if (lower.includes('inspiration') || lower.includes('gold')) {
      matched = floorplansCatalog.find(h => h.series === 'Inspiration Gold');
    } else if (lower.includes('silver')) {
      matched = floorplansCatalog.find(h => h.series === 'Dream Silver');
    } else if (lower.includes('majestic')) {
      matched = floorplansCatalog.find(h => h.series === 'Majestic');
    } else if (lower.includes('imagine')) {
      matched = floorplansCatalog.find(h => h.series === 'Imagine');
    } else if (lower.includes('columbia')) {
      matched = floorplansCatalog.find(h => h.series === 'Columbia River');
    } else if (lower.includes('marlette')) {
      matched = floorplansCatalog.find(h => h.manufacturer === 'Marlette');
    } else if (lower.includes('golden west')) {
      matched = floorplansCatalog.find(h => h.manufacturer === 'Golden West');
    } else if (lower.includes('clayton')) {
      matched = floorplansCatalog.find(h => h.manufacturer === 'Clayton Homes');
    } else if (lower.includes('4 bed') || lower.includes('4 bedroom') || lower.includes('four bedroom')) {
      matched = floorplansCatalog.find(h => h.bedrooms === 4);
    } else if (lower.includes('3 bed') || lower.includes('3 bedroom') || lower.includes('three bedroom')) {
      matched = floorplansCatalog.find(h => h.bedrooms === 3 && h.hasTour) || floorplansCatalog.find(h => h.bedrooms === 3);
    } else if (lower.includes('2 bed') || lower.includes('2 bedroom') || lower.includes('two bedroom')) {
      matched = floorplansCatalog.find(h => h.bedrooms === 2 && h.hasTour) || floorplansCatalog.find(h => h.bedrooms === 2);
    } else if (lower.includes('1 bed') || lower.includes('1 bedroom') || lower.includes('one bedroom')) {
      matched = floorplansCatalog.find(h => h.bedrooms === 1);
    } else if (lower.includes('triple') || lower.includes('triple-wide')) {
      matched = floorplansCatalog.find(h => h.sections === 'Triple');
    } else if (lower.includes('double') || lower.includes('double-wide')) {
      matched = floorplansCatalog.find(h => h.sections === 'Double' && h.hasTour);
    } else if (lower.includes('single') || lower.includes('single-wide')) {
      matched = floorplansCatalog.find(h => h.sections === 'Single' && h.hasTour);
    } else {
      matched = floorplansCatalog.find(h => h.hasTour) || floorplansCatalog[0];
    }
  }

  if (!matched) matched = floorplansCatalog[0];

  let action = 'filter_catalog';
  let response = `I found ${matched.name} by ${matched.manufacturer}! It features ${matched.bedrooms} bedrooms, ${matched.bathrooms} bathrooms, and ${matched.squareFeet.toLocaleString()} square feet.`;

  if (lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough')) {
    action = 'open_3d_tour';
    response = `Opening the 3D virtual tour for ${matched.name}! You can explore the full interior walkthrough right on the screen.`;
  } else if (lower.includes('print')) {
    action = 'print_spec';
    response = `Preparing the official ${matched.name} specification sheet and floorplan summary for printing.`;
  } else if (lower.includes('appointment') || lower.includes('talk to') || lower.includes('sales') || lower.includes('wait') || lower.includes('meet') || lower.includes('consultant')) {
    action = 'schedule_appointment';
    response = "I'm opening our showroom waitlist and appointment desk so you can meet with a Mountain View Homes consultant.";
  } else if (lower.includes('open') || lower.includes('detail') || lower.includes('customize')) {
    action = 'open_floorplan';
    response = `Here are the specifications and customizable options for ${matched.name}.`;
  }

  // Filter extractions
  let extractedManu = undefined;
  if (lower.includes('marlette')) extractedManu = 'Marlette';
  else if (lower.includes('golden west')) extractedManu = 'Golden West';
  else if (lower.includes('clayton')) extractedManu = 'Clayton Homes';

  let extractedSeries = undefined;
  if (lower.includes('tempo')) extractedSeries = 'Tempo';
  else if (lower.includes('silver')) extractedSeries = 'Dream Silver';
  else if (lower.includes('inspiration')) extractedSeries = 'Inspiration Gold';
  else if (lower.includes('majestic')) extractedSeries = 'Majestic';
  else if (lower.includes('imagine')) extractedSeries = 'Imagine';
  else if (lower.includes('columbia')) extractedSeries = 'Columbia River';

  let extractedBeds = undefined;
  if (lower.includes('4 bed') || lower.includes('4 bedroom') || lower.includes('four bed')) extractedBeds = 4;
  else if (lower.includes('3 bed') || lower.includes('3 bedroom') || lower.includes('three bed')) extractedBeds = 3;
  else if (lower.includes('2 bed') || lower.includes('2 bedroom') || lower.includes('two bed')) extractedBeds = 2;
  else if (lower.includes('1 bed') || lower.includes('1 bedroom') || lower.includes('one bed')) extractedBeds = 1;

  const hasTour = lower.includes('tour') || lower.includes('3d') || lower.includes('walkthrough') ? true : undefined;

  return {
    conversationalResponse: response,
    matchedFloorplanId: matched.id,
    action,
    extractedFilters: {
      manufacturer: extractedManu,
      series: extractedSeries,
      minBeds: extractedBeds,
      hasTour,
    }
  };
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    kiosk: 'Mountain View Homes of Bremerton Terminal #1',
    modelsLoaded: floorplansCatalog.length,
    toursAvailable: floorplansCatalog.filter(h => h.hasTour).length
  });
});

// Inventory listing endpoint
app.get('/api/inventory', (_req, res) => {
  res.json({
    total: floorplansCatalog.length,
    floorplans: floorplansCatalog
  });
});

// AI Kiosk Query Endpoint
app.post('/api/ai/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // If no API key is provided, return intelligent rule-based match from the spreadsheet
    if (!process.env.GEMINI_API_KEY) {
      console.log('[Kiosk Server] Using local catalog matcher (no API key)');
      return res.json(fallbackCatalogMatcher(query));
    }

    const systemPrompt = `You are the friendly, intelligent showroom AI concierge at Mountain View Homes of Bremerton dealership kiosk in Kitsap County, WA.
We have 145 manufactured and modular homes from Golden West, Marlette, and Clayton Homes.
Here is a representative sample of popular models:
${INVENTORY_SUMMARY}

When clients speak in plain English:
- If they ask for a 3D tour or walkthrough, set action to "open_3d_tour" and match the floorplan ID.
- If they ask to print specs or a floorplan sheet, set action to "print_spec" and match the floorplan ID.
- If they want to speak with a sales consultant, make an appointment, or join the showroom waitlist, set action to "schedule_appointment".
- If they describe bedroom counts, size, series, or features, match the best floorplan and set action to "open_floorplan" or "filter_catalog".
- Provide a warm, concise 1-2 sentence spoken response suitable for a showroom kiosk voice assistant. Mention Mountain View Homes or the model name naturally.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conversationalResponse: {
                type: Type.STRING,
                description: 'Clear, concise 1-2 sentence friendly response spoken aloud to the customer.'
              },
              matchedFloorplanId: {
                type: Type.STRING,
                description: 'The exact ID of the best matching floorplan from the inventory.'
              },
              action: {
                type: Type.STRING,
                description: 'The UI action: filter_catalog, open_floorplan, open_3d_tour, print_spec, schedule_appointment, or general_advice'
              },
              extractedFilters: {
                type: Type.OBJECT,
                properties: {
                  series: { type: Type.STRING },
                  manufacturer: { type: Type.STRING },
                  minBeds: { type: Type.INTEGER },
                  minBaths: { type: Type.NUMBER },
                  maxPrice: { type: Type.NUMBER },
                  hasTour: { type: Type.BOOLEAN }
                }
              }
            },
            required: ['conversationalResponse', 'action']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (apiError: any) {
      console.warn('[Kiosk Server] Gemini API error, falling back to local catalog matcher:', apiError.message);
      // Seamless fallback ensures kiosk never shows a blank or broken state to a customer in the showroom
      return res.json(fallbackCatalogMatcher(query));
    }
  } catch (error: any) {
    console.error('Gemini API query handler error:', error);
    return res.json(fallbackCatalogMatcher(req.body?.query || ''));
  }
});

// Setup Vite development server or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Mountain View Homes Kiosk server running on http://localhost:${port}`);
  });
}

setupServer();
