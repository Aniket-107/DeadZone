import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, getWifiColor, getNoiseColor, getStatusColor } from '../utils/theme';
import type { Floor } from '../types';

interface FloorRowCardProps {
  floor: Floor;
  onPress: () => void;
}

export default function FloorRowCard({ floor, onPress }: FloorRowCardProps) {
  const statusColor = getStatusColor(floor.status);
  const statusText = floor.status === 'good' ? 'Quiet' : floor.status === 'moderate' ? 'Moderate' : 'Busy';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftCol}>
        <View style={styles.floorBadge}>
          <Text style={styles.floorBadgeText}>FL {floor.floorNumber}</Text>
        </View>
        <View>
          <Text style={styles.floorLabel}>{floor.label}</Text>
          <Text style={styles.spotsCount}>{floor.availableSpotsCount} optimal spots open</Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <View style={styles.telemetryRow}>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>📶</Text>
            <Text style={[styles.pillValue, { color: getWifiColor(floor.avgWifiMbps) }]}>
              {floor.avgWifiMbps}
            </Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>🔊</Text>
            <Text style={[styles.pillValue, { color: getNoiseColor(floor.avgNoiseDb) }]}>
              {floor.avgNoiseDb}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgSurface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  floorBadge: {
    backgroundColor: COLORS.bgElevated,
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  floorBadgeText: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 12,
  },
  floorLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  spotsCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  telemetryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  pillValue: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 20,
    fontWeight: '300',
  }
});
