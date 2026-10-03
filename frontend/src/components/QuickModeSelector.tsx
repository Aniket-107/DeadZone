import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import type { QuickMode } from '../types';

interface QuickModeSelectorProps {
  selectedMode: QuickMode | null;
  onSelectMode: (mode: QuickMode | null) => void;
}

const MODES: { id: QuickMode; icon: string; label: string }[] = [
  { id: 'Study', icon: '📚', label: 'Study' },
  { id: 'Call', icon: '📞', label: 'Call' },
  { id: 'Gaming', icon: '🎮', label: 'Gaming' },
  { id: 'Chill', icon: '☕', label: 'Chill' },
];

export default function QuickModeSelector({ selectedMode, onSelectMode }: QuickModeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Modes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {MODES.map((mode) => {
          const isActive = selectedMode === mode.id;
          return (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, isActive && styles.activeModeCard]}
              onPress={() => {
                Haptics.selectionAsync();
                onSelectMode(isActive ? null : mode.id);
              }}
            >
              <Text style={styles.icon}>{mode.icon}</Text>
              <Text style={[styles.label, isActive && styles.activeLabel]}>{mode.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  modeCard: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  activeModeCard: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: COLORS.accentCyan,
  },
  icon: {
    fontSize: 24,
    marginBottom: 6,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeLabel: {
    color: COLORS.accentCyan,
  },
});
