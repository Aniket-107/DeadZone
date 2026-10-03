import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, getStatusColor } from '../utils/theme';
import { getBuildingById, getFloorsByBuilding } from '../services/spotService';
import type { Building, Floor } from '../types';
import type { RootStackParamList } from '../navigation/types';

import FloorRowCard from '../components/FloorRowCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Building'>;

export default function BuildingScreen({ route, navigation }: Props) {
  const { buildingId, buildingName } = route.params;

  const [building, setBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const bData = await getBuildingById(buildingId);
      if (bData) setBuilding(bData);

      const fData = await getFloorsByBuilding(buildingId);
      setFloors(fData);
    } catch (error) {
      console.error('Failed to load building data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [buildingId])
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accentCyan} />
        </View>
      ) : building ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Summary Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.buildingName}>{building.name}</Text>
                <Text style={styles.buildingCode}>Code: {building.code}</Text>
              </View>
              <View style={[styles.statusBadge, { borderColor: getStatusColor(building.overallStatus) }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(building.overallStatus) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(building.overallStatus) }]}>
                  {building.overallStatus === 'good' ? 'Optimal' : building.overallStatus === 'moderate' ? 'Moderate' : 'Busy'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.description}>{building.description}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{building.totalFloors}</Text>
                <Text style={styles.statLabel}>Floors</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.statusOptimal }]}>{building.optimalSpotsCount}</Text>
                <Text style={styles.statLabel}>Optimal Spots</Text>
              </View>
            </View>
          </View>

          {/* Floors Stack */}
          <View style={styles.floorsContainer}>
            <Text style={styles.sectionTitle}>Directory</Text>
            <View style={styles.floorsList}>
              {floors.map(floor => (
                <FloorRowCard 
                  key={floor.id} 
                  floor={floor} 
                  onPress={() => navigation.navigate('Floor', { 
                    buildingId, 
                    buildingName, 
                    floorNumber: floor.floorNumber 
                  })} 
                />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Building not found.</Text>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    backgroundColor: COLORS.bgSurface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  buildingName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  buildingCode: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: COLORS.bgElevated,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3, marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgElevated,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderSubtle,
  },
  floorsContainer: {
    paddingBottom: 40,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  floorsList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  errorText: {
    color: COLORS.textMuted,
    fontSize: 16,
  }
});
