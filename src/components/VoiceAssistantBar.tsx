import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Eye, 
  Printer, 
  UserCheck, 
  ArrowRight,
  HelpCircle,
  X,
  FileText,
  RotateCcw,
  CheckCircle2,
  HardHat,
  Compass,
  MapPin,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Play,
  AlertCircle,
  Square
} from 'lucide-react';
import { AiQueryResult, ClientLeadDossier, AiChatMessage } from '../types';

interface VoiceAssistantBarProps {
  onAiAction: (result: AiQueryResult) => void;
  onRequestSpecialist?: (dossier?: ClientLeadDossier) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'homer';
  text: string;
  action?: string;
  matchedFloorplanId?: string;
  timestamp: string;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({ 
  onAiAction,
  onRequestSpecialist 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpandedChat, setIsExpandedChat] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [lastAiResponse, setLastAiResponse] = useState<AiQueryResult | null>(null);
  
  // Live Client Lead Dossier & Consultation Notes
  const [clientDossier, setClientDossier] = useState<ClientLeadDossier>({
    mustHaveFeatures: [],
    interestedPlanNames: [],
    notes: []
  });

  // Multi-Turn Chat History - Welcome message does NOT introduce Homer
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'homer',
      text: "Welcome to Mountain View Homes of Bremerton! You can browse **145 manufactured homes**, step inside **69 interactive 3D virtual walkthroughs**, review site installation requirements, or customize decor options.\n\n*What kind of layout or property are you working on?*",
      timestamp: 'Just now'
    }
  ]);

  const recognitionInstanceRef = useRef<any>(null);
  const activeTranscriptRef = useRef<string>('');
  const chatTopRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts prioritizing genuine home-buyer & construction topics
  const quickActionPrompts = [
    { label: '3-Bed Double-Wide', query: 'Show 3 bedroom double wide homes' },
    { label: '3D Virtual Tours', query: 'Open 3D virtual tour for the Tempo' },
    { label: 'ADU / Casita (409 sq ft)', query: 'Tell me about the Dream Silver Casita ADU' },
    { label: 'Homes We Built', query: 'Show me real homes you have built' },
    { label: 'Site Prep & Crawlspace', query: 'What are the site prep and foundation requirements?' },
    { label: 'ZERH & Energy Specs', query: 'What are the insulation and energy efficiency specs?' },
    { label: 'Clayton 1-Yr Warranty', query: 'What does the Clayton 1-year limited warranty cover?' },
    { label: 'Kitsap County Permits', query: 'What permits do I need in Kitsap County?' },
    { label: 'Speak with Specialist', query: 'I would like to speak with a sales specialist' }
  ];

  // Robust Speech Recognition with Microphone Access Handshake
  const startListening = async () => {
    setMicError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMicError("Voice input is not supported in this browser. Please type your question in the text box.");
      return;
    }

    try {
      // Explicitly request microphone stream so browser shows permission dialog
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
        } catch (mediaErr: any) {
          console.warn('Microphone permission check note:', mediaErr);
          if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
            setMicError("Microphone permission was denied. Please allow microphone permissions or type below.");
            return;
          }
        }
      }

      // Stop any existing instance
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      activeTranscriptRef.current = '';
      setTranscript('');

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        activeTranscriptRef.current = fullTranscript;
        setTranscript(fullTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setMicError("Microphone permission was denied or blocked. Please type your message below.");
        } else if (event.error === 'no-speech') {
          setMicError("No speech detected. Tap again when ready to speak.");
        } else if (event.error === 'network') {
          setMicError("Voice network connection timed out. Please type your question.");
        } else {
          setMicError(`Voice error (${event.error}). Please type your message.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalRecorded = activeTranscriptRef.current.trim();
        if (finalRecorded.length > 2) {
          handleSubmitQuery(finalRecorded);
        }
      };

      recognitionInstanceRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setMicError("Could not activate voice input. Please type your message below.");
    }
  };

  const stopListeningAndSend = () => {
    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.stop();
      } catch (e) {
        setIsListening(false);
      }
    }
    const current = (activeTranscriptRef.current || transcript).trim();
    if (current.length > 2) {
      handleSubmitQuery(current);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListeningAndSend();
    } else {
      startListening();
    }
  };

  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for spoken audio
      const cleanVoiceText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/•/g, '')
        .replace(/[\n\r]+/g, ' ');

      const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const toggleMute = () => {
    if (!isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  const handleSubmitQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    const userQuery = queryText.trim();
    setIsLoading(true);
    setTextInput('');
    setTranscript('');
    activeTranscriptRef.current = '';
    setMicError(null);

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);

    try {
      // Map history for API
      const conversationHistory = chatHistory.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userQuery,
          conversationHistory,
          clientDossier
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: AiQueryResult = await response.json();
      setLastAiResponse(data);

      // Update client dossier memory
      if (data.clientDossier) {
        setClientDossier(data.clientDossier);
      }

      // Append assistant message
      const assistantMsg: ChatMessage = {
        id: `homer-${Date.now()}`,
        sender: 'homer',
        text: data.conversationalResponse,
        action: data.action,
        matchedFloorplanId: data.matchedFloorplanId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, assistantMsg]);

      // Speak text aloud if not muted
      speakText(data.conversationalResponse);

      // Trigger automatic kiosk actions
      if (data.action && data.action !== 'general_advice') {
        onAiAction(data);
      }

    } catch (err: any) {
      console.error('AI Query failed:', err);
      const fallbackMsg: ChatMessage = {
        id: `homer-err-${Date.now()}`,
        sender: 'homer',
        text: "I can help you explore our **145 manufactured homes**, step inside **3D virtual walkthroughs**, review site installation requirements, or print spec sheets. What would you like to see?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;
          
          let formattedLine = line;
          formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return (
              <div 
                key={idx} 
                className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-amber-500 text-slate-800"
                dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[•-]\s*/, '') }}
              />
            );
          }

          return (
            <p 
              key={idx} 
              dangerouslySetInnerHTML={{ __html: formattedLine }} 
            />
          );
        })}
      </div>
    );
  };

  // Reversing chat history so NEWEST messages are at the TOP, closest to the input box!
  const reversedChatHistory = [...chatHistory].reverse();

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden transition-all duration-300">
      
      {/* Top Banner with Consultation Memory Status */}
      <div className="px-5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 shrink-0 shadow-sm">
            <img 
              src="/assets/aistudio/Homerrond_bcc0bd0c.jpg" 
              alt="HOM̂ER" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-400 tracking-wider text-[11px] uppercase">
              HOM̂ER
            </span>
            <span className="text-[10px] text-slate-300 hidden sm:inline border-l border-slate-700 pl-2">
              Digital Showroom Guide & Consultant
            </span>
          </div>
        </div>

        {/* Live Client Consultation Notes Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDossierOpen(!isDossierOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
            title="View collected client requirements for sales specialist"
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
            <span>Consultation Notes</span>
            {clientDossier.clientName && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {isDossierOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Toggle Full Chat Stream */}
          <button
            onClick={() => setIsExpandedChat(!isExpandedChat)}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            {isExpandedChat ? 'Collapse Chat' : `Chat History (${chatHistory.length})`}
          </button>

          {/* Voice Audio Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute spoken replies" : "Mute spoken replies"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Expanded Client Dossier Drawer */}
      {isDossierOpen && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 text-white text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold uppercase tracking-wider text-[11px] text-amber-400">
                Live Showroom Consultation Profile
              </span>
            </div>
            {onRequestSpecialist && (
              <button
                onClick={() => onRequestSpecialist(clientDossier)}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Forward Notes to Sales Desk</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Client Name</span>
              <strong className="text-white text-xs">{clientDossier.clientName || 'Showroom Guest'}</strong>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Land / Location</span>
              <strong className="text-amber-300 text-xs">
                {clientDossier.propertyLocation 
                  ? `${clientDossier.propertyLocation} (${clientDossier.propertyStatus || 'Parcel'})`
                  : 'Needs land location'}
              </strong>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Layout / Budget</span>
              <strong className="text-emerald-300 text-xs">
                {clientDossier.bedroomsNeeded ? `${clientDossier.bedroomsNeeded} Beds` : 'Any beds'}
                {clientDossier.targetBudget ? ` · ${clientDossier.targetBudget}` : ''}
              </strong>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Must-Have Features</span>
              <strong className="text-sky-300 text-xs">
                {clientDossier.mustHaveFeatures.length > 0 ? clientDossier.mustHaveFeatures.join(', ') : 'Gathering wishlist...'}
              </strong>
            </div>
          </div>

          {clientDossier.consultationSummary && (
            <div className="mt-2.5 bg-black/40 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              <span className="font-bold text-amber-400">Agent Brief: </span>
              {clientDossier.consultationSummary}
            </div>
          )}
        </div>
      )}

      {/* Main Bar Controls Area */}
      <div className="p-4 space-y-3.5">
        
        {/* Input Controls */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Microphone Tap Button */}
          <button
            onClick={toggleVoice}
            className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 shrink-0 w-full md:w-auto shadow-sm cursor-pointer ${
              isListening 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30 scale-102 ring-4 ring-rose-500/30' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isListening ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Tap to Stop & Send</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Tap to Speak</span>
              </>
            )}
          </button>

          {/* Text Query Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitQuery(textInput);
            }}
            className="flex-1 w-full flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white rounded-2xl border border-slate-200 px-4 py-1.5 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            
            <input
              type="text"
              placeholder={isListening ? (transcript || 'Listening to your voice...') : "Ask: 'Show 3 bedroom homes', 'Site prep and crawlspace requirements', 'ZERH energy specs', 'Clayton warranty'..."}
              value={isListening ? transcript : textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isListening}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-2"
            />

            {isLoading ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
                <span>Searching models...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition-opacity shrink-0 cursor-pointer"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Live Active Voice Listening Indicator */}
        {isListening && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl animate-in fade-in duration-200 text-xs text-rose-900">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <span className="font-bold">Listening... Speak now:</span>
              <span className="italic text-slate-700">
                {transcript || '"Looking for a 3-bedroom home in Port Orchard..."'}
              </span>
            </div>
            <button
              onClick={stopListeningAndSend}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Mic Error Notice */}
        {micError && (
          <div className="flex items-center justify-between gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{micError}</span>
            </div>
            <button
              onClick={() => setMicError(null)}
              className="p-1 hover:bg-amber-100 rounded text-amber-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="shrink-0 text-slate-400 font-semibold uppercase tracking-wider text-[10px] pl-1">
            Try Asking:
          </span>
          {quickActionPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmitQuery(item.query)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-medium transition-all border border-slate-200/80 hover:border-slate-300 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Latest Response Card (when not in expanded dialog mode) - Placed directly beneath input box! */}
        {!isExpandedChat && lastAiResponse && (
          <div className="bg-gradient-to-r from-amber-50/70 via-white to-slate-50 border border-amber-200/80 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-300 shrink-0 mt-0.5 shadow-sm">
                  <img 
                    src="/assets/aistudio/Homerrond_bcc0bd0c.jpg" 
                    alt="Guide" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Showroom Guide:</span>
                    {lastAiResponse.action && (
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                        <span>Action: {lastAiResponse.action.replace('_', ' ')}</span>
                      </span>
                    )}
                  </div>
                  {renderFormattedText(lastAiResponse.conversationalResponse)}
                </div>
              </div>

              {/* Action Buttons for this response */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                <button
                  onClick={() => speakText(lastAiResponse.conversationalResponse)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                  title="Replay voice audio"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Replay</span>
                </button>

                {lastAiResponse.action === 'schedule_appointment' && (
                  <button
                    onClick={() => {
                      if (onRequestSpecialist) onRequestSpecialist(clientDossier);
                      else onAiAction(lastAiResponse);
                    }}
                    className="px-3 py-1 text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Meet Specialist</span>
                  </button>
                )}

                {lastAiResponse.action === 'open_3d_tour' && (
                  <button
                    onClick={() => onAiAction(lastAiResponse)}
                    className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open 3D Tour</span>
                  </button>
                )}

                {lastAiResponse.action === 'open_built_homes' && (
                  <button
                    onClick={() => onAiAction(lastAiResponse)}
                    className="px-3 py-1 text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Built Homes</span>
                  </button>
                )}

                {lastAiResponse.action === 'print_spec' && (
                  <button
                    onClick={() => onAiAction(lastAiResponse)}
                    className="px-3 py-1 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Spec Sheet</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expanded Dialogue View: NEWEST MESSAGES AT TOP (Closest to Input Box) */}
        {isExpandedChat && (
          <div className="mt-3 border border-slate-200 rounded-2xl bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Showroom Consultation Stream
                </h3>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  Newest Messages at Top
                </span>
              </div>
              <button 
                onClick={() => {
                  setChatHistory([chatHistory[0]]);
                  setClientDossier({ mustHaveFeatures: [], interestedPlanNames: [], notes: [] });
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                title="Reset dialog"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Memory</span>
              </button>
            </div>

            {/* Conversation Stream with Newest Message at the Very Top! */}
            <div className="max-h-96 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {reversedChatHistory.map((msg, index) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'homer' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300 shrink-0 mt-0.5">
                      <img 
                        src="/assets/aistudio/Homerrond_bcc0bd0c.jpg" 
                        alt="Guide"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className={`max-w-xl rounded-2xl p-3.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                  }`}>
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-70">
                      <span className="font-bold">
                        {msg.sender === 'user' ? 'You' : 'Showroom Guide'}
                        {index === 0 && ' (Latest)'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {msg.sender === 'user' ? (
                      <p className="text-xs">{msg.text}</p>
                    ) : (
                      <div className="space-y-2">
                        {renderFormattedText(msg.text)}

                        {/* Interactive Action Buttons */}
                        {msg.action && (
                          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
                            {msg.action === 'open_3d_tour' && (
                              <button
                                onClick={() => onAiAction({ conversationalResponse: msg.text, action: 'open_3d_tour', matchedFloorplanId: msg.matchedFloorplanId, clientDossier })}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Launch 3D Walkthrough</span>
                              </button>
                            )}

                            {msg.action === 'print_spec' && (
                              <button
                                onClick={() => onAiAction({ conversationalResponse: msg.text, action: 'print_spec', matchedFloorplanId: msg.matchedFloorplanId, clientDossier })}
                                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Spec Sheet</span>
                              </button>
                            )}

                            {msg.action === 'open_built_homes' && (
                              <button
                                onClick={() => onAiAction({ conversationalResponse: msg.text, action: 'open_built_homes', clientDossier })}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>View Built Homes Gallery</span>
                              </button>
                            )}

                            {msg.action === 'schedule_appointment' && (
                              <button
                                onClick={() => {
                                  if (onRequestSpecialist) onRequestSpecialist(clientDossier);
                                  else onAiAction({ conversationalResponse: msg.text, action: 'schedule_appointment', clientDossier });
                                }}
                                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Connect with Specialist</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
