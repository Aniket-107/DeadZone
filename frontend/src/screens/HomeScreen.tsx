import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { COLORS, SHADOWS } from '../utils/theme';
import { getSpots } from '../services/spotService';
import type { Spot, NeedFilters, FilterKey, QuickMode } from '../types';
import type { RootStackParamList, TabParamList } from '../navigation/types';

import QuickModeSelector from '../components/QuickModeSelector';
import FilterChipRail from '../components/FilterChipRail';
import HeroSpotCard from '../components/HeroSpotCard';
import SpotListCard from '../components/SpotListCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const INITIAL_FILTERS: NeedFilters = {
  fastWifi: false,
  quiet: false,
  charging: false,
  ac: false,
  lowCrowd: false,
  quickMode: null,
  searchQuery: '',
};

export default function HomeScreen({ navigation }: Props) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  const [filters, setFilters] = useState<NeedFilters>(INITIAL_FILTERS);

  const loadSpots = async (currentFilters: NeedFilters) => {
    setIsLoading(true);
    try {
      const results = await getSpots(currentFilters);
      setSpots(results);
    } catch (error) {
      console.error('Failed to load spots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSpots(filters);
    }, [filters])
  );

  const handleToggleFilter = (key: FilterKey) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key as keyof NeedFilters]
    }));
  };

  const handleSelectQuickMode = (mode: QuickMode | null) => {
    setFilters(prev => ({
      ...prev,
      quickMode: mode
    }));
  };

  const handleSearch = (text: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: text
    }));
  };

  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const recommendedSpot = spots.length > 0 ? spots[0] : null;
  const otherSpots = spots.length > 1 ? spots.slice(1) : [];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} keyboardShouldPersistTaps="handled">
        
        {/* HEADER matching App (1).js exactly */}
        <View style={{ padding: 20, paddingBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.logo}><Text style={{ color: '#fff', fontWeight: '800' }}>DZ</Text></View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.h3}>DeadZone</Text>
                <Text style={[styles.sub, { fontSize: 11 }]}>Campus spot finder</Text>
              </View>
            </View>
            <View style={styles.avatarSm}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>RS</Text></View>
          </View>
          <Text style={[styles.kicker, { marginTop: 22 }]}>{day} · CAMPUS OPEN</Text>
          <Text style={styles.h1}>Find your zone.</Text>
          <Text style={styles.sub}>A little focus. A quick call. Your kind of spot.</Text>
          <TextInput 
            placeholder="Search spots or buildings" 
            placeholderTextColor={COLORS.textMuted} 
            value={filters.searchQuery} 
            onChangeText={handleSearch} 
            style={styles.search} 
          />
        </View>

        <Text style={[styles.eyebrow, { marginTop: 6 }]}>WHAT ARE YOU UP TO?</Text>

        {/* QUICK MODES */}
        <QuickModeSelector 
          selectedMode={filters.quickMode || null} 
          onSelectMode={handleSelectQuickMode} 
        />

        {/* FILTERS */}
        <FilterChipRail 
          filters={filters as Record<FilterKey, boolean>} 
          onToggleFilter={handleToggleFilter} 
        />

        {/* CONTENT */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accentBlue} />
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            {recommendedSpot ? (
              <View style={{ marginTop: 16 }}>
                <HeroSpotCard 
                  spot={recommendedSpot} 
                  onPress={() => navigation.navigate('SpotDetails', { spotId: recommendedSpot.id })} 
                />
              </View>
            ) : (
              <View style={[styles.panel, { marginHorizontal: 20, marginTop: 14, alignItems: 'center' }]}>
                <Text style={{ fontSize: 28 }}>🎯</Text>
                <Text style={[styles.name, { marginTop: 6 }]}>Pick a mood or a few must-haves</Text>
                <Text style={[styles.sub, { textAlign: 'center', marginTop: 4 }]}>We'll rank every spot by how well it fits you.</Text>
              </View>
            )}

            {spots.length > 0 && (
              <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.h2}>Best spots right now</Text>
                  <Text style={styles.livePill}>● Live</Text>
                </View>
                <Text style={styles.sub}>{spots.length} spots ranked for you</Text>
              </View>
            )}

            {otherSpots.length > 0 && (
              <View style={styles.listContainer}>
                {otherSpots.map((spot, i) => (
                  <SpotListCard 
                    key={spot.id} 
                    spot={spot} 
                    rank={i + 2} // Top spot is rank 1
                    saved={false}
                    onSave={() => {}}
                    onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })} 
                  />
                ))}
              </View>
            )}
            
            {spots.length > 0 && (
              <Text style={styles.foot}>Sample campus data · Photos are illustrative</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: COLORS.accentBlue, fontWeight: '700' },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, color: COLORS.textMuted, fontWeight: '700', paddingHorizontal: 20, marginTop: 8 },
  h1: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginTop: 4 },
  h2: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  h3: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  sub: { color: COLORS.textMuted, fontSize: 13 },
  foot: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 20 },
  logo: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.accentBlue, alignItems: 'center', justifyContent: 'center' },
  avatarSm: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.textPrimary, alignItems: 'center', justifyContent: 'center' },
  search: { backgroundColor: COLORS.bgSurface, borderRadius: 14, padding: 12, marginTop: 14, borderWidth: 1, borderColor: COLORS.borderSubtle, color: COLORS.textPrimary },
  livePill: { color: COLORS.statusOptimal, fontWeight: '700', fontSize: 12, backgroundColor: '#E6F6EC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden' },
  panel: { backgroundColor: COLORS.bgSurface, borderRadius: 20, padding: 16, ...SHADOWS.md },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  
  resultsContainer: {
    paddingBottom: 40,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  loadingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  }
});
