import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import type { Spot } from '../types';
import Ring from './Ring';

interface HeroSpotCardProps {
  spot: Spot;
  onPress: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}

export default function HeroSpotCard({ spot, onPress, saved, onToggleSave }: HeroSpotCardProps) {
  // Using a fallback image if no photo is provided
  const imgUri = spot.photo || 'https://screen-etcher-plus.lovable.app/assets/library-zdzWV6HN.jpg';

  return (
    <TouchableOpacity style={styles.hero} onPress={onPress} activeOpacity={0.92}>
      <Image source={{ uri: imgUri }} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,8,25,0.5)' }]} />
      <View style={{ flex: 1, justifyContent: 'space-between', padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.heroPill}>⭐ TOP PICK FOR YOU</Text>
          <TouchableOpacity onPress={onToggleSave} style={styles.heartSm}>
            <Text style={{ color: saved ? COLORS.statusDeadzone : COLORS.textPrimary }}>
              {saved ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{spot.name}</Text>
            <Text style={{ color: '#E8E6F5', marginTop: 2 }}>{spot.buildingName} · Floor {spot.floorNumber}</Text>
            <Text style={{ color: '#E8E6F5', fontSize: 12, marginTop: 6 }}>
              {spot.availableSeats} seats free · {spot.lastUpdated}
            </Text>
          </View>
          <Ring pct={spot.matchPercentage} total={spot.matchPercentage > 0 ? 1 : 0} size={66} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hero: { 
    height: 210, 
    borderRadius: 26, 
    marginHorizontal: 16, 
    overflow: 'hidden', 
    backgroundColor: '#222', 
    marginBottom: 24,
    ...SHADOWS.md 
  },
  heroPill: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 0.8, 
    backgroundColor: 'rgba(255,255,255,0.22)', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 999, 
    overflow: 'hidden' 
  },
  heartSm: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
});
