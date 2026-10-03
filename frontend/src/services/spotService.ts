import { Building, Floor, NeedFilters, Report, Spot } from '../types';
import { BUILDINGS, FLOORS, RECENT_REPORTS, SPOTS } from '../data/mockData';
import { filterAndRankSpots } from '../utils/matching';

// In-memory mutable store (simulates backend state)
let _spots: Spot[] = SPOTS.map((s) => ({ ...s }));
let _reports: Report[] = RECENT_REPORTS.map((r) => ({ ...r }));

// ─── Buildings ────────────────────────────────────────────────────────────────

export const getBuildings = async (): Promise<Building[]> => {
  return BUILDINGS;
};

export const getBuildingById = async (id: string): Promise<Building | undefined> => {
  return BUILDINGS.find((b) => b.id === id);
};

// ─── Floors ───────────────────────────────────────────────────────────────────

export const getFloorsByBuilding = async (buildingId: string): Promise<Floor[]> => {
  return FLOORS.filter((f) => f.buildingId === buildingId).sort(
    (a, b) => b.floorNumber - a.floorNumber,
  );
};

// ─── Spots ────────────────────────────────────────────────────────────────────

export const getSpots = async (filters?: NeedFilters): Promise<Spot[]> => {
  if (!filters) return _spots;
  return filterAndRankSpots(_spots, filters);
};

export const getSpotById = async (id: string): Promise<Spot | undefined> => {
  return _spots.find((s) => s.id === id);
};

export const getSpotsByFloor = async (
  buildingId: string,
  floorNumber: number,
): Promise<Spot[]> => {
  return _spots.filter(
    (s) => s.buildingId === buildingId && s.floorNumber === floorNumber,
  );
};

export const getRecommendedSpot = async (filters?: NeedFilters): Promise<Spot | undefined> => {
  const ranked = await getSpots(filters);
  return ranked[0];
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const submitSpotReport = async (
  report: Omit<Report, 'id' | 'createdAt'>,
): Promise<Report> => {
  const newReport: Report = {
    ...report,
    id: `r${Date.now()}`,
    createdAt: 'Just now',
  };

  _reports = [newReport, ..._reports];

  // Update in-memory spot status based on crowdsource feedback
  _spots = _spots.map((spot) => {
    if (spot.id !== report.spotId) return spot;
    const avgNoise = report.noiseLevel; // 1–5 scale
    return {
      ...spot,
      status:
        avgNoise <= 2 && report.crowdLevel <= 2
          ? 'good'
          : avgNoise <= 3 && report.crowdLevel <= 3
          ? 'moderate'
          : 'busy',
      lastUpdated: 'Just now',
    };
  });

  return newReport;
};

export const getRecentReports = async (): Promise<Report[]> => {
  return _reports;
};
