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

import { statefulHomerEngine } from './src/server/homerEngine.ts';

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    kiosk: 'Mountain View Homes of Bremerton Terminal #1',
    aiGuide: 'HOM̂ER (Home Options & Model Exploration Resource)',
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

// In-memory cache for floorplan PDFs to ensure instant kiosk printing & viewing
const pdfCache = new Map<string, Buffer>();

// Floorplan PDF proxy endpoint for reliable rendering & printing
app.get('/api/pdf-proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  // Handle local workspace assets
  if (targetUrl.startsWith('/assets/')) {
    const localPath = path.join(__dirname, 'public', targetUrl);
    if (fs.existsSync(localPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(localPath);
    }
  }

  // Serve from in-memory cache if available
  if (pdfCache.has(targetUrl)) {
    const cachedBuffer = pdfCache.get(targetUrl)!;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cachedBuffer);
  }

  try {
    const fetchResponse = await fetch(targetUrl);
    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).send('Failed to fetch remote PDF');
    }
    const arrayBuffer = await fetchResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    pdfCache.set(targetUrl, buffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);
  } catch (err: any) {
    console.error('Error proxying floorplan PDF:', err.message);
    return res.status(500).send('Error retrieving PDF: ' + err.message);
  }
});

// AI Kiosk Query Endpoint
app.post('/api/ai/query', async (req, res) => {
  try {
    const { query, conversationHistory, clientDossier } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Always compute stateful client dossier & intelligent recommendation
    const statefulResult = statefulHomerEngine({
      query,
      history: conversationHistory,
      dossier: clientDossier,
      catalog: floorplansCatalog
    });

    // If Gemini API is available and has active credits, attempt Gemini 3.8 Flash
    if (process.env.GEMINI_API_KEY) {
      try {
        const historyContext = Array.isArray(conversationHistory)
          ? conversationHistory.slice(-6).map((m: any) => `${m.role === 'user' ? 'Client' : 'HOMER'}: ${m.content}`).join('\n')
          : '';

        const systemPrompt = `You are HOM̂ER (Home Options & Model Exploration Resource), the digital showroom guide for Mountain View Homes of Bremerton in Kitsap County, WA.
We have 145 manufactured homes, 69 3D tours, and 12 built homes.

# CLIENT INTERVIEW & NOTE-TAKING DIRECTIVE
- Actively gather information on walk-in clients: ask about their land/property location (Poulsbo, Port Orchard, Bremerton, etc.), bedroom needs, and budget.
- Never give walls of text. Use **bold** text and short bullets.
- Available actions: "open_3d_tour", "print_spec", "open_built_homes", "open_slideshow", "schedule_appointment", "open_floorplan", "filter_catalog", "general_advice".
- If client wants to buy, apply for financing, or speak to someone: set action to "schedule_appointment".

Current Client Dossier:
${JSON.stringify(statefulResult.clientDossier || {})}

Recent Conversation History:
${historyContext}

Popular Models Sample:
${INVENTORY_SUMMARY}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Client query: "${query}"`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                conversationalResponse: {
                  type: Type.STRING,
                  description: 'Concise response as HOMER formatted with bold text and short bullets.'
                },
                matchedFloorplanId: { type: Type.STRING },
                action: { type: Type.STRING },
                extractedFilters: {
                  type: Type.OBJECT,
                  properties: {
                    series: { type: Type.STRING },
                    manufacturer: { type: Type.STRING },
                    minBeds: { type: Type.INTEGER },
                    minBaths: { type: Type.NUMBER },
                    hasTour: { type: Type.BOOLEAN }
                  }
                }
              },
              required: ['conversationalResponse', 'action']
            }
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        parsed.clientDossier = statefulResult.clientDossier;
        return res.json(parsed);
      } catch (geminiError: any) {
        console.warn('[HOMER Server] Gemini API call note:', geminiError.message);
        return res.json(statefulResult);
      }
    }

    return res.json(statefulResult);
  } catch (error: any) {
    console.error('Gemini API query handler error:', error);
    const fallback = statefulHomerEngine({
      query: req.body?.query || 'help',
      history: req.body?.conversationHistory,
      dossier: req.body?.clientDossier,
      catalog: floorplansCatalog
    });
    return res.json(fallback);
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
