import React from 'react';
import { ShieldCheck, AlertTriangle, Volume2, VolumeX, Train, Radio, RefreshCw, Octagon } from 'lucide-react';
import type { MetroLine, TrainTelemetry } from '../types/metro';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  telemetry: TrainTelemetry;
  onLineChange: (line: MetroLine) => void;
  onEmergencyStop: () => void;
  onResetEmergency: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  telemetry,
  onLineChange,
  onEmergencyStop,
  onResetEmergency,
  isMuted,
  onToggleMute,
}) => {
  const isEmergency = telemetry.emergencyBrakeEngaged;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-2xl">
      {/* Top Banner Alert Bar if EB is active */}
      {isEmergency && (
        <div className="bg-red-600 text-white px-4 py-2 font-bold flex items-center justify-between animate-pulse text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Octagon className="w-5 h-5" />
            <span>CRITICAL SAFETY INTERLOCK TRIPPED: Emergency Brake Engaged | Traction Cut-off Active</span>
          </div>
          <button
            onClick={onResetEmergency}
            className="bg-white text-red-700 px-3 py-1 rounded text-xs font-black uppercase tracking-wider hover:bg-red-50 flex items-center gap-1 shadow cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> OCC Reset Interlock
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Train className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-sky-300 bg-clip-text text-transparent">
                SURAKSHA-METRO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                UTO Level 4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Delhi Metro Driverless Transit Safety & Autonomous OCC Suite
            </p>
          </div>
        </div>

        {/* Line Switcher & Telemetry Pill */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onLineChange('magenta')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              telemetry.line === 'magenta'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Line 8 (Magenta)
          </button>
          <button
            onClick={() => onLineChange('pink')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              telemetry.line === 'pink'
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-md shadow-pink-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Line 7 (Pink)
          </button>
          <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
          <div className="items-center gap-2 text-xs text-slate-300 px-2 hidden md:flex font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Rake: <strong className="text-white">{telemetry.trainId}</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute DMRC announcements' : 'Mute DMRC announcements'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Master Emergency Brake Button */}
          {!isEmergency ? (
            <button
              onClick={onEmergencyStop}
              className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white px-3 sm:px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-700/30 cursor-pointer active:scale-95 transition-all border border-red-500/50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SIL-4 Stop (EB)</span>
            </button>
          ) : (
            <button
              onClick={onResetEmergency}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-700/30 cursor-pointer active:scale-95 transition-all border border-emerald-500/50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Interlock</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 border-t border-slate-800/80 flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => onTabChange('occ')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            currentTab === 'occ'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Train className="w-4 h-4" />
          OCC Command Center
        </button>

        <button
          onClick={() => onTabChange('vision')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            currentTab === 'vision'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          AI Obstacle & Intrusion Vision
        </button>

        <button
          onClick={() => onTabChange('ped')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            currentTab === 'ped'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Platform Edge Doors (PED)
        </button>

        <button
          onClick={() => onTabChange('crowd')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            currentTab === 'crowd'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-amber-400 text-sm">👥</span>
          Coach Crowd & Dwell AI
        </button>

        <button
          onClick={() => onTabChange('assistant')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            currentTab === 'assistant'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sky-400 text-sm">🤖</span>
          DMRC Saathi (Offline AI)
        </button>

        <button
          onClick={() => onTabChange('blackbox')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            currentTab === 'blackbox'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-rose-400 text-sm">📋</span>
          CMRS Safety Blackbox
        </button>
      </div>
    </header>
  );
};
