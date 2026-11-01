import type { TrainTelemetry, MetroLine, PEDDoorState, CoachCrowdData, IncidentRecord } from '../types/metro';
import { MAGENTA_LINE_STATIONS, PINK_LINE_STATIONS } from './metroData';
import { metroAudio } from './audioService';

export class MetroSimulationEngine {
  private line: MetroLine = 'magenta';
  private telemetry: TrainTelemetry;
  private pedDoors: PEDDoorState[] = [];
  private coaches: CoachCrowdData[] = [];
  private incidents: IncidentRecord[] = [];
  private stationIndex: number = 0;
  private dwellTimerSeconds: number = 20;
  private maxDwellSeconds: number = 20;
  private subscribers: Array<() => void> = [];
  private intervalId: number | null = null;

  constructor() {
    this.telemetry = this.getInitialTelemetry('magenta');
    this.initPEDDoors();
    this.initCoaches();
    this.initSampleIncidents();
    this.startLoop();
  }

  private getStations() {
    return this.line === 'magenta' ? MAGENTA_LINE_STATIONS : PINK_LINE_STATIONS;
  }

  private getInitialTelemetry(line: MetroLine): TrainTelemetry {
    const stations = line === 'magenta' ? MAGENTA_LINE_STATIONS : PINK_LINE_STATIONS;
    return {
      trainId: line === 'magenta' ? 'TS-804' : 'TS-712',
      line,
      currentStation: stations[0].name,
      nextStation: stations[1].name,
      speed: 58.4,
      targetSpeed: 60.0,
      acceleration: 0.1,
      distanceToStation: 650,
      catenaryVoltage: 24.8, // kV
      brakePipePressure: 5.0, // bar
      dockingOffsetMm: 0,
      state: 'CRUISING',
      atpStatus: 'HEALTHY',
      atoStatus: 'ENGAGED',
      cbtcSignalLevel: 'SIL4_VERIFIED',
      tractionInterlock: true,
      emergencyBrakeEngaged: false,
      passengersOnboard: 1140,
    };
  }

  private initPEDDoors() {
    this.pedDoors = [];
    for (let i = 1; i <= 24; i++) {
      const coachNumber = Math.ceil(i / 4);
      this.pedDoors.push({
        doorNumber: i,
        coachNumber,
        status: 'CLOSED',
        gapSensorActive: false,
        interlockLocked: true,
        obstructionRetries: 0,
      });
    }
  }

  private initCoaches() {
    const labels = ['DMC1', 'TC1', 'MC1', 'MC2', 'TC2', 'DMC2'];
    const samplePsg = [285, 240, 115, 95, 210, 275];
    this.coaches = labels.map((label, idx) => {
      const capacity = 300;
      const count = samplePsg[idx];
      const density = Math.round((count / capacity) * 100);
      let status: CoachCrowdData['status'] = 'OPTIMAL';
      if (density > 85) status = 'OVERLOAD';
      else if (density > 70) status = 'HEAVY';
      else if (density > 50) status = 'MODERATE';
      else if (density < 40) status = 'LOW';

      return {
        coachIndex: idx + 1,
        label,
        capacity,
        currentPassengers: count,
        densityPercentage: density,
        status,
        airQualityCo2Ppm: 480 + Math.round(density * 5.2),
        temperatureC: 22.4 + (density > 70 ? 1.8 : 0.4),
      };
    });
  }

  private initSampleIncidents() {
    this.incidents = [
      {
        id: 'INC-2026-901',
        timestamp: '10:42:15',
        type: 'PED_OBSTRUCTION',
        severity: 'MEDIUM',
        station: 'Hauz Khas',
        line: 'magenta',
        trainId: 'TS-804',
        details: 'PED Door #7 anti-pinch beam triggered by backpack strap. 1 cycle auto-recovery.',
        speedAtEvent: 0,
        reactionTimeMs: 48,
        resolved: true,
        resolvedAt: '10:42:22',
        operatorAction: 'Auto-cycled and verified locked via SIL-4 loop.',
      },
      {
        id: 'INC-2026-884',
        timestamp: '09:15:30',
        type: 'TRACK_INTRUSION',
        severity: 'CRITICAL',
        station: 'Botanical Garden',
        line: 'magenta',
        trainId: 'TS-802',
        details: 'Foreign object (umbrella) detected across yellow perimeter track zone. EB commanded.',
        speedAtEvent: 42.1,
        reactionTimeMs: 64,
        resolved: true,
        resolvedAt: '09:18:05',
        operatorAction: 'Track swept by station marshall. System reset by OCC Supervisor.',
      }
    ];
  }

  public setLine(line: MetroLine) {
    this.line = line;
    this.stationIndex = 0;
    this.telemetry = this.getInitialTelemetry(line);
    this.initPEDDoors();
    this.notify();
  }

  public getTelemetry(): TrainTelemetry {
    return { ...this.telemetry };
  }

  public getPEDDoors(): PEDDoorState[] {
    return [...this.pedDoors];
  }

  public getCoaches(): CoachCrowdData[] {
    return [...this.coaches];
  }

