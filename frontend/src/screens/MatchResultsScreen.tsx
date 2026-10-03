import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../utils/theme';
import { getSpots } from '../services/spotService';
import type { Spot } from '../types';
import HeroSpotCard from '../components/HeroSpotCard';
import SpotListCard from '../components/SpotListCard';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchResults'>;

export default function MatchResultsScreen({ route, navigation }: Props) {
  const { filters, activityType } = route.params;
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndRankSpots = async () => {
      const allSpots = await getSpots();
      
      // Compute a fake match score based on filters
      const rankedSpots = allSpots.map(spot => {
        let score = 100;
        if (filters.ac && !spot.hasAC) score -= 25;
        if (filters.charging && spot.availableOutlets === 0) score -= 25;
        if (filters.quiet && spot.noiseLevel > 45) score -= 25;
        if (filters.lowCrowd && (spot.totalSeats > 0 && spot.availableSeats / spot.totalSeats < 0.3)) score -= 25;
        if (filters.fastWifi && spot.wifiSpeed < 50) score -= 25;
        
        // Boost if bestFor matches
        if (spot.bestFor.includes(activityType as any)) score += 10;
        
        score = Math.max(0, Math.min(100, score));
        return { ...spot, matchPercentage: score };
      });
      
      rankedSpots.sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      setSpots(rankedSpots);
      setIsLoading(false);
    };
    
    fetchAndRankSpots();
  }, [filters, activityType]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentBlue} />
      </SafeAreaView>
    );
  }

  const activeFilters = Object.entries(filters)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => {
      switch (key) {
        case 'quiet': return 'Quiet';
        case 'charging': return 'Power';
        case 'fastWifi': return 'Fast Wi-Fi';
        case 'ac': return 'A/C';
        case 'lowCrowd': return 'Low Crowd';
        default: return key;
      }
    });

  const topSpot = spots[0];
  const otherSpots = spots.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <View style={styles.activityBadge}>
            <Text style={styles.activityBadgeText}>{activityType}</Text>
          </View>
          <View style={styles.pillsRow}>
            {activeFilters.map(f => (
              <View key={f} style={styles.pill}>
                <Text style={styles.pillText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {topSpot && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>#1 Best Match</Text>
            <HeroSpotCard 
              spot={topSpot} 
              onPress={() => navigation.navigate('SpotDetails', { spotId: topSpot.id })}
            />
          </View>
        )}

        {otherSpots.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ranked Alternatives</Text>
            <View style={styles.list}>
              {otherSpots.map(spot => (
                <SpotListCard 
                  key={spot.id} 
                  spot={spot} 
                  onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })}
                />
              ))}
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgCanvas,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  activityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  activityBadgeText: {
    color: COLORS.accentBlue,
    fontWeight: '800',
    fontSize: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  pillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  }
});
