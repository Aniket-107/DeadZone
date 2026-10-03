import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, getStatusColor, getWifiColor, getNoiseColor } from '../utils/theme';
import { getSpotById } from '../services/spotService';
import type { Spot } from '../types';
import type { RootStackParamList } from '../navigation/types';
import { useSavedSpots, useRecentReports } from '../hooks/AppContext';
import ReportStatusModal from '../components/ReportStatusModal';

type Props = NativeStackScreenProps<RootStackParamList, 'SpotDetails'>;

export default function SpotDetailsScreen({ route, navigation }: Props) {
  const { spotId } = route.params;
  const { isSaved, saveSpot, removeSpot } = useSavedSpots();
  const { addReport } = useRecentReports();
  
  const [spot, setSpot] = useState<Spot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isTestingSignal, setIsTestingSignal] = useState(false);
  const [signalVerified, setSignalVerified] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const loadData = async () => {
    try {
      const data = await getSpotById(spotId);
      if (data) setSpot(data);
    } catch (error) {
      console.error('Failed to load spot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [spotId])
  );

  const handleTestSignal = () => {
    setIsTestingSignal(true);
    setSignalVerified(false);
    setTimeout(() => {
      setIsTestingSignal(false);
      setSignalVerified(true);
    }, 1200);
  };

  const handleReportSubmit = async (noiseLevel: string, crowdLevel: string, wifiRating: number) => {
    // Map string values to numeric logic for the demo report
    let noiseVal = 2; // Quiet
    if (noiseLevel === 'Very Quiet') noiseVal = 1;
    if (noiseLevel === 'Moderate') noiseVal = 3;
    if (noiseLevel === 'Loud') noiseVal = 4;
    
    let crowdVal = 2;
    if (crowdLevel === 'Low') crowdVal = 1;
    if (crowdLevel === 'High') crowdVal = 3;

    await addReport({
      spotId,
      spotName: spot?.name || 'Unknown',
      noiseLevel: noiseVal,
      crowdLevel: crowdVal,
      wifiRating
    } as any);
    // Reload spot to show updated status
    await loadData();
  };

  if (isLoading || !spot) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        {isLoading ? <ActivityIndicator size="large" color={COLORS.accentCyan} /> : <Text style={styles.errorText}>Spot not found.</Text>}
      </SafeAreaView>
    );
  }

  const spotIsSaved = isSaved(spot.id);
  const statusColor = getStatusColor(spot.status);
  
  const noisePercentage = Math.min(Math.max((spot.noiseLevel / 80) * 100, 0), 100);
  const powerPercentage = spot.totalOutlets > 0 ? (spot.availableOutlets / spot.totalOutlets) * 100 : 0;
  const seatsPercentage = spot.totalSeats > 0 ? (spot.availableSeats / spot.totalSeats) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* TOP IDENTITY HEADER */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.spotName}>{spot.name}</Text>
              <Text style={styles.subtitle}>{spot.buildingName} · Floor {spot.floorNumber} · {spot.type}</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{spot.matchPercentage}% MATCH</Text>
            </View>
          </View>
          
          <View style={[styles.statusPill, { backgroundColor: `${statusColor}15`, borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {spot.status === 'good' ? 'Optimal' : spot.status === 'moderate' ? 'Moderate' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* WIFI TELEMETRY CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Network Telemetry</Text>
          <View style={styles.wifiRow}>
            <View style={styles.wifiStat}>
              <Text style={styles.wifiLabel}>Download</Text>
              <Text style={[styles.wifiValue, { color: getWifiColor(spot.wifiSpeed) }]}>{isTestingSignal ? '--' : spot.wifiSpeed} <Text style={styles.unit}>Mbps</Text></Text>
            </View>
            <View style={styles.wifiStat}>
              <Text style={styles.wifiLabel}>Upload</Text>
              <Text style={styles.wifiValue}>{isTestingSignal ? '--' : spot.uploadSpeed} <Text style={styles.unit}>Mbps</Text></Text>
            </View>
            <View style={styles.wifiStat}>
              <Text style={styles.wifiLabel}>Ping</Text>
              <Text style={styles.wifiValue}>{isTestingSignal ? '--' : spot.ping} <Text style={styles.unit}>ms</Text></Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.testBtn, isTestingSignal && styles.testBtnActive, signalVerified && styles.testBtnVerified]}
            onPress={handleTestSignal}
            disabled={isTestingSignal}
          >
            {isTestingSignal ? (
              <ActivityIndicator color={COLORS.bgSurface} size="small" />
            ) : (
              <Text style={[styles.testBtnText, (isTestingSignal || signalVerified) && { color: COLORS.bgSurface }]}>
                {signalVerified ? 'Signal Verified ✓' : 'Test Signal'}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.caption}>Simulated Campus Telemetry · Updated {spot.lastUpdated}</Text>
        </View>

        {/* ACOUSTIC DECIBEL CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Acoustic Level</Text>
            <Text style={styles.noiseValue}>{spot.noiseLevel} dB</Text>
          </View>
          
          <View style={styles.meterContainer}>
            <View style={[styles.meterFill, { width: `${noisePercentage}%`, backgroundColor: getNoiseColor(spot.noiseLevel) }]} />
          </View>
          <Text style={styles.meterLabel}>{spot.noiseLabel}</Text>
        </View>

        {/* POWER & CROWD GRID */}
        <View style={styles.gridRow}>
          <View style={[styles.card, styles.gridCard]}>
            <Text style={styles.cardTitle}>Power Outlets</Text>
            <Text style={styles.gridValue}>{spot.availableOutlets} / {spot.totalOutlets}</Text>
            <View style={styles.meterContainer}>
              <View style={[styles.meterFill, { width: `${powerPercentage}%`, backgroundColor: COLORS.accentCyan }]} />
            </View>
            <Text style={styles.meterLabel}>Free Outlets</Text>
          </View>
          <View style={[styles.card, styles.gridCard]}>
            <Text style={styles.cardTitle}>Crowd Level</Text>
            <Text style={styles.gridValue}>{spot.availableSeats} / {spot.totalSeats}</Text>
            <View style={styles.meterContainer}>
              <View style={[styles.meterFill, { width: `${seatsPercentage}%`, backgroundColor: getStatusColor(spot.status) }]} />
            </View>
            <Text style={styles.meterLabel}>{spot.crowdLabel} Crowd</Text>
          </View>
        </View>

        {/* TAGS & AMENITIES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Environment</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{spot.hasAC ? '❄️ AC Available' : 'No AC'}</Text>
            </View>
            {spot.bestFor.map(mode => (
              <View key={mode} style={styles.badge}>
                <Text style={styles.badgeText}>✨ Best for {mode}</Text>
              </View>
            ))}
            {spot.tags.map(tag => (
              <View key={tag} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ACTION BAR */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, spotIsSaved && styles.actionBtnActive]} 
              onPress={() => spotIsSaved ? removeSpot(spot.id) : saveSpot(spot)}
            >
              <Text style={[styles.actionBtnText, spotIsSaved && styles.actionBtnTextActive]}>
                {spotIsSaved ? '🔖 Saved ✓' : '🔖 Save Spot'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: COLORS.accentBlue, borderColor: COLORS.accentBlue }]} 
              onPress={() => setReportModalVisible(true)}
            >
              <Text style={[styles.actionBtnText, { color: '#FFF' }]}>📡 Live Update</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.fullBtn}
            onPress={() => navigation.navigate('Floor', { buildingId: spot.buildingId, buildingName: spot.buildingName, floorNumber: spot.floorNumber })}
          >
            <Text style={styles.fullBtnText}>🗺️ Directions / Floor View</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <ReportStatusModal 
        visible={reportModalVisible} 
        spotName={spot.name} 
        onClose={() => setReportModalVisible(false)} 
        onSubmit={handleReportSubmit} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  spotName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  matchBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentBlue,
  },
  matchText: {
    color: COLORS.accentBlue,
    fontWeight: '800',
    fontSize: 12,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3, marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  wifiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  wifiStat: {
    alignItems: 'flex-start',
  },
  wifiLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  wifiValue: {
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: COLORS.textPrimary,
  },
  unit: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  testBtn: {
    backgroundColor: COLORS.bgElevated,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  testBtnActive: {
    backgroundColor: COLORS.accentCyan,
    borderColor: COLORS.accentCyan,
  },
  testBtnVerified: {
    backgroundColor: COLORS.statusOptimal,
    borderColor: COLORS.statusOptimal,
  },
  testBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  caption: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noiseValue: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: COLORS.textPrimary,
  },
  meterContainer: {
    height: 8,
    backgroundColor: COLORS.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  meterLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCard: {
    flex: 1,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  badgeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    borderColor: COLORS.accentCyan,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionBtnTextActive: {
    color: COLORS.accentCyan,
  },
  fullBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  fullBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  }
});
