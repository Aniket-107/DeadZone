import { NavigatorScreenParams } from '@react-navigation/native';

// ─── Tab Navigator Params ─────────────────────────────────────────────────────

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Find: undefined;
  Saved: undefined;
  Profile: undefined;
};

// ─── Root Stack Params ────────────────────────────────────────────────────────

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Building: { buildingId: string; buildingName: string };
  Floor: { buildingId: string; buildingName: string; floorNumber: number };
  SpotDetails: { spotId: string };
  MatchResults: { activityType: string; filters: Record<string, boolean> };
};
