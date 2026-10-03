import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, getStatusColor } from '../utils/theme';
import type { Building } from '../types';

interface CampusRadarMapProps {
  buildings: Building[];
  onBuildingPress: (building: Building) => void;
}

export default function CampusRadarMap({ buildings, onBuildingPress }: CampusRadarMapProps) {
  return (
    <View style={styles.container}>
      {/* Radar Background Rings */}
      <View style={[styles.ring, styles.ring1]} />
      <View style={[styles.ring, styles.ring2]} />
      <View style={[styles.ring, styles.ring3]} />
      
      {/* Live Badge */}
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE CAMPUS RADAR</Text>
      </View>

      {/* Building Pins */}
      {buildings.map(building => {
        const statusColor = getStatusColor(building.overallStatus);
        return (
          <TouchableOpacity
            key={building.id}
            style={[
              styles.pinContainer,
              { left: `${building.coordinates.x}%`, top: `${building.coordinates.y}%` }
            ]}
            onPress={() => onBuildingPress(building)}
          >
            <View style={[styles.pinDot, { backgroundColor: statusColor, shadowColor: statusColor }]} />
            <View style={styles.pinLabel}>
              <Text style={styles.pinLabelText}>{building.code} · {building.optimalSpotsCount}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.statusOptimal }]} />
          <Text style={styles.legendText}>Optimal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.statusModerate }]} />
          <Text style={styles.legendText}>Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.statusDeadzone }]} />
          <Text style={styles.legendText}>Busy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(30, 38, 56, 0.5)',
    borderRadius: 9999,
  },
  ring1: {
    width: 100, height: 100,
    top: '50%', left: '50%',
    marginTop: -50, marginLeft: -50,
  },
  ring2: {
    width: 200, height: 200,
    top: '50%', left: '50%',
    marginTop: -100, marginLeft: -100,
  },
  ring3: {
    width: 300, height: 300,
    top: '50%', left: '50%',
    marginTop: -150, marginLeft: -150,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.statusOptimal,
    marginRight: 6,
  },
  liveText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -30 }, { translateY: -15 }], // Center the pin
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.bgSurface,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  pinLabel: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  pinLabelText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  legendDot: {
    width: 6, height: 6, borderRadius: 3, marginRight: 6,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  }
});
