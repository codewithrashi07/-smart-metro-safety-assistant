import React, { useState, useEffect } from 'react';
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
import { ShieldCheck, Train, Radio } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('occ');
  const [telemetry, setTelemetry] = useState(metroEngine.getTelemetry());
  const [dwellTimer, setDwellTimer] = useState(metroEngine.getDwellTimer());
  const [doors, setDoors] = useState(metroEngine.getPEDDoors());
  const [coaches, setCoaches] = useState(metroEngine.getCoaches());
  const [incidents, setIncidents] = useState(metroEngine.getIncidents());
  const [isMuted, setIsMuted] = useState(metroAudio.getMuted());

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
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
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
