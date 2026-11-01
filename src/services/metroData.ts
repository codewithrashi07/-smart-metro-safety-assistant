import type { FirstAidGuide, MetroLine } from '../types/metro';

export interface StationInfo {
  name: string;
  hindiName: string;
  line: MetroLine;
  interchangeWith: string[];
  hasPlatformEdgeDoors: boolean;
  depthMeters?: number;
  averageCrowdIndex: number; // 0 - 100
  zone: string;
}

export const MAGENTA_LINE_STATIONS: StationInfo[] = [
  { name: 'Janakpuri West', hindiName: 'जनकपुरी पश्चिम', line: 'magenta', interchangeWith: ['Blue Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 88, zone: 'West' },
  { name: 'Dabri Mor - South Delhi', hindiName: 'डाबरी मोड़', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 55, zone: 'West' },
  { name: 'Dashrath Puri', hindiName: 'दशरथ पुरी', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 45, zone: 'South-West' },
  { name: 'Palam', hindiName: 'पालम', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 60, zone: 'South-West' },
  { name: 'Sadar Bazar Cantonment', hindiName: 'सदर बाजार छावनी', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 40, zone: 'Cantonment' },
  { name: 'Terminal 1 IGI Airport', hindiName: 'टर्मिनल 1 आईजीआई हवाई अड्डा', line: 'magenta', interchangeWith: ['Domestic Flights'], hasPlatformEdgeDoors: true, depthMeters: 18, averageCrowdIndex: 85, zone: 'Airport' },
  { name: 'Shankar Vihar', hindiName: 'शंकर विहार', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 35, zone: 'South' },
  { name: 'Vasant Vihar', hindiName: 'वसंत विहार', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 58, zone: 'South' },
  { name: 'Munirka', hindiName: 'मुनीरका', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 65, zone: 'South' },
  { name: 'RK Puram', hindiName: 'आर.के. पुरम', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 62, zone: 'South' },
  { name: 'IIT Delhi', hindiName: 'आईआईटी दिल्ली', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 70, zone: 'South' },
  { name: 'Hauz Khas', hindiName: 'हौज़ ख़ास', line: 'magenta', interchangeWith: ['Yellow Line'], hasPlatformEdgeDoors: true, depthMeters: 29, averageCrowdIndex: 96, zone: 'South Interchange Hub' },
  { name: 'Panchsheel Park', hindiName: 'पंचशील पार्क', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 50, zone: 'South' },
  { name: 'Chirag Delhi', hindiName: 'चिराग दिल्ली', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 56, zone: 'South' },
  { name: 'Greater Kailash', hindiName: 'ग्रेटर कैलाश', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 68, zone: 'South' },
  { name: 'Nehru Enclave', hindiName: 'नेहरू एन्क्लेव', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 52, zone: 'South-East' },
  { name: 'Kalkaji Mandir', hindiName: 'कालकाजी मंदिर', line: 'magenta', interchangeWith: ['Violet Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 89, zone: 'South-East Interchange' },
  { name: 'Okhla NSIC', hindiName: 'ओखला एनएसआईसी', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 48, zone: 'Industrial' },
  { name: 'Sukhdev Vihar', hindiName: 'सुखदेव विहार', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 42, zone: 'South-East' },
  { name: 'Jamia Millia Islamia', hindiName: 'जामिया मिलिया इस्लामिया', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 75, zone: 'University' },
  { name: 'Okhla Vihar', hindiName: 'ओखला विहार', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 45, zone: 'South-East' },
  { name: 'Jasola Vihar Shaheen Bagh', hindiName: 'जसोला विहार शाहीन बाग', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 52, zone: 'South-East' },
  { name: 'Kalindi Kunj', hindiName: 'कालिंदी कुंज', line: 'magenta', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 65, zone: 'Border' },
  { name: 'Botanical Garden', hindiName: 'बॉटनिकल गार्डन', line: 'magenta', interchangeWith: ['Blue Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 94, zone: 'Noida Hub' },
];

export const PINK_LINE_STATIONS: StationInfo[] = [
  { name: 'Majlis Park', hindiName: 'मजलिस पार्क', line: 'pink', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 60, zone: 'North' },
  { name: 'Azadpur', hindiName: 'आजादपुर', line: 'pink', interchangeWith: ['Yellow Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 84, zone: 'North Hub' },
  { name: 'Netaji Subhash Place', hindiName: 'नेताजी सुभाष प्लेस', line: 'pink', interchangeWith: ['Red Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 88, zone: 'North-West Hub' },
  { name: 'Punjabi Bagh West', hindiName: 'पंजाबी बाग पश्चिम', line: 'pink', interchangeWith: ['Green Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 72, zone: 'West' },
  { name: 'Rajouri Garden', hindiName: 'राजौरी गार्डन', line: 'pink', interchangeWith: ['Blue Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 91, zone: 'West Interchange' },
  { name: 'Delhi Cantt', hindiName: 'दिल्ली छावनी', line: 'pink', interchangeWith: ['Railway'], hasPlatformEdgeDoors: true, averageCrowdIndex: 64, zone: 'West' },
  { name: 'Durgabai Deshmukh South Campus', hindiName: 'दुर्गाबाई देशमुख साउथ कैंपस', line: 'pink', interchangeWith: ['Airport Express'], hasPlatformEdgeDoors: true, averageCrowdIndex: 78, zone: 'University' },
  { name: 'Dilli Haat INA', hindiName: 'दिल्ली हाट आईएनए', line: 'pink', interchangeWith: ['Yellow Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 93, zone: 'Central Interchange' },
  { name: 'Lajpat Nagar', hindiName: 'लाजपत नगर', line: 'pink', interchangeWith: ['Violet Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 92, zone: 'Market Interchange' },
  { name: 'Sarai Kale Khan Hazrat Nizamuddin', hindiName: 'सराय काले खां निजामुद्दीन', line: 'pink', interchangeWith: ['Indian Railways', 'RRTS / Namo Bharat'], hasPlatformEdgeDoors: true, averageCrowdIndex: 90, zone: 'Transit Hub' },
  { name: 'Mayur Vihar-I', hindiName: 'मयूर विहार-1', line: 'pink', interchangeWith: ['Blue Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 87, zone: 'East Hub' },
  { name: 'Anand Vihar ISBT', hindiName: 'आनंद विहार आईएसबीटी', line: 'pink', interchangeWith: ['Blue Line', 'Railway Terminal', 'ISBT Bus'], hasPlatformEdgeDoors: true, averageCrowdIndex: 95, zone: 'Mega Intermodal Hub' },
  { name: 'Karkarduma', hindiName: 'कड़कड़डूमा', line: 'pink', interchangeWith: ['Blue Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 70, zone: 'East' },
  { name: 'Welcome', hindiName: 'वेलकम', line: 'pink', interchangeWith: ['Red Line'], hasPlatformEdgeDoors: true, averageCrowdIndex: 82, zone: 'North-East' },
  { name: 'Shiv Vihar', hindiName: 'शिव विहार', line: 'pink', interchangeWith: [], hasPlatformEdgeDoors: true, averageCrowdIndex: 65, zone: 'North-East Terminal' },
];

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: 'cardiac-arrest',
    title: 'Sudden Cardiac Arrest / Unconscious Passenger',
    hindiTitle: 'अचानक बेहोशी या दिल का दौरा',
    category: 'MEDICAL',
    symptoms: ['Unresponsive', 'No breathing or irregular gasping', 'Loss of pulse'],
    steps: [
      'IMMEDIATELY activate the Passenger Emergency Alarm (PEA) or notify Station Controller.',
      'Request the station staff to bring the Automated External Defibrillator (AED) located at Customer Care.',
      'Begin hands-only CPR immediately: push hard and fast in the center of the chest (100–120 compressions/min).',
      'Follow automated voice instructions once the AED unit is opened and pads are placed on bare chest.',
      'Keep clear of doors and allow station emergency medical team priority boarding.'
    ],
    hindiSteps: [
      'तुरंत ट्रेन में लगे पैसेंजर इमरजेंसी अलार्म (PEA) को खींचें या स्टेशन कंट्रोलर को सूचित करें।',
      'कस्टमर केयर से स्वचालित डिफाइब्रिलेटर (AED) लाने का अनुरोध करें।',
      'सीने के बीच में तेजी से 100-120 बार प्रति मिनट की दर से दोनों हाथों से दबाव (CPR) दें।',
      'AED मशीन आने पर उसके वॉयस निर्देशों का पालन करें।'
    ],
    equipmentRequired: ['Automated External Defibrillator (AED)', 'First Aid Stretcher', 'Oxygen Cylinder (Station Room)'],
    emergencyContacts: ['DMRC Helpline: 155370', 'Ambulance: 102 / 108', 'CISF Control: 011-22185555']
  },
  {
    id: 'track-fall',
    title: 'Platform Edge Fall / Track Intrusion',
    hindiTitle: 'ट्रैक पर गिरना / आपातकालीन स्टॉप',
    category: 'ACCIDENT',
    symptoms: ['Person or passenger dropped onto track bed', 'Trapped between train and platform screen door (PED)'],
    steps: [
      'DO NOT JUMP ONTO THE TRACK. The 25,000V overhead catenary / third-rail hazard and incoming driverless trains are lethal.',
      'IMMEDIATELY hit the red Emergency Stop Plunger (ESP) mounted on platform pillars near PED doors.',
      'ESP cut-off instantly trips traction power and commands an autonomous train Emergency Brake (EB) stopping all movement within 200m.',
      'Wave bright colored clothing or flash mobile light towards approaching train line if safe.',
      'Alert CISF officer and Station Controller via station intercom.'
    ],
    hindiSteps: [
      'ट्रैक पर बिल्कुल न कूदें! 25,000 वोल्ट करंट और ऑटोनॉमस ट्रेन का बड़ा खतरा है।',
      'प्लेटफॉर्म के खंभे पर लगे लाल इमरजेंसी स्टॉप प्लंजर (ESP) को तुरंत दबाएं।',
      'ESP दबाते ही ट्रेन की बिजली कट जाएगी और ऑटोमैटिक इमरजेंसी ब्रेक लग जाएंगे।',
      'स्टेशन कंट्रोलर और CISF जवानों को तुरंत सूचित करें।'
    ],
    equipmentRequired: ['Platform Emergency Stop Plunger (ESP)', 'Track Rescue Ladder', 'Insulated Stretcher'],
    emergencyContacts: ['Station Controller Intercom', 'Emergency Stop Plunger (Platform Pillar)', 'DMRC Safety: 155370']
  },
  {
    id: 'ped-gap-trap',
    title: 'Platform Edge Door (PED) Pinch / Gap Entrapment',
    hindiTitle: 'प्लेटफॉर्म स्क्रीन डोर (PED) में फंसना',
    category: 'ACCIDENT',
    symptoms: ['Bag strap, clothing, or limb trapped between train car doors and platform screen doors'],
    steps: [
      'Delhi Metro driverless trains have Anti-Pinch Optical Safety Curtains and Obstacle Detection (OD). The door will automatically cycle 3 times if an obstacle >15mm is detected.',
      'If train attempt fails, pull the Emergency Door Release handle inside the coach or push the PED Emergency Break Glass lever on platform.',
      'This immediately opens the safety interlock loop and prohibits driverless train departure (Traction Interlock Broken).',
      'Station Controller will manually inspect and reset before train can proceed in restricted manual mode.'
    ],
    hindiSteps: [
      'दिल्ली मेट्रो की ड्राइवरलेस ट्रेनों में एंटी-पिंच ऑप्टिकल सेंसर लगे होते हैं जो 15mm से बड़ी वस्तु पर 3 बार खुद खुलते हैं।',
      'यदि फिर भी दरवाजा न खुले, तो कोच के अंदर लगे आपातकालीन डोर हैंडल को खींचें।',
      'इससे ट्रेन का ट्रैक्शन इंटरलॉक टूट जाएगा और ट्रेन आगे नहीं बढ़ सकेगी।'
    ],
    equipmentRequired: ['PED Manual Emergency Release Key', 'Traction Cutoff Interlock'],
    emergencyContacts: ['Driverless OCC Shastri Park: 011-23417910', 'DMRC 155370']
  },
  {
    id: 'heat-panic',
    title: 'Crowd Panic / Heat Stroke / Suffocation',
    hindiTitle: 'भीड़ में घबराहट / हीट स्ट्रोक / सांस लेने में तकलीफ',
    category: 'MEDICAL',
    symptoms: ['Hyperventilation', 'Dizziness', 'Heavy sweating or clammy skin', 'Claustrophobia in peak crowd'],
    steps: [
      'Help the passenger sit down on the floor or platform bench, loosen tight collars/neckwear.',
      'Guide them away from congested coach doors towards Coach 3 or Coach 4 (which have lower density).',
      'Offer water sip-by-sip; ensure cool air conditioning vent flow.',
      'Instruct slow deep breaths: 4 seconds in, hold 4 seconds, 4 seconds out.',
      'If passenger faints, elevate feet 30cm and summon station wheelchair service.'
    ],
    hindiSteps: [
      'यात्री को तुरंत प्लेटफॉर्म बेंच या जमीन पर बैठाएं और तंग कपड़े ढीले करें।',
      'उन्हें भीड़ भरे दरवाजों से हटाकर शांत कोच की ओर ले जाएं।',
      'धीरे-धीरे पानी पिलाएं और गहरी सांस लेने में मदद करें।',
      'स्टेशन सहायता काउंटर से व्हीलचेयर और प्राथमिक उपचार की मांग करें।'
    ],
    equipmentRequired: ['Drinking Water', 'Electrolyte Sachet (ORS)', 'Station Wheelchair'],
    emergencyContacts: ['DMRC Passenger Assistance: 155370', 'Station Medical Room']
  },
  {
    id: 'metro-fire',
    title: 'In-Coach Smoke / Fire Detection (PASS Protocol)',
    hindiTitle: 'कोच या स्टेशन में धुआं / आग लगना',
    category: 'FIRE',
    symptoms: ['Smoke detector chime in train', 'Odor of burning insulation', 'Visual flame'],
    steps: [
      'Locate the Fire Extinguisher (Clean Agent / ABC Dry Chemical Powder) mounted under the end seats in every coach.',
      'Apply the P.A.S.S. protocol: Pull pin, Aim nozzle at base of fire, Squeeze trigger handle, Sweep side-to-side.',
      'Activate Coach Passenger Emergency Alarm (PEA) to alert UTO Operations Control Centre (OCC).',
      'Driverless train will automatically accelerate to the nearest station without stopping inside the tunnel (Tunnel Fire Protocol).',
      'Evacuate through Platform Screen Doors upon arrival; follow illuminated floor green arrows.'
    ],
    hindiSteps: [
      'हर कोच की अंतिम सीट के नीचे लगे अग्निशामक यंत्र (Fire Extinguisher) को निकालें।',
      'PASS नियम अपनाएं: पिन खींचें (Pull), आग की जड़ पर निशाना लगाएं (Aim), हैंडल दबाएं (Squeeze), दाएं-बाएं घुमाएं (Sweep)।',
      'कोच में लगा PEA अलार्म खींचें ताकि OCC कंट्रोल रूम को पता चल सके।',
      'ड्राइवरलेस ट्रेन सुरंग में नहीं रुकेगी, बल्कि अगले स्टेशन तक पहुंचेगी ताकि सुरक्षित निकासी हो सके।'
    ],
    equipmentRequired: ['ABC Dry Powder Extinguisher', 'Tunnel Smoke Extraction System', 'Emergency Exit Floor Lighting'],
    emergencyContacts: ['Fire Control: 101', 'DMRC OCC Central: 011-23417910']
  }
];

export const DMRC_EMERGENCY_CONTACTS = {
  dmrcHelpline: '155370',
  cisfSecurity: '011-22185555',
  womenSafetyHelpline: '1091 / 011-23415727',
  delhiAmbulance: '102 / 108',
  delhiPolice: '112',
  fireService: '101',
  occShastriPark: '011-23417910',
  seniorCitizenHelpline: '14567'
};

export const ALL_METRO_STATIONS: StationInfo[] = [
  ...MAGENTA_LINE_STATIONS,
  ...PINK_LINE_STATIONS
];

export interface RouteResult {
  origin: string;
  destination: string;
  stationsCount: number;
  estimatedMinutes: number;
  fareInr: number;
  line: 'Magenta Line (Line 8)' | 'Pink Line (Line 7)' | 'Interchange (Magenta ⇄ Pink)';
  interchangeStation?: string;
  interchangeLine?: string;
  path: string[];
  directions: string[];
  safetyAdvisory: string;
}

export function calculateMetroRoute(originName: string, destinationName: string): RouteResult {
  const norm = (s: string) => s.trim().toLowerCase();
  const originStation = ALL_METRO_STATIONS.find(s => norm(s.name) === norm(originName));
  const destStation = ALL_METRO_STATIONS.find(s => norm(s.name) === norm(destinationName));

  const origin = originStation ? originStation.name : originName;
  const destination = destStation ? destStation.name : destinationName;

  if (origin === destination) {
    return {
      origin,
      destination,
      stationsCount: 0,
      estimatedMinutes: 0,
      fareInr: 10,
      line: 'Magenta Line (Line 8)',
      path: [origin],
      directions: ['You are already at the destination station.'],
      safetyAdvisory: 'Platform Edge Doors (PEDs) operate automatically. Stand behind yellow tactile strip.'
    };
  }

  const magFromIdx = MAGENTA_LINE_STATIONS.findIndex(s => s.name === origin);
  const magToIdx = MAGENTA_LINE_STATIONS.findIndex(s => s.name === destination);
  const pinkFromIdx = PINK_LINE_STATIONS.findIndex(s => s.name === origin);
  const pinkToIdx = PINK_LINE_STATIONS.findIndex(s => s.name === destination);

  // Case 1: Both on Magenta Line
  if (magFromIdx !== -1 && magToIdx !== -1) {
    const forward = magToIdx > magFromIdx;
    const path = forward
      ? MAGENTA_LINE_STATIONS.slice(magFromIdx, magToIdx + 1).map(s => s.name)
      : MAGENTA_LINE_STATIONS.slice(magToIdx, magFromIdx + 1).reverse().map(s => s.name);
    const count = path.length - 1;
    const direction = forward ? 'Botanical Garden' : 'Janakpuri West';
    const estimatedMinutes = Math.round(count * 2.2);
    const fareInr = count <= 2 ? 10 : count <= 5 ? 20 : count <= 12 ? 30 : count <= 21 ? 40 : 50;

    return {
      origin,
      destination,
      stationsCount: count,
      estimatedMinutes,
      fareInr,
      line: 'Magenta Line (Line 8)',
      path,
      directions: [
        `Board westbound/eastbound Magenta Line driverless train towards "${direction}".`,
        `Ride across ${count} stations (${path.slice(1, -1).join(' → ') || 'Direct next stop'}).`,
        `Alight safely at "${destination}". Platform Edge Doors (PED) open automatically on the left side.`
      ],
      safetyAdvisory: 'UTO Level 4 Driverless operation. Keep hands clear of closing PED glass doors (3-pulse acoustic alarm).'
    };
  }

  // Case 2: Both on Pink Line
  if (pinkFromIdx !== -1 && pinkToIdx !== -1) {
    const forward = pinkToIdx > pinkFromIdx;
    const path = forward
      ? PINK_LINE_STATIONS.slice(pinkFromIdx, pinkToIdx + 1).map(s => s.name)
      : PINK_LINE_STATIONS.slice(pinkToIdx, pinkFromIdx + 1).reverse().map(s => s.name);
    const count = path.length - 1;
    const direction = forward ? 'Shiv Vihar' : 'Majlis Park';
    const estimatedMinutes = Math.round(count * 2.3);
    const fareInr = count <= 2 ? 10 : count <= 5 ? 20 : count <= 12 ? 30 : count <= 21 ? 40 : 50;

    return {
      origin,
      destination,
      stationsCount: count,
      estimatedMinutes,
      fareInr,
      line: 'Pink Line (Line 7)',
      path,
      directions: [
        `Board Pink Line driverless train towards "${direction}".`,
        `Ride across ${count} stations (${path.slice(1, -1).join(' → ') || 'Direct next stop'}).`,
        `Alight safely at "${destination}". All platforms have full-height Platform Screen Doors.`
      ],
      safetyAdvisory: 'Anti-Pinch NIR light curtain active. Bag straps exceeding 15mm will trigger automatic 3-cycle reopening.'
    };
  }

  // Case 3: Interchange between Magenta and Pink Line
  const isFromMagenta = magFromIdx !== -1;
  const magentaStation = isFromMagenta ? origin : destination;
  const pinkStation = isFromMagenta ? destination : origin;

  // Decide best interchange hub
  let hubMagenta = 'Hauz Khas';
  let hubPink = 'Dilli Haat INA';
  let transferLine = 'Yellow Line';

  // East stations transfer via Blue line (Botanical Garden ⇄ Mayur Vihar-I)
  const eastPinkStations = ['Mayur Vihar-I', 'Anand Vihar ISBT', 'Karkarduma', 'Welcome', 'Shiv Vihar'];
  if (eastPinkStations.includes(pinkStation)) {
    hubMagenta = 'Botanical Garden';
    hubPink = 'Mayur Vihar-I';
    transferLine = 'Blue Line';
  } else if (['Rajouri Garden', 'Punjabi Bagh West', 'Netaji Subhash Place', 'Azadpur', 'Majlis Park'].includes(pinkStation)) {
    hubMagenta = 'Janakpuri West';
    hubPink = 'Rajouri Garden';
    transferLine = 'Blue Line';
  }

  const magSubIdx = MAGENTA_LINE_STATIONS.findIndex(s => s.name === magentaStation);
  const magHubIdx = MAGENTA_LINE_STATIONS.findIndex(s => s.name === hubMagenta);
  const magLegCount = Math.abs(magSubIdx - magHubIdx);

  const pinkSubIdx = PINK_LINE_STATIONS.findIndex(s => s.name === pinkStation);
  const pinkHubIdx = PINK_LINE_STATIONS.findIndex(s => s.name === hubPink);
  const pinkLegCount = Math.abs(pinkSubIdx - pinkHubIdx);

  const totalStations = magLegCount + pinkLegCount + 2; // including interchange link
  const estimatedMinutes = Math.round(totalStations * 2.3 + 6); // +6 mins interchange walking
  const fareInr = Math.min(60, Math.max(30, totalStations <= 10 ? 30 : totalStations <= 18 ? 40 : totalStations <= 24 ? 50 : 60));

  const leg1 = isFromMagenta
    ? `Leg 1: Board Magenta Line from "${origin}" to interchange hub "${hubMagenta}" (${magLegCount} stops).`
    : `Leg 1: Board Pink Line from "${origin}" to interchange hub "${hubPink}" (${pinkLegCount} stops).`;

  const leg2 = isFromMagenta
    ? `Interchange: Follow the green directional floor signage to transfer via ${transferLine} to "${hubPink}" (Pink Line).`
    : `Interchange: Follow the floor signs to transfer via ${transferLine} to "${hubMagenta}" (Magenta Line).`;

  const leg3 = isFromMagenta
    ? `Leg 2: Board Pink Line towards "${destination}" (${pinkLegCount} stops). Alight at "${destination}".`
    : `Leg 2: Board Magenta Line towards "${destination}" (${magLegCount} stops). Alight at "${destination}".`;

  return {
    origin,
    destination,
    stationsCount: totalStations,
    estimatedMinutes,
    fareInr,
    line: 'Interchange (Magenta ⇄ Pink)',
    interchangeStation: isFromMagenta ? `${hubMagenta} ➔ ${hubPink}` : `${hubPink} ➔ ${hubMagenta}`,
    interchangeLine: transferLine,
    path: [origin, isFromMagenta ? hubMagenta : hubPink, isFromMagenta ? hubPink : hubMagenta, destination],
    directions: [leg1, leg2, leg3],
    safetyAdvisory: 'Interchange corridors at Hauz Khas and Rajouri Garden feature high commuter footfall. Follow floor directional arrows and keep behind yellow tactile lines.'
  };
}
