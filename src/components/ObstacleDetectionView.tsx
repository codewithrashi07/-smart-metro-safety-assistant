import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Camera, 
  Video, 
  AlertTriangle, 
  CheckCircle2, 
  Octagon, 
  Crosshair, 
  Sparkles,
  RefreshCw,
  Trash2
} from 'lucide-react';
import type { DetectionBox } from '../types/metro';
import { metroAudio } from '../services/audioService';

interface ObstacleDetectionViewProps {
  onTriggerEmergencyBrake: (reason: string) => void;
  isEmergencyActive: boolean;
  onResetEmergency: () => void;
}

type CameraSource = 'platform_cctv' | 'track_cctv' | 'cab_cctv' | 'webcam';

export const ObstacleDetectionView: React.FC<ObstacleDetectionViewProps> = ({
  onTriggerEmergencyBrake,
  isEmergencyActive,
  onResetEmergency,
}) => {
  const [selectedCam, setSelectedCam] = useState<CameraSource>('platform_cctv');
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(30);
  const [latencyMs, setLatencyMs] = useState<number>(38);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [autoBrakeEnabled, setAutoBrakeEnabled] = useState<boolean>(true);

  // Active detections
  const [detections, setDetections] = useState<DetectionBox[]>([
    {
      id: 'det-1',
      label: 'PERSON',
      confidence: 0.96,
      x: 35,
      y: 30,
      width: 14,
      height: 48,
      severity: 'INFO',
      zone: 'PLATFORM_SAFE',
    },
    {
      id: 'det-2',
      label: 'LUGGAGE',
      confidence: 0.91,
      x: 52,
      y: 62,
      width: 10,
      height: 16,
      severity: 'WARNING',
      zone: 'YELLOW_LINE_PERIMETER',
    }
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handle webcam toggle
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (selectedCam === 'webcam') {
      setWebcamError(null);
      navigator.mediaDevices?.getUserMedia({ video: { width: 1280, height: 720 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Webcam access error:', err);
          setWebcamError('Camera access unavailable or permission denied. Switch to simulated high-res CCTV feeds.');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [selectedCam]);

  // Jitter FPS and latency slightly for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.round(29 + Math.random() * 3));
      setLatencyMs(Math.round(34 + Math.random() * 12));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Check if any critical detection violates track zone
  const hasCriticalIntrusion = detections.some(d => d.zone === 'TRACK_BED');
  const hasWarningYellow = detections.some(d => d.zone === 'YELLOW_LINE_PERIMETER');

  // Trigger emergency brake if critical intrusion detected and auto brake enabled
  useEffect(() => {
    if (hasCriticalIntrusion && autoBrakeEnabled && !isEmergencyActive) {
      onTriggerEmergencyBrake('Computer Vision: Critical Track Bed Obstacle / Intrusion Detected');
    }
  }, [hasCriticalIntrusion, autoBrakeEnabled, isEmergencyActive, onTriggerEmergencyBrake]);

  // Click on canvas to drop simulated obstacle
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Determine zone based on Y position (Platform top, Yellow line middle, Track bottom)
    let zone: DetectionBox['zone'] = 'PLATFORM_SAFE';
    let severity: DetectionBox['severity'] = 'INFO';
    let label: DetectionBox['label'] = 'PERSON';

    if (clickY > 68) {
      zone = 'TRACK_BED';
      severity = 'CRITICAL';
      label = 'TRACK_OBSTACLE';
    } else if (clickY > 50) {
      zone = 'YELLOW_LINE_PERIMETER';
      severity = 'WARNING';
      label = 'YELLOW_LINE_VIOLATION';
    }

    const newDetection: DetectionBox = {
      id: `det-${Date.now()}`,
      label,
      confidence: Math.round((0.88 + Math.random() * 0.1) * 100) / 100,
      x: Math.max(5, Math.min(85, clickX - 6)),
      y: Math.max(5, Math.min(80, clickY - 10)),
      width: 12,
      height: 20,
      severity,
      zone,
    };

    setDetections(prev => [...prev, newDetection]);

    if (zone === 'TRACK_BED') {
      metroAudio.playEmergencySiren();
    } else if (zone === 'YELLOW_LINE_PERIMETER') {
      metroAudio.playDoorClosingBeep();
    }
  };

  const clearAllDetections = () => {
    setDetections([]);
  };

  const resetToDemoScenario = () => {
    setDetections([
      {
        id: 'det-fallen-person',
        label: 'TRACK_OBSTACLE',
        confidence: 0.99,
        x: 60,
        y: 74,
        width: 18,
        height: 18,
        severity: 'CRITICAL',
        zone: 'TRACK_BED',
      },
      {
        id: 'det-commuter',
        label: 'PERSON',
        confidence: 0.94,
        x: 25,
        y: 25,
        width: 12,
        height: 42,
        severity: 'INFO',
        zone: 'PLATFORM_SAFE',
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Feed Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-black text-white tracking-wide">
              Real-Time Vision & Platform Obstacle Detection
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/30 uppercase">
              YOLOv8-Nano / DMRC Vision Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Millisecond platform edge tracking, passenger yellow line breaches, and track bed intrusion protection.
          </p>
        </div>

        {/* Camera Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSelectedCam('platform_cctv')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCam === 'platform_cctv'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Platform 1 CCTV</span>
          </button>

          <button
            onClick={() => setSelectedCam('track_cctv')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCam === 'track_cctv'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Track Bed CCTV</span>
          </button>

          <button
            onClick={() => setSelectedCam('cab_cctv')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCam === 'cab_cctv'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>UTO Cab Cowcatcher</span>
          </button>

          <button
            onClick={() => setSelectedCam('webcam')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCam === 'webcam'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Live Device Webcam</span>
          </button>
        </div>
      </div>

      {/* Main Video Detection Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Viewport (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          {/* Top Camera HUD Overlay */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>REC ● 1080p UTO-CAM</span>
              </div>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="hidden sm:inline">STN: HAUZ KHAS (L8)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                FPS: {fps}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-bold">
                LATENCY: {latencyMs}ms
              </span>
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div 
            onClick={handleCanvasClick}
            className="relative w-full aspect-video bg-slate-950 cursor-crosshair overflow-hidden group select-none"
          >
            {/* If Webcam Mode */}
            {selectedCam === 'webcam' ? (
              <div className="w-full h-full relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {webcamError && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-slate-300">
                    <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
                    <p className="font-bold text-white text-sm mb-1">{webcamError}</p>
                    <button
                      onClick={() => setSelectedCam('platform_cctv')}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
                    >
                      Return to Simulated Platform CCTV
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Simulated Metro Video Canvas */
              <div className="w-full h-full relative flex flex-col justify-between overflow-hidden">
                {/* Platform Background Canvas Graphic */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
                  {/* Platform Tile Grid */}
                  <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-slate-800 to-slate-850 opacity-60">
                    {/* Platform pillars */}
                    <div className="absolute top-6 left-12 w-10 h-32 bg-slate-700/60 rounded border-r border-slate-600"></div>
                    <div className="absolute top-6 right-24 w-10 h-32 bg-slate-700/60 rounded border-r border-slate-600"></div>
                    {/* Station signage */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-pink-700/80 px-4 py-1 rounded text-white text-xs font-black tracking-wider border border-pink-500">
                      हौज़ ख़ास • HAUZ KHAS (MAGENTA LINE)
                    </div>
                  </div>

                  {/* Tactile Yellow Safety Line */}
                  <div className="absolute top-[55%] left-0 right-0 h-6 bg-yellow-400/90 border-y-2 border-yellow-500 flex items-center justify-around overflow-hidden shadow-lg shadow-yellow-500/20">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-yellow-600/80"></div>
                    ))}
                  </div>

                  {/* Platform Edge & Gap */}
                  <div className="absolute top-[60%] left-0 right-0 h-4 bg-slate-900 border-b border-slate-800"></div>

                  {/* Track Bed & Rails */}
                  <div className="absolute top-[64%] bottom-0 left-0 right-0 bg-slate-950 flex flex-col justify-around px-4">
                    {/* Running Rails */}
                    <div className="w-full h-1.5 bg-slate-600 border-b border-slate-400 shadow-md"></div>
                    <div className="w-full h-1.5 bg-slate-600 border-b border-slate-400 shadow-md"></div>
                    {/* Ballast gravel texture */}
                    <div className="text-[10px] text-slate-700 font-mono text-center tracking-widest select-none">
                      ▲ THIRD RAIL POWER ZONE 750V DC / 25kV OHE OVERHEAD ▲
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Geofence Overlay Bands (Visual Zones) */}
            {showZones && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Platform Safe Zone */}
                <div className="absolute top-0 left-0 right-0 h-[52%] border-b border-emerald-500/40 bg-emerald-500/5">
                  <span className="absolute top-12 left-4 text-[10px] font-mono text-emerald-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    ZONE 1: PLATFORM SAFE WAITING
                  </span>
                </div>

                {/* Yellow Caution Zone */}
                <div className="absolute top-[53%] left-0 right-0 h-[12%] border-y border-amber-500/60 bg-amber-500/10">
                  <span className="absolute top-1 right-4 text-[10px] font-mono text-amber-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    ZONE 2: YELLOW PERIMETER CAUTION
                  </span>
                </div>

                {/* Track Danger Zone */}
                <div className="absolute top-[65%] bottom-0 left-0 right-0 border-t-2 border-red-500/80 bg-red-600/15">
                  <span className="absolute bottom-4 left-4 text-[10px] font-mono text-red-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1.5">
                    <Octagon className="w-3.5 h-3.5 text-red-400" />
                    ZONE 3: TRACK BED DANGER (SIL-4 EB TRIGGER)
                  </span>
                </div>
              </div>
            )}

            {/* Render AI Bounding Boxes */}
            {detections.map((det) => {
              const isCritical = det.zone === 'TRACK_BED';
              const isWarning = det.zone === 'YELLOW_LINE_PERIMETER';

              const borderColor = isCritical 
                ? 'border-red-500 bg-red-500/20 text-red-200' 
                : isWarning 
                ? 'border-amber-400 bg-amber-400/20 text-amber-100' 
                : 'border-emerald-400 bg-emerald-400/10 text-emerald-100';

              const badgeColor = isCritical 
                ? 'bg-red-600 text-white' 
                : isWarning 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-emerald-600 text-white';

              return (
                <div
                  key={det.id}
                  className={`absolute border-2 rounded transition-all duration-200 z-20 pointer-events-auto shadow-lg ${borderColor}`}
                  style={{
                    left: `${det.x}%`,
                    top: `${det.y}%`,
                    width: `${det.width}%`,
                    height: `${det.height}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove detection on click
                    setDetections(prev => prev.filter(d => d.id !== det.id));
                  }}
                  title="Click to remove detection"
                >
                  {/* Bounding box top tag */}
                  <div className={`absolute -top-6 left-0 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded shadow flex items-center gap-1 whitespace-nowrap ${badgeColor}`}>
                    <span>{det.label}</span>
                    <span>{Math.round(det.confidence * 100)}%</span>
                  </div>

                  {/* Corner Reticle Accents */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white"></div>

                  {isCritical && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-2 py-0.5 bg-red-700 text-white text-[9px] font-black uppercase rounded animate-ping">
                        EMERGENCY BRAKE
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Click to inject instruction overlay */}
            <div className="absolute bottom-2 right-2 z-20 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity">
              <span className="text-[11px] font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded border border-slate-700 shadow">
                💡 Click anywhere to drop obstacle/commuter
              </span>
            </div>
          </div>

          {/* Bottom Feed Bar Controls */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showZones}
                  onChange={(e) => setShowZones(e.target.checked)}
                  className="rounded border-slate-700 text-pink-600 focus:ring-0"
                />
                <span>Overlay Geofence Zones</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={autoBrakeEnabled}
                  onChange={(e) => setAutoBrakeEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-rose-600 focus:ring-0"
                />
                <span className="font-bold text-rose-400">Auto-Brake on Track Intrusion</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDemoScenario}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Track Fall</span>
              </button>
              <button
                onClick={clearAllDetections}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Real-Time Detection Telemetry & Alerts */}
        <div className="space-y-4">
          {/* Active Intrusion Status Card */}
          <div className={`p-4 rounded-xl border shadow-lg ${
            hasCriticalIntrusion 
              ? 'bg-red-950/60 border-red-600 text-red-200 animate-pulse' 
              : hasWarningYellow
              ? 'bg-amber-950/40 border-amber-600 text-amber-200'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {hasCriticalIntrusion ? (
                <Octagon className="w-5 h-5 text-red-400" />
              ) : hasWarningYellow ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              <h3 className="font-black text-sm uppercase tracking-wide">
                {hasCriticalIntrusion 
                  ? 'CRITICAL TRACK INTRUSION' 
                  : hasWarningYellow 
                  ? 'YELLOW PERIMETER BREACH' 
                  : 'ZONE CLEAR & SAFE'}
              </h3>
            </div>

            <p className="text-xs mb-3">
              {hasCriticalIntrusion
                ? 'Object or passenger detected inside Track Danger Envelope. SIL-4 Emergency Brake commanded in 38ms.'
                : hasWarningYellow
                ? 'Passenger crossed yellow tactile boundary. P.A. warning announcement broadcasted.'
                : 'All platform zones clear. Driverless train movement authority valid.'}
            </p>

            {hasCriticalIntrusion && isEmergencyActive && (
              <button
                onClick={onResetEmergency}
                className="w-full py-2 bg-white text-red-800 rounded font-bold text-xs uppercase tracking-wider hover:bg-red-50 flex items-center justify-center gap-1 cursor-pointer shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                Reset Emergency Stop
              </button>
            )}
          </div>

          {/* Detections List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Active Bounding Objects ({detections.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">CV Inference Engine</span>
            </div>

            {detections.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No active targets in camera field.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {detections.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span className={`w-2 h-2 rounded-full ${
                          d.zone === 'TRACK_BED' ? 'bg-red-500' : d.zone === 'YELLOW_LINE_PERIMETER' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}></span>
                        <span>{d.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Zone: {d.zone.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <span className="text-pink-400 font-bold">
                      {Math.round(d.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vision Pipeline Specifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-xs space-y-2 font-mono">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">
              DMRC Edge AI Specifications
            </span>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Camera Resolution:</span>
              <span>1080p @ 60 FPS</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Inference Hardware:</span>
              <span>NVIDIA Jetson AGX / Edge TPU</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Emergency Relay Latency:</span>
              <span className="text-emerald-400 font-bold">&lt; 50 ms (SIL-4)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Optical Fog Penetration:</span>
              <span>850nm NIR Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
