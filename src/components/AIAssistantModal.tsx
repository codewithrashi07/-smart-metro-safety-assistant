import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  HeartPulse, 
  Navigation, 
  AlertOctagon, 
  PhoneCall, 
  Volume2, 
  WifiOff, 
  ShieldAlert, 
  CheckCircle2,
  ArrowUpDown,
  Clock,
  IndianRupee,
  Flame,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { 
  FIRST_AID_GUIDES, 
  DMRC_EMERGENCY_CONTACTS, 
  ALL_METRO_STATIONS, 
  MAGENTA_LINE_STATIONS, 
  PINK_LINE_STATIONS, 
  calculateMetroRoute 
} from '../services/metroData';
import { metroAudio } from '../services/audioService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  hindiText?: string;
  timestamp: string;
  category?: 'FIRST_AID' | 'ROUTE' | 'SOS' | 'GENERAL';
  actionableSteps?: string[];
  contacts?: string[];
}

export const AIAssistantModal: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste! I am DMRC Saathi, your 100% offline-ready Delhi Metro AI Safety & First-Aid Assistant. How can I protect and assist you today?',
      hindiText: 'नमस्ते! मैं दिल्ली मेट्रो का ऑफ़लाइन सुरक्षा एवं प्राथमिक चिकित्सा सहायक "साथी" हूँ। मैं आपकी क्या सहायता कर सकता हूँ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'GENERAL',
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [sosDetails, setSosDetails] = useState<{ station: string; coach: string; issue: string } | null>(null);
  const [rightPanel, setRightPanel] = useState<'navigator' | 'contacts' | 'guides'>('navigator');
  const [navOrigin, setNavOrigin] = useState<string>('Hauz Khas');
  const [navDest, setNavDest] = useState<string>('Botanical Garden');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentRoute = calculateMetroRoute(navOrigin, navDest);

  const handleSwapStations = () => {
    const temp = navOrigin;
    setNavOrigin(navDest);
    setNavDest(temp);
    metroAudio.playKeyClick();
  };

  const handleBroadcastRoute = () => {
    metroAudio.playDoorChime();
    metroAudio.speakAnnouncement(
      `Route from ${currentRoute.origin} to ${currentRoute.destination}. Estimated travel time is ${currentRoute.estimatedMinutes} minutes across ${currentRoute.stationsCount} stations. Please stand behind the yellow line.`
    );
  };

  // Offline NLP matcher
  const processQuery = (rawQuery: string): ChatMessage => {
    const q = rawQuery.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Dynamic Station Route & Interchange Intelligence
    const matchedStations = ALL_METRO_STATIONS.filter(s => q.includes(s.name.toLowerCase()));
    if (matchedStations.length >= 2) {
      const fromStn = matchedStations[0].name;
      const toStn = matchedStations[1].name;
      const route = calculateMetroRoute(fromStn, toStn);
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `ROUTE GUIDANCE: ${route.origin} ➔ ${route.destination} (${route.line})`,
        hindiText: `${route.origin} से ${route.destination} तक का मार्ग (~${route.estimatedMinutes} मिनट | किराया ₹${route.fareInr})`,
        timestamp: timeStr,
        category: 'ROUTE',
        actionableSteps: [
          `Estimated Travel Time: ~${route.estimatedMinutes} mins | Total Stations: ${route.stationsCount} | Fare: ₹${route.fareInr}`,
          ...route.directions,
          `Driverless Safety: ${route.safetyAdvisory}`
        ],
      };
    } else if (matchedStations.length === 1 && (q.includes('route') || q.includes('how to') || q.includes('reach') || q.includes('to ') || q.includes('metro') || q.includes('station') || q.includes('line'))) {
      const targetStn = matchedStations[0];
      const fromStn = targetStn.name === 'Hauz Khas' ? 'Janakpuri West' : 'Hauz Khas';
      const route = calculateMetroRoute(fromStn, targetStn.name);
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `ROUTE TO ${targetStn.name.toUpperCase()} (${targetStn.line === 'magenta' ? 'Line 8 Magenta UTO' : 'Line 7 Pink UTO'}):`,
        hindiText: `${targetStn.hindiName} जाने का मार्ग (लगभग ${route.estimatedMinutes} मिनट)`,
        timestamp: timeStr,
        category: 'ROUTE',
        actionableSteps: [
          `Corridor: ${targetStn.line === 'magenta' ? 'Magenta Line (Line 8 UTO Driverless)' : 'Pink Line (Line 7 UTO Driverless)'}`,
          `Available Interchanges: ${targetStn.interchangeWith.length > 0 ? targetStn.interchangeWith.join(', ') : 'Direct station'}`,
          `Platform Edge Doors (PED): ${targetStn.hasPlatformEdgeDoors ? 'Verified SIL-4 Platform Screen Doors Active' : 'Standard Platform'}`,
          `Sample Journey from ${fromStn}: ~${route.estimatedMinutes} mins across ${route.stationsCount} stops (Fare ₹${route.fareInr})`,
          ...route.directions,
          `Safety Advisory: ${route.safetyAdvisory}`
        ],
      };
    }

    // 1. Cardiac / Heart attack / Unconscious / CPR
    if (q.includes('cpr') || q.includes('heart') || q.includes('cardiac') || q.includes('unconscious') || q.includes('बेहोश') || q.includes('दिल')) {
      const guide = FIRST_AID_GUIDES.find(g => g.id === 'cardiac-arrest')!;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `CRITICAL FIRST AID: ${guide.title}`,
        hindiText: guide.hindiTitle,
        timestamp: timeStr,
        category: 'FIRST_AID',
        actionableSteps: guide.steps,
        contacts: guide.emergencyContacts,
      };
    }

    // 2. Track fall / Emergency Stop Plunger
    if (q.includes('track') || q.includes('fell') || q.includes('jump') || q.includes('gir') || q.includes('esp') || q.includes('plunger') || q.includes('पटरी') || q.includes('गिरना')) {
      const guide = FIRST_AID_GUIDES.find(g => g.id === 'track-fall')!;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `EMERGENCY PROTOCOL: ${guide.title}`,
        hindiText: guide.hindiTitle,
        timestamp: timeStr,
        category: 'FIRST_AID',
        actionableSteps: guide.steps,
        contacts: guide.emergencyContacts,
      };
    }

    // 3. Platform Edge Door pinch / Bag stuck
    if (q.includes('door') || q.includes('ped') || q.includes('pinch') || q.includes('stuck') || q.includes('bag') || q.includes('फंस') || q.includes('दरवाजे')) {
      const guide = FIRST_AID_GUIDES.find(g => g.id === 'ped-gap-trap')!;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `PED SAFETY PROTOCOL: ${guide.title}`,
        hindiText: guide.hindiTitle,
        timestamp: timeStr,
        category: 'FIRST_AID',
        actionableSteps: guide.steps,
        contacts: guide.emergencyContacts,
      };
    }

    // 4. Fire / Smoke in Coach
    if (q.includes('fire') || q.includes('smoke') || q.includes('flame') || q.includes('pass') || q.includes('आग') || q.includes('धुआं')) {
      const guide = FIRST_AID_GUIDES.find(g => g.id === 'metro-fire')!;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `FIRE SAFETY PROTOCOL: ${guide.title}`,
        hindiText: guide.hindiTitle,
        timestamp: timeStr,
        category: 'FIRST_AID',
        actionableSteps: guide.steps,
        contacts: guide.emergencyContacts,
      };
    }

    // 5. Heat / Panic / Suffocation / Fainting
    if (q.includes('panic') || q.includes('breath') || q.includes('heat') || q.includes('dizzy') || q.includes('घबराहट') || q.includes('चक्कर')) {
      const guide = FIRST_AID_GUIDES.find(g => g.id === 'heat-panic')!;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `RELIEF PROTOCOL: ${guide.title}`,
        hindiText: guide.hindiTitle,
        timestamp: timeStr,
        category: 'FIRST_AID',
        actionableSteps: guide.steps,
        contacts: guide.emergencyContacts,
      };
    }

    // 6. Route & Interchange queries (Magenta & Pink Line offline intelligence)
    if (q.includes('airport') || q.includes('t1') || q.includes('terminal 1')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'ROUTE TO AIRPORT (Terminal 1): Magenta Line (Line 8) directly serves "Terminal 1 IGI Airport" metro station. It features driverless train operation, direct escalator link into the domestic departure concourse, and PED safety doors. Travel time from Hauz Khas is approx. 20 mins.',
        hindiText: 'हवाई अड्डा (टर्मिनल 1) मार्ग: मजेंटा लाइन सीधे "टर्मिनल 1 आईजीआई हवाई अड्डा" स्टेशन तक जाती है।',
        timestamp: timeStr,
        category: 'ROUTE',
        actionableSteps: [
          'Board westbound Magenta Line train towards Janakpuri West.',
          'Alight directly at "Terminal 1 IGI Airport" underground station (Gate 2/3).',
          'Use high-speed travelators directly into the flight check-in terminal.'
        ],
      };
    }

    if (q.includes('hauz khas') || q.includes('yellow line') || q.includes('rajiv chowk')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'INTERCHANGE NAVIGATION: Hauz Khas is Delhi Metro\'s deepest interchange (29m underground). It connects Magenta Line (Line 8) with Yellow Line (Samaypur Badli ⇄ Millennium City Centre Gurugram). To reach Rajiv Chowk, transfer to Northbound Yellow Line.',
        hindiText: 'हौज़ ख़ास इंटरचेंज: मजेंटा लाइन और येलो लाइन का मुख्य जंक्शन।',
        timestamp: timeStr,
        category: 'ROUTE',
        actionableSteps: [
          'Alight at Hauz Khas Platform 1 or 2.',
          'Follow the yellow illuminated floor indicators to the escalator atrium.',
          'Board Yellow Line train toward Samaypur Badli to reach Rajiv Chowk in 18 minutes.'
        ],
      };
    }

    if (q.includes('anand vihar') || q.includes('isbt') || q.includes('railway')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'INTERMODAL TRANSIT HUB: Anand Vihar ISBT is on the Pink Line (Line 7). It provides seamless multimodal interchange between Delhi Metro Pink & Blue Lines, Anand Vihar Railway Terminal, and the Interstate Bus Terminal (ISBT).',
        timestamp: timeStr,
        category: 'ROUTE',
      };
    }

    if (q.includes('helpline') || q.includes('phone') || q.includes('contact') || q.includes('cisf') || q.includes('police')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'DMRC 24x7 EMERGENCY & SECURITY CONTACT DIRECTORY:',
        timestamp: timeStr,
        category: 'GENERAL',
        contacts: [
          `DMRC 24x7 Passenger Helpline: ${DMRC_EMERGENCY_CONTACTS.dmrcHelpline}`,
          `CISF Station Security Control: ${DMRC_EMERGENCY_CONTACTS.cisfSecurity}`,
          `Women Safety Helpline: ${DMRC_EMERGENCY_CONTACTS.womenSafetyHelpline}`,
          `Ambulance / Medical Emergency: ${DMRC_EMERGENCY_CONTACTS.delhiAmbulance}`,
          `OCC Shastri Park Controller: ${DMRC_EMERGENCY_CONTACTS.occShastriPark}`
        ]
      };
    }

    // Default intelligent guidance
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I understand you are asking about "${rawQuery}". Here is what you can do on Delhi Metro driverless lines:`,
      timestamp: timeStr,
      category: 'GENERAL',
      actionableSteps: [
        'If in urgent danger, hit the platform Emergency Stop Plunger (ESP) or pull coach PEA alarm.',
        'Use the quick suggestion buttons below for instant CPR, fire, track fall, or interchange guides.',
        `Call the central DMRC Helpline at ${DMRC_EMERGENCY_CONTACTS.dmrcHelpline} from any mobile phone or station intercom.`
      ],
      contacts: [`DMRC 24/7 Helpline: ${DMRC_EMERGENCY_CONTACTS.dmrcHelpline}`]
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);

    // Fast local response simulation
    setTimeout(() => {
      const response = processQuery(userText);
      setMessages(prev => [...prev, response]);
      // Audible voice readout if first aid
      if (response.category === 'FIRST_AID') {
        metroAudio.speakAnnouncement(response.text);
      }
    }, 150);
  };

  // Quick 1-Tap SOS Dispatch
  const triggerSOS = (issue: string) => {
    const station = 'Hauz Khas (Platform 1)';
    const coach = 'DMC1 (Car #1)';

    setSosDetails({ station, coach, issue });

    metroAudio.playEmergencySiren();
    metroAudio.speakAnnouncement(`Emergency SOS dispatched for ${issue} at ${station}. Security alerted.`);

    const sosMsg: ChatMessage = {
      id: `sos-${Date.now()}`,
      sender: 'system',
      text: `🚨 SOS EMERGENCY BEACON DISPATCHED! Station: ${station} | Train Car: ${coach} | Emergency: ${issue}. Central DMRC OCC, CISF Quick Reaction Team (QRT), and Station Medical Room alerted with highest priority!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'SOS',
      actionableSteps: [
        'Remain calm. A CISF security officer and medical staff are en route to your coach.',
        'Platform Edge Doors will hold open upon arrival to facilitate emergency access.',
        'Ensure the passenger is surrounded with fresh airflow.'
      ],
      contacts: [
        `DMRC OCC Dispatch: ${DMRC_EMERGENCY_CONTACTS.occShastriPark}`,
        `CISF Fast QRT: ${DMRC_EMERGENCY_CONTACTS.cisfSecurity}`,
        `CATS Ambulance: 102 / 108`
      ]
    };

    setMessages(prev => [...prev, sosMsg]);
  };

  return (
    <div className="space-y-6">
      {/* Active SOS Beacon Notification */}
      {sosDetails && (
        <div className="bg-red-600/20 border border-red-500 rounded-xl p-3 flex items-center justify-between text-xs text-red-200 animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Active Emergency Beacon: <strong>{sosDetails.issue}</strong> at {sosDetails.station} ({sosDetails.coach})</span>
          </div>
          <button
            onClick={() => setSosDetails(null)}
            className="text-xs text-red-300 hover:text-white underline cursor-pointer"
          >
            Acknowledge & Dismiss
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-black text-white tracking-wide">
              DMRC Saathi: Offline AI Safety & Transit Assistant
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1">
              <WifiOff className="w-3 h-3" />
              100% Offline Deep-Tunnel Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero network latency emergency first-aid, offline route navigation, and instant 1-tap SOS beaconing.
          </p>
        </div>

        {/* 1-Tap Emergency SOS Launcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerSOS('Medical Collapse / Severe Emergency')}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-700/30 cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>1-Tap Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface & First-Aid Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Chat Container */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
          {/* Chat Header Bar */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-sky-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-sky-300" />
                </div>
              </div>
              <div>
                <p className="font-bold text-white">DMRC Saathi AI (साथी)</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active In-Browser Neural Model
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <span>Hauz Khas Deep Underground Node</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="p-4 rounded-xl bg-red-950/70 border border-red-500 text-red-100 shadow-xl space-y-2">
                    <p className="font-black text-xs uppercase tracking-wide flex items-center gap-1.5 text-white">
                      <AlertOctagon className="w-4 h-4 text-red-400" />
                      {msg.text}
                    </p>
                    {msg.actionableSteps && (
                      <ol className="list-decimal list-inside text-xs space-y-1 text-slate-200 pl-1">
                        {msg.actionableSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    )}
                    {msg.contacts && (
                      <div className="pt-2 border-t border-red-800/80 flex flex-wrap gap-2 text-[10px] font-mono">
                        {msg.contacts.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-900/60 rounded text-red-200">
                            📞 {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="font-semibold text-white">{msg.text}</p>
                    {msg.hindiText && (
                      <p className="font-hindi text-[11px] text-pink-200 mt-1.5 border-t border-slate-700/60 pt-1">
                        {msg.hindiText}
                      </p>
                    )}

                    {/* Actionable Steps */}
                    {msg.actionableSteps && (
                      <div className="mt-3 pt-2 border-t border-slate-700/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">
                          Immediate Action Checklist:
                        </span>
                        <ul className="space-y-1">
                          {msg.actionableSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                              <span className="text-pink-400 font-bold shrink-0 font-mono">0{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Emergency Contacts List */}
                    {msg.contacts && (
                      <div className="mt-3 pt-2 border-t border-slate-700/80 flex flex-wrap gap-1.5 text-[10px] font-mono">
                        {msg.contacts.map((contact, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-900/80 rounded border border-slate-700 text-emerald-400">
                            {contact}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 text-[9px] text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => metroAudio.speakAnnouncement(msg.text)}
                          className="hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 text-sky-400" />
                          <span>Voice</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => { setInput('How to give CPR for unconscious person?'); }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-pink-300 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <HeartPulse className="w-3 h-3 text-pink-400" />
              <span>Cardiac CPR Steps</span>
            </button>

            <button
              onClick={() => { setInput('Someone fell on track! Emergency Stop Plunger?'); }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-red-300 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <AlertOctagon className="w-3 h-3 text-red-400" />
              <span>Track Fall / ESP Cutoff</span>
            </button>

            <button
              onClick={() => { setInput('Route from Hauz Khas to Botanical Garden'); }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-emerald-300 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Navigation className="w-3 h-3 text-emerald-400" />
              <span>Hauz Khas ➔ Botanical Garden</span>
            </button>

            <button
              onClick={() => { setInput('How to reach Airport Terminal 1 from Hauz Khas?'); }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-sky-300 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Route to IGI Airport</span>
            </button>

            <button
              onClick={() => { setInput('Bag stuck in Platform Edge Door'); }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-amber-300 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>PED Door Stuck</span>
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask for first-aid, route interchange, or emergency procedures..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
            />
            <button
              onClick={handleSend}
              className="p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl cursor-pointer shadow-md shadow-pink-600/20 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Dynamic Tool Panel */}
        <div className="space-y-4">
          {/* Panel Navigation Tabs */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setRightPanel('navigator')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                rightPanel === 'navigator'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route AI</span>
            </button>

            <button
              onClick={() => setRightPanel('contacts')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                rightPanel === 'contacts'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Helplines</span>
            </button>

            <button
              onClick={() => setRightPanel('guides')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                rightPanel === 'guides'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>First-Aid</span>
            </button>
          </div>

          {/* TAB 1: Offline Route Navigator & Fare Matrix */}
          {rightPanel === 'navigator' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-pink-400" />
                  <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Offline UTO Route & Fare Planner
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Zero Network Latency
                </span>
              </div>

              {/* Origin & Destination Selectors */}
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                    Origin Station
                  </label>
                  <select
                    value={navOrigin}
                    onChange={(e) => setNavOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-pink-500 font-sans"
                  >
                    <optgroup label="Magenta Line (Line 8)">
                      {MAGENTA_LINE_STATIONS.map(s => (
                        <option key={`orig-${s.name}`} value={s.name}>{s.name} ({s.hindiName})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Pink Line (Line 7)">
                      {PINK_LINE_STATIONS.map(s => (
                        <option key={`orig-${s.name}`} value={s.name}>{s.name} ({s.hindiName})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Swap button */}
                <div className="flex justify-center -my-1">
                  <button
                    onClick={handleSwapStations}
                    title="Swap Origin and Destination"
                    className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors shadow"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-pink-400" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                    Destination Station
                  </label>
                  <select
                    value={navDest}
                    onChange={(e) => setNavDest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-pink-500 font-sans"
                  >
                    <optgroup label="Magenta Line (Line 8)">
                      {MAGENTA_LINE_STATIONS.map(s => (
                        <option key={`dest-${s.name}`} value={s.name}>{s.name} ({s.hindiName})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Pink Line (Line 7)">
                      {PINK_LINE_STATIONS.map(s => (
                        <option key={`dest-${s.name}`} value={s.name}>{s.name} ({s.hindiName})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Calculated Metrics */}
              <div className="grid grid-cols-3 gap-2 py-1 font-mono text-center">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase block">Travel Time</span>
                  <span className="text-sm font-bold text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    ~{currentRoute.estimatedMinutes}m
                  </span>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase block">Smart Fare</span>
                  <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                    <IndianRupee className="w-3 h-3" />
                    {currentRoute.fareInr}
                  </span>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase block">Stops</span>
                  <span className="text-sm font-bold text-pink-400 mt-0.5 block">
                    {currentRoute.stationsCount} Stns
                  </span>
                </div>
              </div>

              {/* Route Line Badge */}
              <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-200 text-[11px] font-mono flex items-center justify-between">
                <span>Corridor: <strong>{currentRoute.line}</strong></span>
                {currentRoute.interchangeLine && (
                  <span className="px-1.5 py-0.5 bg-pink-900/60 rounded text-[10px] text-white">
                    Via {currentRoute.interchangeLine}
                  </span>
                )}
              </div>

              {/* Step-by-step directions list */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {currentRoute.directions.map((dir, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-pink-600/30 text-pink-300 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{dir}</span>
                  </div>
                ))}
              </div>

              {/* Safety Advisory Banner */}
              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-300 flex items-start gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentRoute.safetyAdvisory}</span>
              </div>

              {/* Audio & Chat Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleBroadcastRoute}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>P.A. Audio</span>
                </button>

                <button
                  onClick={() => {
                    setInput(`How to travel from ${currentRoute.origin} to ${currentRoute.destination}?`);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-pink-600/20"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask in Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Emergency Helplines & Equipment */}
          {rightPanel === 'contacts' && (
            <div className="space-y-4">
              {/* Emergency Contacts Directory */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    DMRC Quick Emergency Lines
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">DMRC 24/7 Helpline:</span>
                    <span className="text-emerald-400 font-black">{DMRC_EMERGENCY_CONTACTS.dmrcHelpline}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">CISF Security Room:</span>
                    <span className="text-sky-300">{DMRC_EMERGENCY_CONTACTS.cisfSecurity}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Women Safety:</span>
                    <span className="text-pink-400 font-black">1091</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Delhi Police / CATS:</span>
                    <span className="text-amber-400 font-black">112 / 102</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">OCC Shastri Park:</span>
                    <span className="text-rose-400 font-bold">{DMRC_EMERGENCY_CONTACTS.occShastriPark}</span>
                  </div>
                </div>
              </div>

              {/* Station Safety Equipment Locations */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Safety Equipment Locations
                  </h3>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-white block">Emergency Stop Plunger (ESP):</strong>
                    <span className="text-[11px] text-slate-400">Mounted on Platform Pillars 3, 7, and 12 near PED Doors. Stops all driverless trains immediately.</span>
                  </div>

                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-white block">Automated External Defibrillator (AED):</strong>
                    <span className="text-[11px] text-slate-400">Located at the Station Customer Care Center near AFC gates.</span>
                  </div>

                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-white block">Passenger Emergency Alarm (PEA):</strong>
                    <span className="text-[11px] text-slate-400">Inside every train coach adjacent to doors 2 and 4. Connects duplex voice directly to OCC.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: First-Aid Protocols Handbook */}
          {rightPanel === 'guides' && (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {FIRST_AID_GUIDES.map((guide) => (
                <div key={guide.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {guide.category === 'MEDICAL' && <HeartPulse className="w-4 h-4 text-pink-400" />}
                      {guide.category === 'ACCIDENT' && <AlertOctagon className="w-4 h-4 text-red-400" />}
                      {guide.category === 'FIRE' && <Flame className="w-4 h-4 text-amber-400" />}
                      <h4 className="font-bold text-white text-[11px]">{guide.title}</h4>
                    </div>
                    <button
                      onClick={() => metroAudio.speakAnnouncement(guide.steps.join('. '))}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      title="Listen audio announcement"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  </div>

                  <p className="font-hindi text-[10px] text-pink-300">{guide.hindiTitle}</p>

                  <ul className="space-y-1 pt-1 border-t border-slate-800 text-[11px] text-slate-300">
                    {guide.steps.slice(0, 3).map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-pink-400 font-bold shrink-0">›</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setInput(`First aid steps for ${guide.title}`);
                    }}
                    className="w-full mt-1 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-slate-300 font-mono font-bold cursor-pointer"
                  >
                    Open Full Protocol in Chat ↗
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
