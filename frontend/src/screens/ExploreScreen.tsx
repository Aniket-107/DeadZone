import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { COLORS, getStatusColor } from '../utils/theme';
import { getBuildings, getSpots } from '../services/spotService';
import type { Building, Spot, NeedFilters, FilterKey } from '../types';
import type { RootStackParamList, TabParamList } from '../navigation/types';

import FilterChipRail from '../components/FilterChipRail';
import SpotListCard from '../components/SpotListCard';
import CampusRadarMap from '../components/CampusRadarMap';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Explore'>,
  NativeStackScreenProps<RootStackParamList>
>;

const INITIAL_FILTERS: NeedFilters = {
  fastWifi: false,
  quiet: false,
  charging: false,
  ac: false,
  lowCrowd: false,
  searchQuery: '',
};

export default function ExploreScreen({ navigation }: Props) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [matchingSpots, setMatchingSpots] = useState<Spot[]>([]);
  const [filters, setFilters] = useState<NeedFilters>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (currentFilters: NeedFilters) => {
    setIsLoading(true);
    try {
      const allBuildings = await getBuildings();
      setBuildings(allBuildings);

      // Only load matching spots if there's an active filter or search
      const hasActiveFilters = 
        currentFilters.fastWifi || currentFilters.quiet || 
        currentFilters.charging || currentFilters.ac || 
        currentFilters.lowCrowd || !!currentFilters.searchQuery;

      if (hasActiveFilters) {
        const spots = await getSpots(currentFilters);
        setMatchingSpots(spots);
      } else {
        setMatchingSpots([]);
      }
    } catch (error) {
      console.error('Failed to load explore data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData(filters);
    }, [filters])
  );

  const handleToggleFilter = (key: FilterKey) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key as keyof NeedFilters]
    }));
  };

  const handleSearch = (text: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: text
    }));
  };

  const hasActiveFilters = useMemo(() => (
    filters.fastWifi || filters.quiet || 
    filters.charging || filters.ac || 
    filters.lowCrowd || !!filters.searchQuery
  ), [filters]);

  const totalOptimalSpots = buildings.reduce((sum, b) => sum + b.optimalSpotsCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Campus</Text>
          <Text style={styles.subtitle}>
            {buildings.length} Buildings · {totalOptimalSpots} Optimal Spots Active
          </Text>
        </View>

        {/* SEARCH & FILTERS (Sticky) */}
        <View style={styles.stickyContainer}>
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Find building, floor, or tag..."
              placeholderTextColor={COLORS.textMuted}
              value={filters.searchQuery}
              onChangeText={handleSearch}
              autoCorrect={false}
            />
            {filters.searchQuery ? (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.filterRailContainer}>
            <FilterChipRail 
              filters={filters as Record<FilterKey, boolean>} 
              onToggleFilter={handleToggleFilter} 
            />
          </View>
        </View>

        {/* CONTENT */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accentCyan} />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {!hasActiveFilters && (
              <>
                <CampusRadarMap 
                  buildings={buildings} 
                  onBuildingPress={(b) => navigation.navigate('Building', { buildingId: b.id, buildingName: b.name })} 
                />
                
                <Text style={styles.sectionTitle}>Campus Buildings</Text>
                <View style={styles.buildingList}>
                  {buildings.map(building => (
                    <TouchableOpacity 
                      key={building.id}
                      style={styles.buildingCard}
                      onPress={() => navigation.navigate('Building', { buildingId: building.id, buildingName: building.name })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.buildingHeader}>
                        <View style={styles.buildingHeaderLeft}>
                          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(building.overallStatus) }]} />
                          <Text style={styles.buildingName}>{building.name}</Text>
                        </View>
                        <View style={styles.codeBadge}>
                          <Text style={styles.codeText}>{building.code}</Text>
                        </View>
                      </View>
                      <Text style={styles.buildingDesc}>{building.description}</Text>
                      <View style={styles.buildingFooter}>
                        <Text style={styles.footerStat}>{building.totalFloors} Floors</Text>
                        <Text style={styles.footerDivider}>•</Text>
                        <Text style={[styles.footerStat, { color: COLORS.statusOptimal }]}>
                          {building.optimalSpotsCount} Optimal Spots
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {hasActiveFilters && (
              <>
                <Text style={styles.sectionTitle}>Matching Spots Across Campus</Text>
                {matchingSpots.length > 0 ? (
                  <View style={styles.spotsList}>
                    {matchingSpots.map(spot => (
                      <SpotListCard 
                        key={spot.id} 
                        spot={spot} 
                        onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })} 
                      />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>No spots match your criteria.</Text>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.accentCyan,
    fontSize: 14,
    fontWeight: '600',
  },
  stickyContainer: {
    backgroundColor: COLORS.bgCanvas,
    zIndex: 10,
    paddingBottom: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  filterRailContainer: {
    // padding is handled inside FilterChipRail for horizontal scroll
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buildingList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  buildingCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  buildingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buildingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  buildingName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  codeBadge: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  codeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  buildingDesc: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  buildingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerStat: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  footerDivider: {
    color: COLORS.textMuted,
    marginHorizontal: 8,
  },
  spotsList: {
    paddingHorizontal: 16,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  }
});
