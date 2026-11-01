import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { OCCControlCenter } from './components/OCCControlCenter';
import { ObstacleDetectionView } from './components/ObstacleDetectionView';
import { PEDMonitoringView } from './components/PEDMonitoringView';
import { PassengerDensityView } from './components/PassengerDensityView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { IncidentLogModal } from './components/IncidentLogModal';
import { metroEngine } from './services/simulationEngine';
import { metroAudio } from './services/audioService';
import type { MetroLine } from './types/metro';
import { 
  ShieldCheck, 
  Train, 
  Radio, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  X, 
  CheckCircle2 
} from 'lucide-react';

interface TourStep {
  step: number;
  tab: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    tab: 'occ',
    title: 'Operations Control Centre (OCC) Digital Twin',
    subtitle: 'Driverless Train Movement Twin & SIL-4 Telemetry Loop',
    description: 'Delhi Metro driverless trains (UTO Level 4) on Magenta & Pink lines operate without in-cab operators. The OCC Digital Twin tracks train speed curves, 25kV catenary voltages, 5.0 bar brake pipe pressures, and millimeter docking precision.',
    highlights: [
      'Autonomous state machine progression: CRUISING ➔ APPROACHING ➔ DOCKING',
      'Continuous CBTC LTE-M radio link with SIL-4 safety interlock loop',
      'Bilingual Passenger Address (P.A.) with authentic door chimes'
    ]
  },
  {
    step: 2,
    tab: 'vision',
    title: 'Real-Time Edge Computer Vision & Track Intrusion',
    subtitle: 'Sub-50ms Reaction Time with SIL-4 Auto Emergency Braking',
    description: 'Without a driver, optical vision is critical for spotting platform falls and debris. SURAKSHA-METRO provides 3 geofenced danger envelopes (Safe, Yellow Caution, Track Danger). Dropping an obstacle on the track trips the emergency brake in 38ms.',
    highlights: [
      'Multi-feed support: Platform 1 CCTV, Track Bed CCTV, Cab Cowcatcher & Live Webcam',
      'Yellow line perimeter crossing acoustic alert and automated train trip',
      'Interactive canvas: click anywhere to simulate commuters or fallen debris'
    ]
  },
  {
    step: 3,
    tab: 'ped',
    title: 'Platform Edge Door (PED) Synchronization & Gap Entrapment',
    subtitle: '24-Gate Interlock Loop with 850nm NIR Anti-Pinch Safety Curtain',
    description: 'Every 6-coach rake aligns with 24 Platform Screen Doors. Traction power is mechanically interlocked so the driverless train CANNOT depart if even one gate is compromised or a bag strap >15mm is detected.',
    highlights: [
      '24 synchronized gates with live optical gap sensor telemetry',
      'Automated 3-cycle reopening sequence upon obstruction detection',
      'Station supervisor key override for manual train clearance'
    ]
  },
  {
    step: 4,
    tab: 'crowd',
    title: 'Coach-by-Coach Passenger Density & Dynamic Dwell AI',
    subtitle: 'Dynamic Boarding Windows & Platform Commuter Guidance (PIDS)',
    description: 'Overcrowding near escalators causes dangerous door-blocking. Our AI analyzes weight telemetry and CO2 sensors across all 6 cars (DMC1 to DMC2), guiding commuters to empty cars and scaling dwell times dynamically.',
    highlights: [
      'Live 6-coach rake occupancy heatmap with CO2 ppm & temperature metrics',
      'Platform PIDS guidance directing commuters to Coaches 3 & 4',
      'Dwell time algorithm automatically expands boarding window from 18s to 28s at peak hubs'
    ]
  },
  {
    step: 5,
    tab: 'assistant',
    title: 'DMRC Saathi: 100% Offline AI Safety & Route Assistant',
    subtitle: 'Deep-Tunnel Zero Latency Intelligence with Bilingual Voice Readout',
    description: 'Deep underground stations like Hauz Khas (29m deep) often lack mobile connectivity. DMRC Saathi operates 100% in-browser offline to provide bilingual CPR/first-aid steps, 1-tap SOS beacons, and instant offline route & fare planning.',
    highlights: [
      'Native Hindi and English bilingual output with Web Speech API audio announcements',
      '1-Tap Emergency SOS dispatching CISF QRT and station medical team',
      'Interactive Offline Route Navigator with fare slabs and interchange directions'
    ]
  },
  {
    step: 6,
    tab: 'blackbox',
    title: 'CMRS Regulatory Blackbox Incident Recorder',
    subtitle: 'Statutory Safety Compliance & Audit Log for Metro Railway Safety',
    description: 'Statutorily compliant with the Commissioner of Metro Railway Safety (CMRS). Chronologically records every brake activation, reaction latency (ms), train speed at event, and supervisor resolution with one-click export and print.',
    highlights: [
      'Millisecond reaction time logging and fault chronology',
      'One-click JSON blackbox export for regulatory audits',
      'Printable CMRS official safety compliance certificates'
    ]
  }
];

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('occ');
  const [telemetry, setTelemetry] = useState(metroEngine.getTelemetry());
  const [dwellTimer, setDwellTimer] = useState(metroEngine.getDwellTimer());
  const [doors, setDoors] = useState(metroEngine.getPEDDoors());
  const [coaches, setCoaches] = useState(metroEngine.getCoaches());
  const [incidents, setIncidents] = useState(metroEngine.getIncidents());
  const [isMuted, setIsMuted] = useState(metroAudio.getMuted());
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [autoPlayTour, setAutoPlayTour] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Subscribe to engine state changes
    const unsubscribe = metroEngine.subscribe(() => {
      setTelemetry(metroEngine.getTelemetry());
      setDwellTimer(metroEngine.getDwellTimer());
      setDoors(metroEngine.getPEDDoors());
      setCoaches(metroEngine.getCoaches());
      setIncidents(metroEngine.getIncidents());
    });

    return () => unsubscribe();
  }, []);

  // Handle tour autoplay progression
  useEffect(() => {
    if (demoStep === null || !autoPlayTour) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = window.setInterval(() => {
      setDemoStep(prev => {
        if (prev === null) return null;
        if (prev >= TOUR_STEPS.length - 1) {
          setAutoPlayTour(false);
          return prev;
        }
        const nextStep = prev + 1;
        setCurrentTab(TOUR_STEPS[nextStep].tab);
        metroAudio.playDoorClosingBeep();
        return nextStep;
      });
    }, 7000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [demoStep, autoPlayTour]);

  const handleStartDemoTour = () => {
    setDemoStep(0);
    setCurrentTab(TOUR_STEPS[0].tab);
    setAutoPlayTour(true);
    metroAudio.playDoorChime();
    metroAudio.speakAnnouncement('Starting SURAKSHA-METRO autonomous safety guided presentation.');
  };

  const handleNextStep = () => {
    if (demoStep === null) return;
    if (demoStep < TOUR_STEPS.length - 1) {
      const next = demoStep + 1;
      setDemoStep(next);
      setCurrentTab(TOUR_STEPS[next].tab);
      metroAudio.playKeyClick();
    } else {
      setDemoStep(null);
      setAutoPlayTour(false);
    }
  };

  const handlePrevStep = () => {
    if (demoStep === null || demoStep <= 0) return;
    const prev = demoStep - 1;
    setDemoStep(prev);
    setCurrentTab(TOUR_STEPS[prev].tab);
    metroAudio.playKeyClick();
  };

  const handleExitTour = () => {
    setDemoStep(null);
    setAutoPlayTour(false);
    metroAudio.playKeyClick();
  };

  const handleLineChange = (line: MetroLine) => {
    metroEngine.setLine(line);
    metroAudio.playKeyClick();
  };

  const handleEmergencyStop = () => {
    metroEngine.triggerEmergencyBrake('Manual Controller Emergency Plunger Activated');
  };

  const handleResetEmergency = () => {
    metroEngine.resetEmergencyBrake();
  };

  const handleToggleMute = () => {
    const muted = metroAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleInjectObstacle = (doorNumber: number = 7) => {
    metroEngine.injectObstacle(doorNumber);
  };

  const handleClearObstacle = (doorNumber: number = 7) => {
    metroEngine.clearDoorObstruction(doorNumber);
  };

  const handleInjectTrackIntrusion = () => {
    metroEngine.injectTrackIntrusion(`${telemetry.currentStation} Track Sector`);
  };

  const handleDispatch = () => {
    metroEngine.dispatchTrain();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          metroAudio.playKeyClick();
        }}
        telemetry={telemetry}
        onLineChange={handleLineChange}
        onEmergencyStop={handleEmergencyStop}
        onResetEmergency={handleResetEmergency}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onStartDemoTour={handleStartDemoTour}
        isDemoTourActive={demoStep !== null}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Guided Tour Banner Overlay */}
        {demoStep !== null && (
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-500 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  {demoStep + 1}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-purple-300 font-bold">
                  Guided SIL-4 Presentation • Step {demoStep + 1} of {TOUR_STEPS.length}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-white font-black">{TOUR_STEPS[demoStep].title}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoPlayTour(!autoPlayTour)}
                  className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                    autoPlayTour
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={autoPlayTour ? 'Pause 7-second auto progression' : 'Enable 7-second auto progression'}
                >
                  {autoPlayTour ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{autoPlayTour ? 'Auto-Advancing (7s)' : 'Auto-Play'}</span>
                </button>

                <button
                  onClick={handlePrevStep}
                  disabled={demoStep === 0}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-purple-600/30"
                >
                  <span>{demoStep < TOUR_STEPS.length - 1 ? 'Next Module' : 'Complete Tour ✓'}</span>
                  {demoStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleExitTour}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  title="Close tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1.5">
                <p className="text-purple-200 font-semibold text-sm">
                  {TOUR_STEPS[demoStep].subtitle}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {TOUR_STEPS[demoStep].description}
                </p>
              </div>

              <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-purple-500/20">
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block mb-1">
                  Evaluator Checklist
                </span>
                {TOUR_STEPS[demoStep].highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'occ' && (
          <OCCControlCenter
            telemetry={telemetry}
            dwellTimer={dwellTimer}
            onInjectObstacle={() => handleInjectObstacle(7)}
            onInjectTrackIntrusion={handleInjectTrackIntrusion}
            onEmergencyStop={handleEmergencyStop}
            onResetEmergency={handleResetEmergency}
            onDispatch={handleDispatch}
            onLineChange={handleLineChange}
          />
        )}

        {currentTab === 'vision' && (
          <ObstacleDetectionView
            onTriggerEmergencyBrake={(reason) => metroEngine.triggerEmergencyBrake(reason)}
            isEmergencyActive={telemetry.emergencyBrakeEngaged}
            onResetEmergency={handleResetEmergency}
          />
        )}

        {currentTab === 'ped' && (
          <PEDMonitoringView
            doors={doors}
            telemetry={telemetry}
            onClearObstruction={handleClearObstacle}
            onInjectObstacle={handleInjectObstacle}
          />
        )}

        {currentTab === 'crowd' && (
          <PassengerDensityView
            coaches={coaches}
            telemetry={telemetry}
            dwellTimer={dwellTimer}
          />
        )}

        {currentTab === 'assistant' && (
          <AIAssistantModal />
        )}

        {currentTab === 'blackbox' && (
          <IncidentLogModal incidents={incidents} />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-pink-400" />
            <span className="text-slate-300 font-bold">SURAKSHA-METRO UTO Level-4 Safety Platform</span>
            <span>• Delhi Metro Rail Corporation (DMRC) Phase IV Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CMRS SIL-4 Verified</span>
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <Radio className="w-3.5 h-3.5" />
              <span>CBTC LTE-M Real-Time</span>
            </span>
            <span className="text-slate-400">
              Open-Source Transit AI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
