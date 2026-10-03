import { Spot, NeedFilters, ActivityType, QuickMode } from '../types';

// ─── Activity → weight profiles ───────────────────────────────────────────────
const ACTIVITY_WEIGHTS: Record<ActivityType, Partial<Record<keyof NeedFilters, number>>> = {
  Studying: { quiet: 0.35, charging: 0.25, ac: 0.20, fastWifi: 0.15, lowCrowd: 0.05 },
  Gaming: { fastWifi: 0.45, charging: 0.30, lowCrowd: 0.15, quiet: 0.05, ac: 0.05 },
  'Taking a call': { quiet: 0.40, lowCrowd: 0.30, fastWifi: 0.20, charging: 0.05, ac: 0.05 },
  'Group work': { lowCrowd: 0.10, charging: 0.30, fastWifi: 0.25, quiet: 0.05, ac: 0.30 },
  Chilling: { ac: 0.35, lowCrowd: 0.30, charging: 0.15, quiet: 0.10, fastWifi: 0.10 },
};

// ─── QuickMode → NeedFilters mapping ─────────────────────────────────────────
export const QUICK_MODE_FILTERS: Record<QuickMode, Partial<NeedFilters>> = {
  Study: { quiet: true, charging: true, ac: true, fastWifi: false, lowCrowd: false },
  Call: { quiet: true, lowCrowd: true, fastWifi: true, charging: false, ac: false },
  Gaming: { fastWifi: true, charging: true, lowCrowd: false, quiet: false, ac: false },
  Chill: { ac: true, lowCrowd: false, charging: false, fastWifi: false, quiet: false },
};

/**
 * Calculates a 0–100 match score for a spot against the given filters & activity.
 */
export const calculateSpotMatch = (
  spot: Spot,
  filters: Partial<NeedFilters>,
  activity?: ActivityType,
): number => {
  const weights = activity
    ? ACTIVITY_WEIGHTS[activity]
    : { quiet: 0.2, fastWifi: 0.2, charging: 0.2, ac: 0.2, lowCrowd: 0.2 };

  const scores: { key: keyof typeof weights; score: number }[] = [
    {
      key: 'quiet',
      score:
        spot.noiseLevel <= 28 ? 100
        : spot.noiseLevel <= 38 ? 80
        : spot.noiseLevel <= 50 ? 50
        : spot.noiseLevel <= 60 ? 25
        : 0,
    },
    {
      key: 'fastWifi',
      score:
        spot.wifiSpeed >= 100 ? 100
        : spot.wifiSpeed >= 80 ? 90
        : spot.wifiSpeed >= 50 ? 75
        : spot.wifiSpeed >= 25 ? 45
        : 10,
    },
    {
      key: 'charging',
      score:
        spot.totalOutlets === 0
          ? 0
          : Math.round((spot.availableOutlets / spot.totalOutlets) * 100),
    },
    {
      key: 'ac',
      score: spot.hasAC ? 100 : 0,
    },
    {
      key: 'lowCrowd',
      score:
        spot.totalSeats === 0
          ? 0
          : Math.round(((spot.totalSeats - spot.availableSeats) / spot.totalSeats) * 100) <= 30
          ? 100
          : Math.round(((spot.totalSeats - spot.availableSeats) / spot.totalSeats) * 100) <= 60
          ? 60
          : 20,
    },
  ];

  // If no filters are active → use equal weights across all dimensions
  const activeFilters = Object.entries(filters).filter(
    ([k, v]) => typeof v === 'boolean' && v && k in weights,
  );

  if (activeFilters.length === 0) {
    // Return unweighted average
    const total = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.min(100, Math.round(total / scores.length));
  }

  // Weighted sum across active filter dimensions only
  let weightedSum = 0;
  let totalWeight = 0;

  for (const { key, score } of scores) {
    const w = weights[key as keyof typeof weights] ?? 0;
    const filterActive = filters[key as keyof NeedFilters];
    if (filterActive || activity) {
      weightedSum += score * (w as number);
      totalWeight += w as number;
    }
  }

  return totalWeight > 0 ? Math.min(100, Math.round(weightedSum / totalWeight)) : 50;
};

/**
 * Filters and ranks spots by search query, active filters, and match score.
 */
export const filterAndRankSpots = (
  spots: Spot[],
  filters: NeedFilters,
  activity?: ActivityType,
): Spot[] => {
  const { searchQuery, quickMode, fastWifi, quiet, charging, ac, lowCrowd } = filters;

  // Merge quickMode into filter flags
  const resolvedFilters: NeedFilters = { ...filters };
  if (quickMode) {
    const modeFlags = QUICK_MODE_FILTERS[quickMode];
    Object.assign(resolvedFilters, modeFlags);
  }

  let results = spots.map((spot) => ({
    ...spot,
    matchPercentage: calculateSpotMatch(spot, resolvedFilters, activity),
  }));

  // Search query filter
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.buildingName.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.type.toLowerCase().includes(q),
    );
  }

  // Hard-filter: only show spots that meet the minimum bar for toggled filters
  if (resolvedFilters.fastWifi) results = results.filter((s) => s.wifiSpeed >= 50);
  if (resolvedFilters.quiet) results = results.filter((s) => s.noiseLevel <= 38);
  if (resolvedFilters.charging) results = results.filter((s) => s.availableOutlets > 0);
  if (resolvedFilters.ac) results = results.filter((s) => s.hasAC);
  if (resolvedFilters.lowCrowd)
    results = results.filter(
      (s) => s.totalSeats === 0 || (s.totalSeats - s.availableSeats) / s.totalSeats <= 0.5,
    );

  // Sort by match percentage descending
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};
