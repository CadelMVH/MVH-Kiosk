import { AiChatMessage, AiQueryResult, ClientLeadDossier } from '../types';
import { statefulHomerEngine } from './homerEngine';
import floorplansJson from '../data/floorplans.json';

interface QueryParams {
  query: string;
  conversationHistory?: AiChatMessage[];
  clientDossier?: ClientLeadDossier;
}

/**
 * Optional: URL of a server/serverless function you host that talks to Gemini
 * (e.g. a Cloudflare Worker or Cloud Run service). Leave unset and HOM̂ER runs
 * entirely in the browser using the built-in rules engine, which is what you
 * want for GitHub Pages. NEVER put a Gemini API key in this project's
 * frontend: anything in a static site is public.
 *
 * Expected contract: POST { query, conversationHistory, clientDossier }
 * and respond with an AiQueryResult JSON object.
 */
const REMOTE_AI_URL = (import.meta.env.VITE_HOMER_AI_URL as string | undefined)?.trim();

function runLocal({ query, conversationHistory, clientDossier }: QueryParams): AiQueryResult {
  return statefulHomerEngine({
    query,
    history: conversationHistory,
    dossier: clientDossier,
    catalog: floorplansJson as any[]
  }) as AiQueryResult;
}

export async function queryHomer(params: QueryParams): Promise<AiQueryResult> {
  if (REMOTE_AI_URL) {
    try {
      const res = await fetch(REMOTE_AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = (await res.json()) as AiQueryResult;
        if (data?.conversationalResponse) return data;
      }
    } catch (err) {
      console.warn('[HOMER] Remote AI unavailable, using built-in engine:', err);
    }
  }
  return runLocal(params);
}
