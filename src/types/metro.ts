export type MetroLine = 'magenta' | 'pink';

export type TrainState = 
  | 'CRUISING' 
  | 'APPROACHING' 
  | 'DOCKING' 
  | 'DOORS_OPENING' 
  | 'BOARDING' 
  | 'DOORS_CLOSING' 
  | 'CLEARANCE_CHECK' 
  | 'DEPARTING' 
  | 'EMERGENCY_STOP' 
  | 'HOLD';

export interface TrainTelemetry {
  trainId: string;
  line: MetroLine;
  currentStation: string;
  nextStation: string;
  speed: number; // km/h
  targetSpeed: number; // km/h
  acceleration: number; // m/s^2
  distanceToStation: number; // meters
  catenaryVoltage: number; // kV (nominally 25kV)
  brakePipePressure: number; // bar (5.0 bar nominal)
  dockingOffsetMm: number; // mm from target (+-150mm tolerance)
  state: TrainState;
  atpStatus: 'HEALTHY' | 'WARNING' | 'FAULT';
  atoStatus: 'ENGAGED' | 'MANUAL' | 'RESTRICTED';
  cbtcSignalLevel: 'SIL4_VERIFIED' | 'DEGRADED' | 'LOSS';
  tractionInterlock: boolean;
  emergencyBrakeEngaged: boolean;
  passengersOnboard: number;
}

export interface DetectionBox {
  id: string;
  label: 'PERSON' | 'LUGGAGE' | 'TRACK_OBSTACLE' | 'YELLOW_LINE_VIOLATION' | 'PED_GAP_HAZARD';
  confidence: number;
  x: number; // % from left
  y: number; // % from top
  width: number; // % width
  height: number; // % height
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  zone: 'PLATFORM_SAFE' | 'YELLOW_LINE_PERIMETER' | 'PED_GAP' | 'TRACK_BED';
}

export interface PEDDoorState {
  doorNumber: number;
  coachNumber: number;
  status: 'OPEN' | 'OPENING' | 'CLOSED' | 'CLOSING' | 'OBSTRUCTED' | 'MAINTENANCE';
  gapSensorActive: boolean; // Gap between PED and train
  interlockLocked: boolean; // SIL-4 feedback
  obstructionRetries: number;
}

export interface CoachCrowdData {
  coachIndex: number;
  label: string; // "DMC1", "TC1", etc.
  capacity: number; // e.g. 300
  currentPassengers: number;
  densityPercentage: number;
  status: 'LOW' | 'OPTIMAL' | 'MODERATE' | 'HEAVY' | 'OVERLOAD';
  airQualityCo2Ppm: number;
  temperatureC: number;
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  type: 'TRACK_INTRUSION' | 'PED_OBSTRUCTION' | 'EMERGENCY_BRAKE' | 'PEA_PULL' | 'GAP_ENTRAPMENT' | 'OVERCROWDING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  station: string;
  line: MetroLine;
  trainId: string;
  details: string;
  speedAtEvent: number;
  reactionTimeMs: number;
  resolved: boolean;
  resolvedAt?: string;
  operatorAction?: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'MEDICAL' | 'ACCIDENT' | 'EVACUATION' | 'FIRE';
  symptoms: string[];
  steps: string[];
  hindiSteps: string[];
  equipmentRequired: string[];
  emergencyContacts: string[];
}
