import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import type { Spot } from '../types';
import Ring from './Ring';

interface SpotListCardProps {
  spot: Spot;
  onPress: () => void;
  saved?: boolean;
  onSave?: () => void;
  rank?: number;
}

export default function SpotListCard({ spot, onPress, saved, onSave, rank }: SpotListCardProps) {
  const imgUri = spot.photo || 'https://screen-etcher-plus.lovable.app/assets/library-zdzWV6HN.jpg';
  const isOpen = true; // Replace with real open status if we add it

  const timeColor = COLORS.statusOptimal; // Can replace with actual freshColor logic if needed

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={styles.card}>
      <View>
        <Image source={{ uri: imgUri }} style={styles.photo} />
        <View style={[styles.badge, { backgroundColor: isOpen ? '#fff' : '#222' }]}>
          <Text style={{ color: isOpen ? COLORS.statusOptimal : '#fff', fontSize: 12, fontWeight: '700' }}>
            {isOpen ? '● Open now' : 'Closed'}
          </Text>
        </View>
        {rank !== undefined && (
          <View style={styles.rankBadge}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>#{rank}</Text>
          </View>
        )}
        <TouchableOpacity onPress={onSave} style={styles.heart}>
          <Text style={{ fontSize: 18, color: saved ? COLORS.statusDeadzone : COLORS.textPrimary }}>
            {saved ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.name}>{spot.name}</Text>
            <Text style={styles.sub}>{spot.buildingName} · Floor {spot.floorNumber}</Text>
            <Text style={[styles.sub, { marginTop: 6, color: COLORS.textPrimary, fontWeight: '600' }]}>
              {spot.matchPercentage > 0 ? `Matches your preferences (${spot.matchPercentage}%)` : 'Set preferences to see your match'}
            </Text>
          </View>
          <Ring pct={spot.matchPercentage} total={spot.matchPercentage > 0 ? 1 : 0} />
        </View>
        
        <View style={[styles.row2, { marginTop: 10 }]}>
          {[`${spot.wifiSpeed} Mbps`, spot.noiseLabel, spot.crowdLabel + ' crowd', `${spot.availableOutlets} plugs`, spot.hasAC ? 'AC' : 'No AC'].map(t => (
            <Text key={t} style={styles.stat}>{t}</Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: timeColor, marginRight: 6 }} />
          <Text style={[styles.sub, { fontSize: 12 }]}>{spot.availableSeats} seats free · {spot.lastUpdated}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: COLORS.bgSurface, 
    borderRadius: 22, 
    marginBottom: 16, 
    overflow: 'hidden', 
    ...SHADOWS.md 
  },
  photo: { height: 170, width: '100%' },
  badge: { position: 'absolute', left: 12, top: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  rankBadge: { position: 'absolute', left: 12, bottom: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(20,18,31,0.75)' },
  heart: { position: 'absolute', right: 12, top: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  tag: { fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  stat: { fontSize: 12, color: COLORS.textSecondary, backgroundColor: COLORS.bgCanvas, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden', margin: 2 },
  sub: { color: COLORS.textSecondary, fontSize: 13 },
  row2: { flexDirection: 'row', flexWrap: 'wrap' },
});