  public getIncidents(): IncidentRecord[] {
    return [...this.incidents];
  }

  public getDwellTimer(): { current: number; max: number } {
    return { current: this.dwellTimerSeconds, max: this.maxDwellSeconds };
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(sub => sub());
  }

  public triggerEmergencyBrake(reason: string = 'OCC Supervisor Manual Emergency Stop') {
    if (this.telemetry.emergencyBrakeEngaged) return;

    this.telemetry.emergencyBrakeEngaged = true;
    this.telemetry.state = 'EMERGENCY_STOP';
    this.telemetry.atpStatus = 'FAULT';
    this.telemetry.tractionInterlock = false;
    this.telemetry.acceleration = -1.4; // Max safe emergency deceleration rate
    this.telemetry.brakePipePressure = 0.0; // Vented to atmosphere

    metroAudio.playEmergencySiren();
    metroAudio.speakAnnouncement('Emergency brake applied. Train hold interlock engaged.');

    const newIncident: IncidentRecord = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'EMERGENCY_BRAKE',
      severity: 'CRITICAL',
      station: this.telemetry.nextStation,
      line: this.telemetry.line,
      trainId: this.telemetry.trainId,
      details: reason,
      speedAtEvent: Math.round(this.telemetry.speed * 10) / 10,
      reactionTimeMs: Math.round(35 + Math.random() * 30),
      resolved: false,
    };

