import React, { createContext, useCallback, useContext, useState } from 'react';
import { Spot, UserPreferences, Report } from '../types';

// ─── SavedSpots Context ───────────────────────────────────────────────────────

interface SavedSpotsContextValue {
  savedSpots: Spot[];
  saveSpot: (spot: Spot) => void;
  removeSpot: (spotId: string) => void;
  isSaved: (spotId: string) => boolean;
}

const SavedSpotsContext = createContext<SavedSpotsContextValue | null>(null);

// ─── UserPreferences Context ──────────────────────────────────────────────────

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

// ─── RecentReports Context ────────────────────────────────────────────────────

interface RecentReportsContextValue {
  recentReports: Report[];
  addReport: (report: Report) => void;
}

const RecentReportsContext = createContext<RecentReportsContextValue | null>(null);

// ─── Combined Provider ────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // SavedSpots state
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const saveSpot = useCallback((spot: Spot) => {
    setSavedSpots((prev) => (prev.find((s) => s.id === spot.id) ? prev : [...prev, spot]));
  }, []);
  const removeSpot = useCallback((spotId: string) => {
    setSavedSpots((prev) => prev.filter((s) => s.id !== spotId));
  }, []);
  const isSaved = useCallback(
    (spotId: string) => savedSpots.some((s) => s.id === spotId),
    [savedSpots],
  );

  // UserPreferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultMode: 'Study',
    alwaysPreferAC: false,
    minWifiMbps: 0,
    simulateLiveTelemetry: true,
  });
  const setPreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // RecentReports state
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const addReport = useCallback((report: Report) => {
    setRecentReports((prev) => [report, ...prev].slice(0, 20));
  }, []);

  return (
    <SavedSpotsContext.Provider value={{ savedSpots, saveSpot, removeSpot, isSaved }}>
      <UserPreferencesContext.Provider value={{ preferences, setPreference }}>
        <RecentReportsContext.Provider value={{ recentReports, addReport }}>
          {children}
        </RecentReportsContext.Provider>
      </UserPreferencesContext.Provider>
    </SavedSpotsContext.Provider>
  );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useSavedSpots = (): SavedSpotsContextValue => {
  const ctx = useContext(SavedSpotsContext);
  if (!ctx) throw new Error('useSavedSpots must be used within AppProvider');
  return ctx;
};

export const useUserPreferences = (): UserPreferencesContextValue => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error('useUserPreferences must be used within AppProvider');
  return ctx;
};

export const useRecentReports = (): RecentReportsContextValue => {
  const ctx = useContext(RecentReportsContext);
  if (!ctx) throw new Error('useRecentReports must be used within AppProvider');
  return ctx;
};
