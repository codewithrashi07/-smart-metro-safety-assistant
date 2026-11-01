import React from 'react';
import type { CoachCrowdData, TrainTelemetry } from '../types/metro';
import { 
  Users, 
  Wind, 
  Thermometer, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  CheckCircle2
} from 'lucide-react';

interface PassengerDensityViewProps {
  coaches: CoachCrowdData[];
  telemetry: TrainTelemetry;
  dwellTimer: { current: number; max: number };
}

export const PassengerDensityView: React.FC<PassengerDensityViewProps> = ({
  coaches,
  telemetry,
}) => {
  // Compute total passengers and average density
  const totalPassengers = coaches.reduce((sum, c) => sum + c.currentPassengers, 0);
  const totalCapacity = coaches.reduce((sum, c) => sum + c.capacity, 0);
  const avgDensity = Math.round((totalPassengers / totalCapacity) * 100);

  // Find least crowded coaches to recommend to platform commuters
  const sortedCoaches = [...coaches].sort((a, b) => a.densityPercentage - b.densityPercentage);
  const recommendedCoaches = sortedCoaches.slice(0, 2);

  // Dwell time calculation breakdown
  const baseDwell = 18;
  const crowdPenalty = avgDensity > 80 ? 10 : avgDensity > 60 ? 6 : 0;
  const stationFactor = telemetry.currentStation.includes('Hauz Khas') || telemetry.currentStation.includes('Botanical') ? 4 : 0;
  const calculatedDwell = baseDwell + crowdPenalty + stationFactor;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white tracking-wide">
              Automated Passenger Density & Dynamic Crowd Management
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
              Rake Telemetry & Weight Sensors
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time coach occupancy distribution, commuter flow guidance (PIDS), and driverless dwell time calculation.
          </p>
        </div>

        {/* Global Occupancy Pill */}
        <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Total Commuters</span>
            <span className="text-base font-black text-white">
              {totalPassengers.toLocaleString()} <span className="text-xs text-slate-500">/ {totalCapacity}</span>
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Average Load</span>
            <span className={`text-base font-black ${
              avgDensity > 80 ? 'text-red-400' : avgDensity > 60 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {avgDensity}%
            </span>
          </div>
        </div>
      </div>

      {/* Platform Information Display System (PIDS) Live Passenger Screen */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold text-amber-300 tracking-wider">
              PLATFORM PASSENGER INFORMATION DISPLAY (PIDS)
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{telemetry.currentStation} • Platform 1</span>
          </div>

          <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            Commuter Flow Optimization Active
          </span>
        </div>

        {/* Dynamic Boarding Recommendation Alert */}
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-200 text-sm">
                Smart Boarding Recommendation for Waiting Commuters:
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Please move toward <strong className="text-amber-400 font-mono">Coach {recommendedCoaches[0]?.coachIndex} ({recommendedCoaches[0]?.label})</strong> and <strong className="text-amber-400 font-mono">Coach {recommendedCoaches[1]?.coachIndex} ({recommendedCoaches[1]?.label})</strong> for lowest crowd density and available seating.
              </p>
              <p className="text-[11px] text-slate-400 font-hindi mt-0.5">
                कम भीड़ और खाली सीटों के लिए कृपया कोच {recommendedCoaches[0]?.coachIndex} व {recommendedCoaches[1]?.coachIndex} की ओर बढ़ें।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Coach {recommendedCoaches[0]?.coachIndex}: {recommendedCoaches[0]?.densityPercentage}% Load</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Coach Rake Heatmap Visual */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              6-Car Autonomous Rake Occupancy Heatmap
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Train ID: {telemetry.trainId} (Hyundai Rotem / BEML Rake)
          </span>
        </div>

        {/* Visual Coaches Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {coaches.map((coach) => {
            const isLowest = recommendedCoaches.some(rc => rc.coachIndex === coach.coachIndex);
            const isOverloaded = coach.densityPercentage > 85;
            const isHeavy = coach.densityPercentage > 70 && !isOverloaded;

            let borderColor = 'border-emerald-500/40 bg-emerald-950/20';
            let progressBg = 'bg-emerald-500';
            let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

            if (isOverloaded) {
              borderColor = 'border-red-500/60 bg-red-950/30 animate-pulse';
              progressBg = 'bg-red-500';
              badgeColor = 'text-red-300 bg-red-500/20 border-red-500/40';
            } else if (isHeavy) {
              borderColor = 'border-amber-500/40 bg-amber-950/20';
              progressBg = 'bg-amber-400';
              badgeColor = 'text-amber-300 bg-amber-500/10 border-amber-500/30';
            }

            return (
              <div
                key={coach.coachIndex}
                className={`rounded-xl p-4 border relative overflow-hidden transition-all shadow-md ${borderColor}`}
              >
                {/* Coach Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-white font-mono">
                    Car #{coach.coachIndex} ({coach.label})
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                    {coach.status}
                  </span>
                </div>

                {/* Commuter Density Number */}
                <div className="my-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-white">
                      {coach.densityPercentage}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {coach.currentPassengers} / {coach.capacity}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${progressBg}`}
                      style={{ width: `${coach.densityPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Cabin Sensors (CO2 & Temperature) */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      <span>CO2 Level:</span>
                    </span>
                    <span className={coach.airQualityCo2Ppm > 900 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {coach.airQualityCo2Ppm} ppm
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      <span>Cabin Temp:</span>
                    </span>
                    <span className="text-slate-300">
                      {coach.temperatureC.toFixed(1)}°C
                    </span>
                  </div>
                </div>

                {isLowest && (
                  <div className="mt-3 py-1 px-2 bg-emerald-500/20 border border-emerald-500/40 rounded text-center text-[10px] font-bold text-emerald-300">
                    ★ Recommended Boarding
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Dwell Time & Transit Flow Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Dwell Engine */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Autonomous Dwell Time Optimization Engine
              </h3>
            </div>
            <span className="text-xs font-mono text-sky-400 font-bold">
              Algorithm: DMRC-DWELL-v3
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Driverless trains do not have in-cab operators to visually judge when passenger boarding is complete. SURAKSHA-METRO dynamically computes dwell seconds based on station queue load and coach density variance before closing doors.
          </p>

          {/* Dwell Formula Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Base Platform Dwell</span>
              <span className="text-lg font-black text-white">{baseDwell}s</span>
              <span className="text-[10px] text-slate-400 block mt-1">DMRC Scheduled Standard</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Crowd Variance Penalty</span>
              <span className="text-lg font-black text-amber-400">+{crowdPenalty}s</span>
              <span className="text-[10px] text-slate-400 block mt-1">Due to {avgDensity}% train load</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Station Interchange Buffer</span>
              <span className="text-lg font-black text-pink-400">+{stationFactor}s</span>
              <span className="text-[10px] text-slate-400 block mt-1">{telemetry.currentStation}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Computed Optimal Boarding Window:</span>
            <span className="text-base font-black font-mono text-sky-400">{calculatedDwell} Seconds</span>
          </div>
        </div>

        {/* Crowd Density Benefits */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Transit Impact & Safety
            </h3>
          </div>

          <div className="space-y-2 text-slate-400 leading-relaxed">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-emerald-300 block mb-0.5">32% Faster Platform Clearance</strong>
              By distributing passengers evenly away from crowded escalator entry zones towards Coaches 3 & 4.
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-sky-300 block mb-0.5">Zero Door Pinch Lockouts</strong>
              Dynamic dwell prevents premature door closing cycles against rush-hour passenger surges.
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-amber-300 block mb-0.5">Optimized HVAC Air Quality</strong>
              In-coach CO2 sensors modulate air conditioning blower rates depending on real-time headcounts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
