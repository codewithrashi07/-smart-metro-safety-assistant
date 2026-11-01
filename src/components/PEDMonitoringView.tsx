import React, { useState } from 'react';
import type { PEDDoorState, TrainTelemetry } from '../types/metro';
import { 
  AlertTriangle, 
  DoorClosed, 
  DoorOpen, 
  CheckCircle2, 
  AlertOctagon, 
  Key, 
  Info
} from 'lucide-react';
import { metroAudio } from '../services/audioService';

interface PEDMonitoringViewProps {
  doors: PEDDoorState[];
  telemetry: TrainTelemetry;
  onClearObstruction: (doorNumber: number) => void;
  onInjectObstacle: (doorNumber: number) => void;
}

export const PEDMonitoringView: React.FC<PEDMonitoringViewProps> = ({
  doors,
  telemetry,
  onClearObstruction,
  onInjectObstacle,
}) => {
  const [selectedDoorNum, setSelectedDoorNum] = useState<number>(7);
  const [manualOverrideActive, setManualOverrideActive] = useState<boolean>(false);

  const selectedDoor = doors.find(d => d.doorNumber === selectedDoorNum) || doors[0];
  const allLocked = doors.every(d => d.status === 'CLOSED' && d.interlockLocked);
  const obstructedDoors = doors.filter(d => d.status === 'OBSTRUCTED');

  const handleDoorClick = (num: number) => {
    setSelectedDoorNum(num);
    metroAudio.playKeyClick();
  };

  const handleToggleDoorObstruction = (num: number) => {
    const door = doors.find(d => d.doorNumber === num);
    if (!door) return;

    if (door.status === 'OBSTRUCTED') {
      onClearObstruction(num);
    } else {
      onInjectObstacle(num);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DoorClosed className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-black text-white tracking-wide">
              Platform Edge Door (PED / PSD) Safety Simulation
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase">
              24 Gates Interlocked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            SIL-4 fail-safe door synchronization, gap entrapment prevention, and anti-pinch optical safety curtains.
          </p>
        </div>

        {/* Global Safety State */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg border font-mono text-xs flex items-center gap-2 ${
            allLocked 
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
              : 'bg-red-950/60 border-red-500/60 text-red-300 animate-pulse'
          }`}>
            {allLocked ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">ALL 24 DOORS LOCKED & SECURE</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span className="font-bold">{obstructedDoors.length} DOOR(S) COMPROMISED</span>
              </>
            )}
          </div>

          <button
            onClick={() => setManualOverrideActive(!manualOverrideActive)}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              manualOverrideActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{manualOverrideActive ? 'Supervisor Override Armed' : 'Supervisor Key'}</span>
          </button>
        </div>
      </div>

      {/* 24-Door Platform Layout (Spread across 6 Coaches) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              6-Coach Rake Platform Alignment (Doors 1 to 24)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Train: {telemetry.trainId} @ {telemetry.currentStation}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Closed & Locked
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Open / Boarding
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> Obstructed / Gap Alert
            </span>
          </div>
        </div>

        {/* Coach-by-Coach Grouping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((coachNum) => {
            const coachDoors = doors.filter(d => d.coachNumber === coachNum);
            const coachLabels = ['DMC1 (Front)', 'TC1', 'MC1', 'MC2', 'TC2', 'DMC2 (Rear)'];
            const coachLabel = coachLabels[coachNum - 1];

            return (
              <div 
                key={coachNum} 
                className="bg-slate-950 rounded-xl p-3 border border-slate-800 relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-900">
                  <span className="text-xs font-black text-pink-400 font-mono">
                    {coachLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Car #{coachNum}
                  </span>
                </div>

                {/* 4 Doors for this coach */}
                <div className="grid grid-cols-2 gap-2">
                  {coachDoors.map((door) => {
                    const isSelected = selectedDoor.doorNumber === door.doorNumber;
                    const isObstructed = door.status === 'OBSTRUCTED';
                    const isOpen = door.status === 'OPEN';

                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700';
                    if (isObstructed) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200 animate-pulse shadow-md shadow-red-500/20';
                    } else if (isOpen) {
                      btnStyle = 'bg-sky-950/80 border-sky-500 text-sky-200 shadow-md shadow-sky-500/20';
                    } else if (door.interlockLocked) {
                      btnStyle = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
                    }

                    if (isSelected) {
                      btnStyle += ' ring-2 ring-pink-500';
                    }

                    return (
                      <button
                        key={door.doorNumber}
                        onClick={() => handleDoorClick(door.doorNumber)}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-mono font-bold">
                            PED #{door.doorNumber}
                          </span>
                          {isOpen ? (
                            <DoorOpen className="w-3.5 h-3.5 text-sky-400" />
                          ) : isObstructed ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <DoorClosed className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>

                        <span className="text-[9px] uppercase font-bold tracking-wider mt-1">
                          {door.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Door Diagnostic & Cross-Section Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Cross-Section Visualization (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Cross-Section: Platform Screen Door & Train Gap (PED #{selectedDoor.doorNumber})
              </h3>
              <p className="text-xs text-slate-400">
                Shows millimeter alignment, infrared safety light curtain, and anti-pinch state machine.
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono uppercase ${
              selectedDoor.status === 'OBSTRUCTED' 
                ? 'bg-red-500 text-white' 
                : 'bg-slate-800 text-emerald-400'
            }`}>
              {selectedDoor.status}
            </span>
          </div>

          {/* Interactive Mechanical Door Visual */}
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-center min-h-[260px]">
            {/* Visual labels */}
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-4 px-4">
              <span className="text-sky-400 font-bold">◄ PLATFORM SIDE (Passengers)</span>
              <span className="text-amber-400 font-bold">GAP SENSOR ZONE (100mm)</span>
              <span className="text-pink-400 font-bold">TRAIN CAR INTERIOR ►</span>
            </div>

            {/* Door Mechanical Slabs */}
            <div className="flex items-center justify-between relative px-6 py-4">
              {/* Platform Glass Screen Door (PED) */}
              <div className="w-[38%] h-40 bg-gradient-to-r from-sky-950/60 to-sky-900/40 border-2 border-sky-500/60 rounded-lg flex flex-col items-center justify-center p-3 relative shadow-lg">
                <span className="text-xs font-bold text-sky-300 font-mono">
                  Station Platform PED #{selectedDoor.doorNumber}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Tempered Safety Glass 12mm
                </span>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>

                {/* Door status animation */}
                <div className="mt-4 px-3 py-1 bg-slate-900/90 rounded text-[11px] font-mono text-sky-400 border border-sky-500/30">
                  {selectedDoor.status === 'OPEN' ? 'OPEN (CLEAR FOR BOARDING)' : 'LOCKED & SEALED'}
                </div>
              </div>

              {/* Gap Between Train and Screen Door */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                {/* Infrared Light Curtain Beams */}
                <div className="w-full h-32 border-x-2 border-dashed border-amber-500/60 flex flex-col justify-around py-2 relative">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-full h-0.5 ${
                        selectedDoor.gapSensorActive ? 'bg-red-500 animate-pulse' : 'bg-amber-400/50'
                      }`}
                    />
                  ))}

                  {/* If Obstructed, show foreign object */}
                  {selectedDoor.status === 'OBSTRUCTED' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>OBSTACLE IN GAP</span>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-amber-300 font-mono mt-2">
                  Gap: 110mm (SIL-4 Optical Curtain)
                </span>
              </div>

              {/* Train Car Door */}
              <div className="w-[38%] h-40 bg-gradient-to-r from-pink-950/60 to-rose-900/40 border-2 border-pink-500/60 rounded-lg flex flex-col items-center justify-center p-3 relative shadow-lg">
                <span className="text-xs font-bold text-pink-300 font-mono">
                  Autonomous Train Door
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Car #{selectedDoor.coachNumber} (UTO Rake)
                </span>
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>

                <div className="mt-4 px-3 py-1 bg-slate-900/90 rounded text-[11px] font-mono text-pink-300 border border-pink-500/30">
                  {selectedDoor.status === 'OPEN' ? 'DOORS OPEN' : 'DOORS CLOSED'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Door Trigger Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleDoorObstruction(selectedDoor.doorNumber)}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow ${
                  selectedDoor.status === 'OBSTRUCTED'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {selectedDoor.status === 'OBSTRUCTED' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Clear Obstruction at Door #{selectedDoor.doorNumber}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Simulate Trapped Backpack Strap / Object</span>
                  </>
                )}
              </button>
            </div>

            <span className="text-xs text-slate-400">
              Anti-Pinch Retries: <strong className="text-amber-400 font-mono">{selectedDoor.obstructionRetries} / 3</strong>
            </span>
          </div>
        </div>

        {/* Selected Door Diagnostic & Specifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Door #{selectedDoor.doorNumber} Telemetry
            </h3>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Assigned Coach:</span>
              <span className="text-white font-bold">Coach #{selectedDoor.coachNumber}</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Mechanical Lock (SIL-4):</span>
              <span className={selectedDoor.interlockLocked ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {selectedDoor.interlockLocked ? 'VERIFIED LOCKED' : 'UNLOCKED / BYPASSED'}
              </span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Gap Sensor State:</span>
              <span className={selectedDoor.gapSensorActive ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {selectedDoor.gapSensorActive ? 'HAZARD DETECTED' : 'BEAM UNBROKEN (CLEAR)'}
              </span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Anti-Pinch Sensitivity:</span>
              <span className="text-sky-300">15 mm (EN 14752)</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400">Full Stroke Cycle Time:</span>
              <span className="text-slate-200">2.8 seconds</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-white block mb-1">DMRC Safety Standard:</strong>
            Platform Edge Doors eliminate platform falls and air displacement drag in underground tunnels. In driverless UTO, trains automatically hold at platform if any door loop opens.
          </div>
        </div>
      </div>
    </div>
  );
};
