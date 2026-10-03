import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import type { FilterKey } from '../types';

interface FilterChipRailProps {
  filters: Record<FilterKey, boolean>;
  onToggleFilter: (key: FilterKey) => void;
}

const FILTER_CONFIG: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'fastWifi', label: 'Fast Wi-Fi', icon: '🚀' },
  { key: 'quiet', label: 'Quiet', icon: '🤫' },
  { key: 'charging', label: 'Power', icon: '🔌' },
  { key: 'ac', label: 'A/C', icon: '❄️' },
  { key: 'lowCrowd', label: 'Low Crowd', icon: '🛋️' },
];

export default function FilterChipRail({ filters, onToggleFilter }: FilterChipRailProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {FILTER_CONFIG.map(({ key, label, icon }) => {
        const isActive = filters[key];
        return (
          <TouchableOpacity
            key={key}
            style={[styles.chip, isActive && styles.activeChip]}
            onPress={() => {
              Haptics.selectionAsync();
              onToggleFilter(key);
            }}
          >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  activeChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Light blue tint
    borderColor: COLORS.accentBlue,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: COLORS.accentBlue,
  },
});
