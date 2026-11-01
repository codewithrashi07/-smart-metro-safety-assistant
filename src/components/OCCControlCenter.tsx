import React from 'react';
import type { 
  TrainTelemetry, 
  MetroLine 
} from '../types/metro';
import { 
  Activity, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  AlertOctagon, 
  Radio, 
  Megaphone, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { metroAudio } from '../services/audioService';

interface OCCControlCenterProps {
  telemetry: TrainTelemetry;
  dwellTimer: { current: number; max: number };
  onInjectObstacle: () => void;
  onInjectTrackIntrusion: () => void;
  onEmergencyStop: () => void;
  onResetEmergency: () => void;
  onDispatch: () => void;
  onLineChange: (line: MetroLine) => void;
}

export const OCCControlCenter: React.FC<OCCControlCenterProps> = ({
  telemetry,
  dwellTimer,
  onInjectObstacle,
  onInjectTrackIntrusion,
  onEmergencyStop,
  onResetEmergency,
  onDispatch,
}) => {
  const isEmergency = telemetry.emergencyBrakeEngaged;

  // Announcement trigger helper
  const handleAnnounce = (type: 'doors' | 'yellow' | 'safety') => {
    if (type === 'doors') {
      metroAudio.playDoorChime();
      metroAudio.speakAnnouncement('Darwaze baanyi taraf khulenge. Doors will open on the left.');
    } else if (type === 'yellow') {
      metroAudio.speakAnnouncement('Kripya peeli rekha se peeche rahein. Please stand behind the yellow safety line.');
    } else {
      metroAudio.speakAnnouncement('This is an autonomous driverless train under continuous SIL-4 supervision.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Speed Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Train Speed</span>
            <Gauge className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black font-mono ${telemetry.speed > 0 ? 'text-white' : 'text-slate-500'}`}>
              {Math.round(telemetry.speed * 10) / 10}
            </span>
            <span className="text-xs text-slate-400">km/h</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (telemetry.speed / 80) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>0</span>
            <span>Target: {telemetry.targetSpeed}</span>
            <span>Max: 80</span>
          </div>
        </div>

        {/* Distance to Station */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Distance</span>
            <ArrowRight className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white">
              {Math.max(0, Math.round(telemetry.distanceToStation))}
            </span>
            <span className="text-xs text-slate-400">m</span>
          </div>
          <p className="text-[11px] text-pink-400 truncate mt-2 font-medium">
            → {telemetry.nextStation}
          </p>
        </div>

        {/* Catenary Voltage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">25kV Catenary</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-amber-300">
              {telemetry.catenaryVoltage}
            </span>
            <span className="text-xs text-slate-400">kV AC</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Substation OHE Nominal</span>
          </div>
        </div>

        {/* Brake Pipe Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Brake Pipe</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black font-mono ${telemetry.brakePipePressure < 4.5 ? 'text-red-400 font-bold' : 'text-emerald-300'}`}>
              {telemetry.brakePipePressure.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">bar</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {telemetry.brakePipePressure === 0 ? 'Vented (EB Active)' : 'Charged (5.0 bar)'}
          </p>
        </div>

        {/* Precision Docking Offset */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Dock Offset</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-cyan-300">
              {telemetry.dockingOffsetMm > 0 ? `+${telemetry.dockingOffsetMm}` : telemetry.dockingOffsetMm}
            </span>
            <span className="text-xs text-slate-400">mm</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2">
            ±150mm DMRC Standard
          </p>
        </div>

        {/* Passengers Onboard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Rake Onboard</span>
            <span className="text-xs text-indigo-400 font-mono">6 Cars</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white">
              {telemetry.passengersOnboard.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">psg</span>
          </div>
          <p className="text-[11px] text-indigo-300 mt-2">
            Capacity: 1,800
          </p>
        </div>
      </div>

      {/* Main Track Visualization & Train Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide">
                Driverless Train Movement Twin
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isEmergency 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : telemetry.state === 'BOARDING'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                State: {telemetry.state}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current: <strong className="text-white">{telemetry.currentStation}</strong> ➔ Next: <strong className="text-white">{telemetry.nextStation}</strong>
            </p>
          </div>

          {/* Dwell timer if boarding */}
          {telemetry.state === 'BOARDING' && (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Dynamic Dwell Buffer</p>
                <p className="text-lg font-black font-mono text-amber-400">
                  {dwellTimer.current}s <span className="text-xs font-normal text-amber-200">/ {dwellTimer.max}s</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* High-Tech Animated Track SVG */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 relative">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
            <span className="flex items-center gap-1.5 text-pink-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              {telemetry.currentStation} (Platform 1)
            </span>
            <span className="text-slate-500 font-semibold tracking-wider">
              UTO SIL-4 CBTC BLOCK #804
            </span>
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              {telemetry.nextStation} (Platform 2)
            </span>
          </div>

          {/* Track Graphic */}
          <div className="relative py-8">
            {/* Railroad Track Ties & Rails */}
            <div className="h-6 w-full bg-slate-900 border-y-2 border-slate-700 relative flex items-center justify-between px-2 overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="w-1 h-full bg-slate-800"></div>
              ))}
              {/* Third Rail / Power Rail indicator */}
              <div className="absolute top-1 left-0 right-0 h-0.5 bg-amber-500/40"></div>
              {/* Yellow Safety Edge Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400/80"></div>
            </div>

            {/* Train Position Element */}
            {(() => {
              // Calculate train position along track (0% to 92%)
              const progress = telemetry.state === 'CRUISING' 
                ? 100 - (telemetry.distanceToStation / 1200) * 100 
                : telemetry.state === 'APPROACHING' 
                ? 70 + (1 - telemetry.distanceToStation / 300) * 20
                : 90;
              const clampedProgress = Math.max(5, Math.min(88, progress));

              return (
                <div 
                  className="absolute top-2 transition-all duration-700 ease-out flex flex-col items-center"
                  style={{ left: `${clampedProgress}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Train Cab Icon */}
                  <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 shadow-2xl ${
                    isEmergency 
                      ? 'bg-red-950 border-red-500 text-red-200 animate-bounce' 
                      : 'bg-slate-900 border-pink-500 text-white shadow-pink-500/20'
                  }`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></div>
                    <span className="text-xs font-black font-mono tracking-wider">{telemetry.trainId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded font-semibold text-pink-300">
                      {Math.round(telemetry.speed)} km/h
                    </span>
                  </div>

                  {/* Beacon indicator */}
                  <div className="w-0.5 h-4 bg-pink-500 mt-1"></div>
                  <div className="w-3 h-3 rounded-full bg-pink-400 border-2 border-slate-950 shadow"></div>
                </div>
              );
            })()}
          </div>

          {/* Sub-track Sensors Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Track Circuit: CLEAR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Balise Transponder: SYNC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Radio CBTC: SIL-4 ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              {telemetry.tractionInterlock ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Traction Loop: CLOSED</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-red-400">Traction Loop: TRIPPED</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Matrix & Operator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety System Health (SIL-4 CBTC Architecture) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Safety Integrity Level (SIL-4)
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <div>
                  <p className="font-bold text-white">Automatic Train Protection (ATP)</p>
                  <p className="text-[10px] text-slate-400">Continuous speed-distance curve enforcement</p>
                </div>
              </div>
              <span className="font-mono text-emerald-400 font-bold uppercase">{telemetry.atpStatus}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <div>
                  <p className="font-bold text-white">Automatic Train Operation (ATO)</p>
                  <p className="text-[10px] text-slate-400">Driverless precision acceleration & stopping</p>
                </div>
              </div>
              <span className="font-mono text-emerald-400 font-bold uppercase">{telemetry.atoStatus}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <div>
                  <p className="font-bold text-white">Platform Door (PED) Interlock</p>
                  <p className="text-[10px] text-slate-400">24-door optical beam & anti-pinch loop</p>
                </div>
              </div>
              <span className={`font-mono font-bold uppercase ${telemetry.tractionInterlock ? 'text-emerald-400' : 'text-red-400'}`}>
                {telemetry.tractionInterlock ? 'LOCKED' : 'INTERLOCK BROKEN'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <div>
                  <p className="font-bold text-white">Obstacle Deflection Detection (ODD)</p>
                  <p className="text-[10px] text-slate-400">Cowcatcher optical lidar & physical trip-bar</p>
                </div>
              </div>
              <span className="font-mono text-emerald-400 font-bold">ARMED</span>
            </div>
          </div>
        </div>

        {/* Fault Injection Panel (For DMRC Operator Training & Hackathon Demonstration) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Fault Injection & Simulator Panel
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Test UTO autonomous fail-safe behavior under live operational stress scenarios:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={onInjectTrackIntrusion}
              className="p-3 bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 rounded-lg text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold mb-1">
                <AlertOctagon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                <span>Track Intrusion</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Trigger CV detection of human or debris on track bed. Commands SIL-4 EB.
              </p>
            </button>

            <button
              onClick={onInjectObstacle}
              className="p-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>PED Door Obstruction</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate bag strap trapped in Platform Edge Door #7 with anti-pinch cycle.
              </p>
            </button>

            {isEmergency ? (
              <button
                onClick={onResetEmergency}
                className="col-span-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                OCC Supervisor Clear & Reset All Interlocks
              </button>
            ) : (
              <button
                onClick={onEmergencyStop}
                className="col-span-full py-3 px-4 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-700/20 cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4" />
                Manual Emergency Brake Plunger (OCC)
              </button>
            )}

            {telemetry.state === 'HOLD' && (
              <button
                onClick={onDispatch}
                className="col-span-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                Authorize Autonomous Train Departure
              </button>
            )}
          </div>
        </div>

        {/* Remote Public Address (PA) Broadcast System */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                OCC Bilingual Passenger P.A.
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Broadcast authentic DMRC bilingual synthesized safety announcements to train cars and station platform:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleAnnounce('doors')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">Doors Opening Left (Chime)</p>
                  <p className="text-[10px] text-slate-400 font-hindi">दरवाजे बायीं तरफ खुलेंगे</p>
                </div>
                <span className="text-sky-400 text-xs font-mono">🔊 Play</span>
              </button>

              <button
                onClick={() => handleAnnounce('yellow')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">Yellow Line Warning</p>
                  <p className="text-[10px] text-slate-400 font-hindi">कृपया पीली रेखा से पीछे रहें</p>
                </div>
                <span className="text-sky-400 text-xs font-mono">🔊 Play</span>
              </button>

              <button
                onClick={() => handleAnnounce('safety')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">UTO Level-4 Safety Assurance</p>
                  <p className="text-[10px] text-slate-400">Autonomous Train Supervision Broadcast</p>
                </div>
                <span className="text-sky-400 text-xs font-mono">🔊 Play</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>OCC Transmit Frequency: 450 MHz DMRC Tetra Radio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
