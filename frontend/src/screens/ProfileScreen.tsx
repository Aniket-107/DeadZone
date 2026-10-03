import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../navigation/types';
import { COLORS, SHADOWS } from '../utils/theme';
import { useUserPreferences, useSavedSpots, useRecentReports } from '../hooks/AppContext';
import { QuickMode } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MODES: QuickMode[] = ['Study', 'Call', 'Gaming', 'Chill'];

export default function ProfileScreen({ navigation }: Props) {
  const { preferences, setPreference } = useUserPreferences();
  const { savedSpots } = useSavedSpots();
  const { recentReports } = useRecentReports();
  const insets = useSafeAreaInsets();

  const resetDemoState = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPreference('defaultMode', 'Study');
    setPreference('alwaysPreferAC', false);
    setPreference('minWifiMbps', 0);
    setPreference('simulateLiveTelemetry', true);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Student Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <View style={styles.identityInfo}>
            <Text style={styles.studentName}>Campus Explorer</Text>
            <Text style={styles.studentSubtitle}>B.Tech CSE · Year 2</Text>
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedText}>✓ Verified Contributor</Text>
            </View>
          </View>
        </View>

        {/* Live Impact Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{savedSpots.length}</Text>
            <Text style={styles.statLabel}>Saved Spots</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{recentReports.length}</Text>
            <Text style={styles.statLabel}>Reports Sent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.statusOptimal }]}>Online</Text>
            <Text style={styles.statLabel}>Campus Status</Text>
          </View>
        </View>

        {/* My Vibe Defaults */}
        <Text style={styles.sectionTitle}>My Vibe Defaults</Text>
        <View style={styles.card}>
          <View style={styles.settingRowVertical}>
            <Text style={styles.settingLabel}>Default Quick Mode</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
              {MODES.map(mode => (
                <TouchableOpacity 
                  key={mode} 
                  style={[styles.segmentBtn, preferences.defaultMode === mode && styles.segmentBtnActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPreference('defaultMode', mode);
                  }}
                >
                  <Text style={[styles.segmentText, preferences.defaultMode === mode && styles.segmentTextActive]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Always Prefer A/C</Text>
            <Switch 
              value={preferences.alwaysPreferAC} 
              onValueChange={v => {
                Haptics.selectionAsync();
                setPreference('alwaysPreferAC', v);
              }}
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.accentBlue }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRowVertical}>
            <Text style={styles.settingLabel}>Minimum Wi-Fi Target</Text>
            <View style={styles.pillsRow}>
              {[25, 50, 100].map(val => (
                <TouchableOpacity 
                  key={val}
                  style={[styles.pill, preferences.minWifiMbps === val && styles.pillActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPreference('minWifiMbps', val);
                  }}
                >
                  <Text style={[styles.pillText, preferences.minWifiMbps === val && styles.pillTextActive]}>{val} Mbps</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Simulate Live Telemetry</Text>
              <Text style={styles.settingHint}>Shows visual updates on sensors</Text>
            </View>
            <Switch 
              value={preferences.simulateLiveTelemetry} 
              onValueChange={v => {
                Haptics.selectionAsync();
                setPreference('simulateLiveTelemetry', v);
              }}
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.accentBlue }}
            />
          </View>
        </View>

        {/* Recent Crowdsource Reports */}
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {recentReports.length > 0 ? (
          <View style={styles.card}>
            {recentReports.map((r, i) => (
              <View key={r.id} style={[styles.reportRow, i !== recentReports.length - 1 && styles.borderBottom]}>
                <View>
                  <Text style={styles.reportSpot}>{r.spotName}</Text>
                  <Text style={styles.reportTime}>{new Date(r.createdAt).toLocaleTimeString()}</Text>
                </View>
                <View style={styles.reportValues}>
                  <Text style={styles.reportValueText}>Noise: {r.noiseLevel}</Text>
                  <Text style={styles.reportValueText}>Crowd: {r.crowdLevel}</Text>
                  <Text style={styles.reportValueText}>Wi-Fi: {r.wifiRating}★</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.card, { paddingVertical: 24, alignItems: 'center' }]}>
            <Text style={styles.emptyNote}>No reports submitted in this session.</Text>
          </View>
        )}

        {/* Demo Reset Button */}
        <TouchableOpacity style={styles.resetBtn} onPress={resetDemoState}>
          <Text style={styles.resetBtnText}>Reset Demo Data & Preferences</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    ...SHADOWS.sm,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },
  identityInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  studentSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  verifiedPill: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: COLORS.statusOptimal,
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingRowVertical: {
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  settingHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginVertical: 8,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderColor: COLORS.accentBlue,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.accentBlue,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  pill: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  pillActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderColor: COLORS.accentBlue,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.accentBlue,
  },
  emptyNote: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  reportSpot: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reportTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  reportValues: {
    alignItems: 'flex-end',
  },
  reportValueText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: COLORS.statusDeadzone,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    color: COLORS.statusDeadzone,
    fontSize: 15,
    fontWeight: '700',
  }
});
