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
  Play
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
  const [lastAiResponse, setLastAiResponse] = useState<AiQueryResult | null>(null);
  
  // Live Client Lead Dossier & Consultation Notes
  const [clientDossier, setClientDossier] = useState<ClientLeadDossier>({
    mustHaveFeatures: [],
    interestedPlanNames: [],
    notes: []
  });

  // Multi-Turn Chat History
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'homer',
      text: "**Hi, I'm HOM̂ER** (Home Options & Model Exploration Resource)! Welcome to Mountain View Homes of Bremerton.\n\nI can step you inside **3D virtual walkthroughs**, explain our **4x6 skid framing specifications**, answer **Kitsap County permitting rules**, or take notes on your dream layout for our sales specialists.\n\n*Do you already have a piece of land in Kitsap or Mason County, or are you looking for property?*",
      timestamp: 'Just now'
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

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
    if (!isListening && transcript.trim().length > 2) {
      handleSubmitQuery(transcript);
    }
  }, [isListening, transcript]);

  // Scroll chat bottom on new messages
  useEffect(() => {
    if (isExpandedChat && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isExpandedChat]);

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
      utterance.pitch = 1.05; // Slightly warm friendly robot pitch
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

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userQuery,
          conversationHistory: updatedHistory.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          clientDossier
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AiQueryResult = await res.json();
      setLastAiResponse(data);

      // Update client dossier if returned
      if (data.clientDossier) {
        setClientDossier(data.clientDossier);
      }

      speakText(data.conversationalResponse);

      const homerMsg: ChatMessage = {
        id: `homer-${Date.now()}`,
        sender: 'homer',
        text: data.conversationalResponse,
        action: data.action,
        matchedFloorplanId: data.matchedFloorplanId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, homerMsg]);

      // Execute applet action & app navigation on client's behalf
      onAiAction(data);
    } catch (err) {
      console.error('AI Query failed:', err);
      const fallbackResponse = "**Hi, I'm HOM̂ER!** I'm keeping track of your preferences for our sales team. Let me know if you would like to explore 3D walkthroughs, check our 4x6 skid framing specs, or wave down a specialist!";
      const fallbackResult: AiQueryResult = {
        conversationalResponse: fallbackResponse,
        action: 'general_advice',
      };
      setLastAiResponse(fallbackResult);
      speakText(fallbackResponse);

      setChatHistory(prev => [
        ...prev,
        {
          id: `homer-${Date.now()}`,
          sender: 'homer',
          text: fallbackResponse,
          action: 'general_advice',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render markdown bold and bullets cleanly
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-xs text-slate-800 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Bullet list items
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
            const cleanContent = trimmed.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: parseBoldTags(cleanContent) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: parseBoldTags(trimmed) }} />
          );
        })}
      </div>
    );
  };

  const parseBoldTags = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');
  };

  const quickActionPrompts = [
    { label: "🌲 I Have Land in Poulsbo", query: "I have 3 acres in Poulsbo and want to know how permits work and what home fits" },
    { label: "📐 4x6 Skid Framing Specs", query: "Tell me about your 4x6 skid foundation framing specifications" },
    { label: "👓 3D Virtual Walkthroughs", query: "Show me inside with a 3D virtual tour" },
    { label: "🏡 Homes We Have Built", query: "Show me real homes built and installed by Mountain View Homes" },
    { label: "💰 3-Bed Double-Wide Under $180k", query: "Find 3 bedroom double wide homes under 180k with island kitchen" },
    { label: "📋 Print Take-Home Spec Sheet", query: "Print a specification sheet with blueprint" },
    { label: "🤝 Speak With a Specialist", query: "I am ready to speak with a sales specialist and join the showroom waitlist" }
  ];

  const hasDossierNotes = Boolean(
    clientDossier.clientName || 
    clientDossier.propertyLocation || 
    clientDossier.propertyStatus || 
    clientDossier.bedroomsNeeded || 
    clientDossier.targetBudget || 
    clientDossier.mustHaveFeatures.length > 0
  );

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden select-none transition-all">
      
      {/* Top HOMER Identity Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        
        {/* HOMER Robot Brand Profile */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 ${
              isListening 
                ? 'border-rose-400 ring-4 ring-rose-500/30 scale-105' 
                : isLoading 
                ? 'border-amber-400 ring-4 ring-amber-500/30 animate-pulse' 
                : 'border-amber-400/80 shadow-md'
            }`}>
              <img 
                src="/assets/aistudio/Homerrond_bcc0bd0c.jpg" 
                alt="HOM̂ER - Home Options & Model Exploration Resource"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Status dot */}
            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1 font-mono">
                HOM̂ER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Interactive Kiosk Concierge
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              HOME OPTIONS & MODEL EXPLORATION RESOURCE
            </p>
          </div>
        </div>

        {/* Action Controls: Consultation Notes, Mute, Chat History, and Wave Down Specialist */}
        <div className="flex items-center gap-2">
          
          {/* Client Consultation Dossier Button */}
          <button
            onClick={() => setIsDossierOpen(!isDossierOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              hasDossierNotes
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="View notes HOMER has collected on your preferences for the sales specialist"
          >
            <ClipboardList className={`w-3.5 h-3.5 ${hasDossierNotes ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Consultation Notes</span>
            {hasDossierNotes && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {isDossierOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isMuted 
                ? 'bg-slate-800 text-slate-400 border-slate-700' 
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
            }`}
            title={isMuted ? "Audio speech is muted" : "Audio speech is enabled"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline text-[11px]">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          {/* Chat History Drawer Toggle */}
          <button
            onClick={() => setIsExpandedChat(!isExpandedChat)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isExpandedChat 
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isExpandedChat ? 'Hide Dialog' : 'Chat History'}</span>
          </button>

          {/* Wave Down Specialist Escalation Button */}
          <button
            onClick={() => {
              if (onRequestSpecialist) {
                onRequestSpecialist(clientDossier);
              } else {
                onAiAction({
                  conversationalResponse: "I've alerted the sales desk to wave down a Mountain View Homes specialist to assist you right now!",
                  action: 'schedule_appointment',
                  clientDossier
                });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-slate-950" />
            <span>Wave Down Specialist</span>
          </button>
        </div>

      </div>

      {/* Live Client Consultation Dossier Drawer (when open) */}
      {isDossierOpen && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-4 border-b border-emerald-900/40 text-xs animate-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                HOM̂ER's Client Consultation Dossier
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Auto-Gathering Notes for Sales Desk
              </span>
            </div>

            <button
              onClick={() => {
                if (onRequestSpecialist) onRequestSpecialist(clientDossier);
                else onAiAction({ conversationalResponse: "Forwarding notes to sales desk", action: 'schedule_appointment', clientDossier });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Forward Notes to Sales Desk</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-[11px]">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Client Name</span>
              <strong className="text-white text-xs">{clientDossier.clientName || 'Showroom Guest'}</strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Land / Property</span>
              <strong className="text-emerald-400 text-xs">
                {clientDossier.propertyLocation ? `In ${clientDossier.propertyLocation}` : (clientDossier.propertyStatus || 'Not specified yet')}
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Target Layout & Budget</span>
              <strong className="text-amber-400 text-xs">
                {clientDossier.bedroomsNeeded ? `${clientDossier.bedroomsNeeded} Beds` : 'Flexible Beds'}
                {clientDossier.targetBudget ? ` · ${clientDossier.targetBudget}` : ''}
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
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

      {/* Main Bar Interactive Area */}
      <div className="p-4 space-y-3.5">
        
        {/* Input Controls */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Microphone Tap Button */}
          <button
            onClick={toggleVoice}
            className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 shrink-0 w-full md:w-auto shadow-sm cursor-pointer ${
              isListening 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30 scale-102 ring-4 ring-rose-500/30' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isListening ? (
              <>
                <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span>Listening to you... Speak now</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Tap to Speak to HOM̂ER</span>
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
              placeholder={isListening ? (transcript || 'Listening to your voice...') : "Ask HOM̂ER: 'We have land in Poulsbo', 'Open 3D tour for Tempo', '4x6 skid specs'..."}
              value={isListening ? transcript : textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isListening}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-2"
            />

            {isLoading ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
                <span>Consulting HOM̂ER...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition-opacity shrink-0 cursor-pointer"
                title="Send question to HOM̂ER"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

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

        {/* Latest Response Card (when not in expanded dialog mode) */}
        {!isExpandedChat && lastAiResponse && (
          <div className="bg-gradient-to-r from-amber-50/70 via-white to-slate-50 border border-amber-200/80 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-300 shrink-0 mt-0.5 shadow-sm">
                  <img 
                    src="/assets/aistudio/Homerrond_bcc0bd0c.jpg" 
                    alt="HOM̂ER" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">HOM̂ER says:</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md font-mono">
                      Showroom Concierge
                    </span>
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

        {/* Expanded Interactive Dialogue View with Memory */}
        {isExpandedChat && (
          <div className="mt-3 border border-slate-200 rounded-2xl bg-slate-50/70 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  HOM̂ER Interactive Dialogue Session · Memory Active
                </h3>
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

            {/* Scrollable Conversation Stream */}
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'homer' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300 shrink-0 mt-0.5">
                      <img 
                        src="/assets/aistudio/Homerrond_bcc0bd0c.jpg" 
                        alt="HOMER"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className={`max-w-xl rounded-2xl p-3.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                  }`}>
                    {msg.sender === 'user' ? (
                      <p className="text-xs">{msg.text}</p>
                    ) : (
                      <div className="space-y-2">
                        {renderFormattedText(msg.text)}

                        {/* Interactive Buttons on HOMER responses */}
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
                                <span>Print This Spec Sheet</span>
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
                                  else onAiAction({ conversationalResponse: msg.text, action: 'schedule_appointment', matchedFloorplanId: msg.matchedFloorplanId, clientDossier });
                                }}
                                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Wave Down Showroom Specialist</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-1 flex items-center justify-end text-[9px] text-slate-400">
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
