import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../navigation/types';
import { COLORS } from '../utils/theme';
import { useSavedSpots } from '../hooks/AppContext';
import SpotListCard from '../components/SpotListCard';
import type { Spot } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Saved'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SavedSpotsScreen({ navigation }: Props) {
  const { savedSpots } = useSavedSpots();
  const [filterMode, setFilterMode] = useState<'All' | 'Optimal'>('All');

  const displayedSpots = savedSpots.filter(s => filterMode === 'All' || s.status === 'good');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Spots</Text>
      </View>

      <View style={styles.segmentContainer}>
        <TouchableOpacity 
          style={[styles.segmentBtn, filterMode === 'All' && styles.segmentBtnActive]}
          onPress={() => setFilterMode('All')}
        >
          <Text style={[styles.segmentText, filterMode === 'All' && styles.segmentTextActive]}>All Saved ({savedSpots.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.segmentBtn, filterMode === 'Optimal' && styles.segmentBtnActive]}
          onPress={() => setFilterMode('Optimal')}
        >
          <Text style={[styles.segmentText, filterMode === 'Optimal' && styles.segmentTextActive]}>Optimal Right Now</Text>
        </TouchableOpacity>
      </View>

      {displayedSpots.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {displayedSpots.map(spot => (
            <SpotListCard 
              key={spot.id} 
              spot={spot} 
              onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })} 
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyTitle}>
            {filterMode === 'All' ? 'No Saved Spots' : 'No Optimal Spots'}
          </Text>
          <Text style={styles.emptyText}>
            {filterMode === 'All' 
              ? "You haven't bookmarked any study spots yet."
              : "None of your saved spots are currently optimal."}
          </Text>
          <TouchableOpacity 
            style={styles.findBtn} 
            onPress={() => navigation.navigate('Find')}
          >
            <Text style={styles.findBtnText}>Find a Spot Now</Text>
          </TouchableOpacity>
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: COLORS.bgElevated,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.bgSurface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.textPrimary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  findBtn: {
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  findBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
