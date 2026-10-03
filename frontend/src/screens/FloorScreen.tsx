import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, getStatusColor } from '../utils/theme';
import { getSpotsByFloor } from '../services/spotService';
import type { Spot, NeedFilters, FilterKey } from '../types';
import type { RootStackParamList } from '../navigation/types';

import SpotListCard from '../components/SpotListCard';
import FilterChipRail from '../components/FilterChipRail';

type Props = NativeStackScreenProps<RootStackParamList, 'Floor'>;

const INITIAL_FILTERS: NeedFilters = {
  fastWifi: false,
  quiet: false,
  charging: false,
  ac: false,
  lowCrowd: false,
};

export default function FloorScreen({ route, navigation }: Props) {
  const { buildingId, buildingName, floorNumber } = route.params;

  const [spots, setSpots] = useState<Spot[]>([]);
  const [filters, setFilters] = useState<NeedFilters>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const fSpots = await getSpotsByFloor(buildingId, floorNumber);
      setSpots(fSpots);
    } catch (error) {
      console.error('Failed to load floor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [buildingId, floorNumber])
  );

  const handleToggleFilter = (key: FilterKey) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key as keyof NeedFilters]
    }));
  };

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      if (filters.fastWifi && spot.wifiSpeed < 50) return false;
      if (filters.quiet && spot.noiseLevel > 40) return false;
      if (filters.charging && spot.availableOutlets === 0) return false;
      if (filters.ac && !spot.hasAC) return false;
      if (filters.lowCrowd && spot.crowdLabel === 'High') return false;
      return true;
    });
  }, [spots, filters]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Summary */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Floor {floorNumber}</Text>
        <Text style={styles.headerSubtitle}>{buildingName} · {spots.length} Rooms</Text>
      </View>

      {/* Room Status Strip */}
      <View style={styles.roomStripContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomStrip}>
          {spots.map(spot => {
            const statusColor = getStatusColor(spot.status);
            return (
              <TouchableOpacity key={`strip-${spot.id}`} style={styles.roomPill} onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })}>
                <View style={[styles.roomPillDot, { backgroundColor: statusColor }]} />
                <Text style={styles.roomPillText}>{spot.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FilterChipRail filters={filters as Record<FilterKey, boolean>} onToggleFilter={handleToggleFilter} />
      </View>

      {/* Spots List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accentCyan} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.spotsList} showsVerticalScrollIndicator={false}>
          {filteredSpots.length > 0 ? (
            filteredSpots.map(spot => (
              <SpotListCard 
                key={spot.id} 
                spot={spot} 
                onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No rooms match these filters.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  roomStripContainer: {
    backgroundColor: COLORS.bgElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingVertical: 12,
  },
  roomStrip: {
    paddingHorizontal: 16,
    gap: 12,
  },
  roomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  roomPillDot: {
    width: 8, height: 8, borderRadius: 4, marginRight: 6,
  },
  roomPillText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  filtersContainer: {
    paddingTop: 16,
    backgroundColor: COLORS.bgCanvas,
  },
  spotsList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
  }
});
