import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { assetUrl } from '../lib/assetUrl';
import { Loader2, Download, ExternalLink, ZoomIn, ZoomOut, FileText, AlertCircle } from 'lucide-react';

// Configure standard PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

interface FloorplanPdfRendererProps {
  pdfUrl?: string;
  planName: string;
  className?: string;
  forPrint?: boolean;
}

export const FloorplanPdfRenderer: React.FC<FloorplanPdfRendererProps> = ({
  pdfUrl,
  planName,
  className = '',
  forPrint = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1.5);
  const [numPages, setNumPages] = useState<number>(1);

  // Static hosting: no server-side proxy. raw.githubusercontent.com allows
  // cross-origin reads, and local files are resolved against the site base path.
  const proxyUrl = pdfUrl ? assetUrl(pdfUrl) : null;

  useEffect(() => {
    let isCancelled = false;

    if (!proxyUrl) {
      setLoading(false);
      setError('No floorplan PDF available for this model');
      return;
    }

    const renderPdf = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadingTask = pdfjsLib.getDocument({ url: proxyUrl });
        const pdf = await loadingTask.promise;

        if (isCancelled) return;
        setNumPages(pdf.numPages);

        // Render Page 1 (The main architectural floorplan layout)
        const page = await pdf.getPage(1);
        if (isCancelled) return;

        // Render at high resolution (1.75x or 2x for sharp print quality)
        const scale = forPrint ? 2.0 : zoomScale;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current || document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Canvas 2D context not supported');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;

        if (!isCancelled) {
          // Generate data URL for guaranteed cross-browser window.print() compatibility
          const dataUrl = canvas.toDataURL('image/png');
          setRenderedImageUrl(dataUrl);
          setLoading(false);
        }
      } catch (err: any) {
        console.warn('Could not render PDF with PDF.js:', err);
        if (!isCancelled) {
          setError(err.message || 'Error rendering floorplan PDF');
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
    };
  }, [proxyUrl, zoomScale, forPrint]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-slate-200 bg-white ${className}`}>
      
      {/* Blueprint Header Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <span className="font-bold tracking-tight text-sky-200">
            Official Architectural Floorplan Blueprint: {planName}
          </span>
          {numPages > 1 && (
            <span className="bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded font-mono">
              Page 1 of {numPages}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoomScale(prev => Math.max(1.0, prev - 0.25))}
              className="p-1 hover:text-sky-300 text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 text-slate-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(prev => Math.min(2.5, prev + 0.25))}
              className="p-1 hover:text-sky-300 text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Open full original PDF in separate window */}
          {proxyUrl && (
            <a
              href={proxyUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-bold transition-colors"
              title="Open full high-resolution PDF file"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Full PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Canvas / Image Area */}
      <div className="relative min-h-[320px] max-h-[520px] overflow-auto flex items-center justify-center p-2 bg-slate-50/50">
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xs z-20 space-y-2">
            <Loader2 className="w-7 h-7 text-sky-600 animate-spin" />
            <p className="text-xs text-slate-600 font-medium">
              Loading high-resolution architectural floorplan schematic...
            </p>
          </div>
        )}

        {error && !renderedImageUrl ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-xs text-slate-700 font-medium">{error}</p>
            {proxyUrl && (
              <a
                href={proxyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Floorplan PDF Document</span>
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Rendered crisp Image (both on screen and print) */}
            {renderedImageUrl ? (
              <img
                src={renderedImageUrl}
                alt={`Architectural Floorplan Blueprint for ${planName}`}
                className="w-full h-auto max-h-[480px] object-contain shadow-xs bg-white rounded border border-slate-200"
              />
            ) : (
              <canvas ref={canvasRef} className="max-w-full h-auto shadow-xs bg-white rounded" />
            )}
          </>
        )}
      </div>

      {/* Blueprint Sub-banner */}
      <div className="bg-slate-100 border-t border-slate-200 px-4 py-1.5 text-[10px] text-slate-500 flex items-center justify-between font-mono">
        <span>MANUFACTURER CERTIFIED BLUEPRINT · REPRODUCED FROM CHIEF ARCHITECT</span>
        <span>MOUNTAIN VIEW HOMES OF BREMERTON</span>
      </div>

    </div>
  );
};