    this.incidents.unshift(newIncident);
    this.notify();
  }

  public resetEmergencyBrake() {
    this.telemetry.emergencyBrakeEngaged = false;
    this.telemetry.state = 'HOLD';
    this.telemetry.atpStatus = 'HEALTHY';
    this.telemetry.tractionInterlock = true;
    this.telemetry.brakePipePressure = 5.0; // Recharge brake pipe
    this.telemetry.acceleration = 0;

    // Resolve any open EB incidents
    this.incidents = this.incidents.map(inc => {
      if (!inc.resolved && inc.type === 'EMERGENCY_BRAKE') {
        return {
          ...inc,
          resolved: true,
          resolvedAt: new Date().toLocaleTimeString(),
          operatorAction: 'Supervisor SIL-4 interlock reset acknowledged from OCC.'
        };
      }
      return inc;
    });

    metroAudio.speakAnnouncement('Emergency interlock cleared. Train ready for automatic operation.');
    this.notify();
  }

  public injectObstacle(doorNumber: number = 7) {
    const door = this.pedDoors.find(d => d.doorNumber === doorNumber);
    if (!door) return;

    door.status = 'OBSTRUCTED';
    door.gapSensorActive = true;
    door.interlockLocked = false;
    door.obstructionRetries += 1;
    this.telemetry.tractionInterlock = false;

    metroAudio.playEmergencySiren();
    metroAudio.speakAnnouncement(`Platform Edge Door ${doorNumber} obstruction detected. Traction interlock suspended.`);

    const newIncident: IncidentRecord = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'PED_OBSTRUCTION',
      severity: 'HIGH',
      station: this.telemetry.currentStation,
      line: this.telemetry.line,
      trainId: this.telemetry.trainId,
      details: `Infrared light curtain blocked at Door #${doorNumber}. Clearance verification failed.`,
      speedAtEvent: this.telemetry.speed,
      reactionTimeMs: 42,
      resolved: false,
    };
    this.incidents.unshift(newIncident);
    this.notify();
  }

  public clearDoorObstruction(doorNumber: number = 7) {
    const door = this.pedDoors.find(d => d.doorNumber === doorNumber);
    if (!door) return;

    door.status = 'CLOSED';
    door.gapSensorActive = false;
    door.interlockLocked = true;
    door.obstructionRetries = 0;

    // Check if all doors locked
    const allLocked = this.pedDoors.every(d => d.interlockLocked);
    if (allLocked && !this.telemetry.emergencyBrakeEngaged) {
      this.telemetry.tractionInterlock = true;
    }

    this.incidents = this.incidents.map(inc => {
      if (!inc.resolved && inc.type === 'PED_OBSTRUCTION') {
        return {
          ...inc,
          resolved: true,
          resolvedAt: new Date().toLocaleTimeString(),
          operatorAction: `Obstacle cleared at Door #${doorNumber}. Infrared curtain confirmed clear.`
        };
      }
      return inc;
    });

    metroAudio.playDoorClosingBeep();
    this.notify();
  }

  public injectTrackIntrusion(zoneName: string = 'Hauz Khas Track Bed') {
    this.triggerEmergencyBrake(`Automated Computer Vision Track Intrusion: Object/Person detected in ${zoneName}`);
  }

  private startLoop() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick() {
    const stations = this.getStations();

    // If emergency brake is engaged, stop train immediately
    if (this.telemetry.emergencyBrakeEngaged) {
      if (this.telemetry.speed > 0) {
        this.telemetry.speed = Math.max(0, this.telemetry.speed - 12);
      }
      this.notify();
      return;
    }

    // State machine
    switch (this.telemetry.state) {
      case 'CRUISING': {
        // Decrement distance to next station
        this.telemetry.distanceToStation -= 20;
        this.telemetry.speed = Math.min(65, this.telemetry.speed + 1.2);
        this.telemetry.acceleration = 0.2;

        if (this.telemetry.distanceToStation <= 300) {
          this.telemetry.state = 'APPROACHING';
        }
        break;
      }

      case 'APPROACHING': {
        this.telemetry.distanceToStation -= 15;
        this.telemetry.speed = Math.max(16, this.telemetry.speed - 3.5);
        this.telemetry.acceleration = -0.7;

        if (this.telemetry.distanceToStation <= 40) {
          this.telemetry.state = 'DOCKING';
        }
        break;
      }

      case 'DOCKING': {
        this.telemetry.distanceToStation = Math.max(0, this.telemetry.distanceToStation - 6);
        this.telemetry.speed = Math.max(0, this.telemetry.speed - 4);
        this.telemetry.acceleration = -0.4;

        if (this.telemetry.speed === 0) {
          this.telemetry.dockingOffsetMm = Math.round((Math.random() - 0.5) * 60); // +-30mm precision
          this.telemetry.state = 'DOORS_OPENING';
          metroAudio.playDoorChime();
          metroAudio.speakAnnouncement(
            `Next station ${this.telemetry.nextStation}. Doors will open on the left. Kripya dhyan dein, agla station ${this.telemetry.nextStation} hai.`
          );
        }
        break;
      }

      case 'DOORS_OPENING': {
        // Open all PED doors synchronously
        this.pedDoors.forEach(d => {
          if (d.status !== 'OBSTRUCTED') d.status = 'OPEN';
        });
        this.telemetry.currentStation = this.telemetry.nextStation;
        this.telemetry.state = 'BOARDING';

        // Dynamic dwell time based on crowd level
        const currentStationInfo = stations.find(s => s.name === this.telemetry.currentStation);
        const crowdIndex = currentStationInfo?.averageCrowdIndex || 60;
        this.maxDwellSeconds = crowdIndex > 80 ? 25 : 18;
        this.dwellTimerSeconds = this.maxDwellSeconds;
        break;
      }

      case 'BOARDING': {
        this.dwellTimerSeconds -= 1;

        // Exchange passengers randomly
        if (this.dwellTimerSeconds % 3 === 0) {
          this.coaches.forEach(coach => {
            const delta = Math.floor((Math.random() - 0.48) * 8);
            coach.currentPassengers = Math.max(40, Math.min(310, coach.currentPassengers + delta));
            coach.densityPercentage = Math.round((coach.currentPassengers / coach.capacity) * 100);
            if (coach.densityPercentage > 85) coach.status = 'OVERLOAD';
            else if (coach.densityPercentage > 70) coach.status = 'HEAVY';
            else if (coach.densityPercentage > 50) coach.status = 'MODERATE';
            else coach.status = 'LOW';
          });
          this.telemetry.passengersOnboard = this.coaches.reduce((sum, c) => sum + c.currentPassengers, 0);
        }

        if (this.dwellTimerSeconds <= 3 && this.dwellTimerSeconds > 0) {
          metroAudio.playDoorClosingBeep();
        }

        if (this.dwellTimerSeconds <= 0) {
          this.telemetry.state = 'DOORS_CLOSING';
        }
        break;
      }

      case 'DOORS_CLOSING': {
        // Close doors if not obstructed
        const hasObstruction = this.pedDoors.some(d => d.status === 'OBSTRUCTED');
        if (!hasObstruction) {
          this.pedDoors.forEach(d => {
            d.status = 'CLOSED';
            d.interlockLocked = true;
          });
          this.telemetry.state = 'CLEARANCE_CHECK';
        }
        break;
      }

      case 'CLEARANCE_CHECK': {
        const allClosed = this.pedDoors.every(d => d.status === 'CLOSED' && d.interlockLocked);
        if (allClosed) {
          this.telemetry.tractionInterlock = true;
          this.stationIndex = (this.stationIndex + 1) % stations.length;
          this.telemetry.nextStation = stations[this.stationIndex].name;
          this.telemetry.distanceToStation = 1100;
          this.telemetry.state = 'DEPARTING';
        }
        break;
      }

      case 'DEPARTING': {
        this.telemetry.speed = Math.min(48, this.telemetry.speed + 6);
        this.telemetry.acceleration = 0.8;
        if (this.telemetry.speed >= 45) {
          this.telemetry.state = 'CRUISING';
        }
        break;
      }

      case 'HOLD': {
        // Waiting for OCC controller dispatch
        break;
      }
    }

    // Dynamic electrical fluctuation
    this.telemetry.catenaryVoltage = Math.round((24.7 + Math.sin(Date.now() / 3000) * 0.4) * 10) / 10;
    this.notify();
  }

  public dispatchTrain() {
    if (this.telemetry.state === 'HOLD' && this.telemetry.tractionInterlock) {
      this.telemetry.state = 'DEPARTING';
      this.notify();
    }
  }

  public destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

export const metroEngine = new MetroSimulationEngine();
