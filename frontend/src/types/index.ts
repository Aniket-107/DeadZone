export type StatusLevel = 'good' | 'moderate' | 'busy';
export type QuickMode = 'Study' | 'Call' | 'Gaming' | 'Chill';
export type ActivityType = 'Studying' | 'Gaming' | 'Taking a call' | 'Group work' | 'Chilling';
export type FilterKey = 'fastWifi' | 'quiet' | 'charging' | 'ac' | 'lowCrowd';

export interface NeedFilters {
  fastWifi: boolean;
  quiet: boolean;
  charging: boolean;
  ac: boolean;
  lowCrowd: boolean;
  quickMode?: QuickMode | null;
  searchQuery?: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  description: string;
  totalFloors: number;
  overallStatus: StatusLevel;
  optimalSpotsCount: number;
  coordinates: { x: number; y: number };
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  label: string;
  status: StatusLevel;
  availableSpotsCount: number;
  avgWifiMbps: number;
  avgNoiseDb: number;
}

export interface Spot {
  id: string;
  floorId: string;
  buildingId: string;
  buildingName: string;
  floorNumber: number;
  name: string;
  type: string;
  status: StatusLevel;
  wifiSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  ping: number; // ms
  noiseLevel: number; // dB
  noiseLabel: 'Very Quiet' | 'Quiet' | 'Moderate' | 'Loud';
  availableOutlets: number;
  totalOutlets: number;
  availableSeats: number;
  totalSeats: number;
  crowdLabel: 'Low' | 'Medium' | 'High';
  hasAC: boolean;
  bestFor: QuickMode[];
  tags: string[];
  matchPercentage: number;
  lastUpdated: string;
  photo?: string;
}

export interface Report {
  id: string;
  spotId: string;
  spotName: string;
  noiseLevel: number;
  crowdLevel: number;
  wifiRating: number;
  createdAt: string;
}

export interface UserPreferences {
  defaultMode: QuickMode;
  alwaysPreferAC: boolean;
  minWifiMbps: number;
  simulateLiveTelemetry: boolean;
}
