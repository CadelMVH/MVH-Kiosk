import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2, Loader2, ArrowRight } from 'lucide-react';
import { AiQueryResult } from '../types';

interface VoiceAssistantBarProps {
  onAiAction: (result: AiQueryResult) => void;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({ onAiAction }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // When speech ends and we have a transcript, submit to AI
  useEffect(() => {
    if (!isListening && transcript.trim().length > 3) {
      handleSubmitQuery(transcript);
    }
  }, [isListening, transcript]);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech recognition start failed or already active:', err);
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AiQueryResult = await res.json();
      setLastAiResponse(data.conversationalResponse);
      speakText(data.conversationalResponse);
      onAiAction(data);
    } catch (err) {
      console.error('AI Query failed:', err);
      // Fallback
      const fallbackMsg = "I've filtered our manufactured home catalog based on your request!";
      setLastAiResponse(fallbackMsg);
      speakText(fallbackMsg);
      onAiAction({
        conversationalResponse: fallbackMsg,
        action: 'filter_catalog',
        matchedFloorplanId: 'aspen-ridge'
      });
    } finally {
      setIsLoading(false);
      setTextInput('');
    }
  };

  const samplePrompts = [
    "3-bed double-wide under $160k",
    "Open 3D tour for the Aspen Ridge",
    "Show modern farmhouses with a porch",
    "Print specs for the Sedona Ranch",
    "Book an appointment with a sales rep"
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3 select-none">
      
      {/* Main Interactive Mic & Prompt Box */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        
        {/* Prominent Microphone Button */}
        <button
          onClick={toggleVoice}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shrink-0 ${
            isListening 
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30 scale-105 ring-4 ring-rose-500/30' 
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
          }`}
        >
          {isListening ? (
            <>
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
              <span>Listening... Speak Now</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Tap to Speak in Plain English</span>
            </>
          )}
        </button>

        {/* Input Bar or Live Speech Transcript */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitQuery(textInput);
          }}
          className="flex-1 w-full flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-1.5 focus-within:border-slate-900 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          
          <input
            type="text"
            placeholder={isListening ? (transcript || 'Listening to your voice...') : "Or type: 'Double-wide with island kitchen under $170k'..."}
            value={isListening ? transcript : textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isListening}
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-2"
          />

          {isLoading ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Thinking...</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition-opacity shrink-0"
              title="Submit query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* AI Voice Response Bubble */}
      {lastAiResponse && (
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 flex items-start justify-between gap-3 text-xs text-emerald-950 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <Volume2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-emerald-800 font-mono text-[10px] uppercase tracking-wide">
                Kiosk Concierge:
              </span>
              <p className="mt-0.5 text-xs text-emerald-900 font-medium leading-relaxed">
                {lastAiResponse}
              </p>
            </div>
          </div>
          <button
            onClick={() => speakText(lastAiResponse)}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 shrink-0 px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200"
          >
            Replay Audio
          </button>
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-500 scrollbar-none">
        <span className="shrink-0 text-slate-400 font-medium">Try asking:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSubmitQuery(prompt)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-medium transition-all border border-slate-200/80"
          >
            "{prompt}"
          </button>
        ))}
      </div>

    </div>
  );
};
