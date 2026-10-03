import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/theme';

type NoiseLevel = 'Very Quiet' | 'Quiet' | 'Moderate' | 'Loud';
type CrowdLevel = 'Low' | 'Medium' | 'High';

interface ReportStatusModalProps {
  visible: boolean;
  spotName: string;
  onClose: () => void;
  onSubmit: (noiseLevel: NoiseLevel, crowdLevel: CrowdLevel, wifiRating: number) => void;
}

const NOISE_OPTIONS: NoiseLevel[] = ['Very Quiet', 'Quiet', 'Moderate', 'Loud'];
const CROWD_OPTIONS: CrowdLevel[] = ['Low', 'Medium', 'High'];

export default function ReportStatusModal({ visible, spotName, onClose, onSubmit }: ReportStatusModalProps) {
  const [noise, setNoise] = useState<NoiseLevel>('Quiet');
  const [crowd, setCrowd] = useState<CrowdLevel>('Medium');
  const [wifi, setWifi] = useState<number>(4);

  const handleSubmit = () => {
    onSubmit(noise, crowd, wifi);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Report Live Status</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Update conditions for {spotName}</Text>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Noise Level */}
            <Text style={styles.sectionTitle}>Current Noise</Text>
            <View style={styles.optionsRow}>
              {NOISE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pill, noise === opt && styles.pillActive]}
                  onPress={() => setNoise(opt)}
                >
                  <Text style={[styles.pillText, noise === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Crowd Level */}
            <Text style={styles.sectionTitle}>Crowd Level</Text>
            <View style={styles.optionsRow}>
              {CROWD_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pill, crowd === opt && styles.pillActive]}
                  onPress={() => setCrowd(opt)}
                >
                  <Text style={[styles.pillText, crowd === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Wi-Fi Rating */}
            <Text style={styles.sectionTitle}>Wi-Fi Signal Quality</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity key={rating} onPress={() => setWifi(rating)}>
                  <Text style={[styles.star, wifi >= rating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <SafeAreaView>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Live Report</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  content: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  pillActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    borderColor: COLORS.accentCyan,
  },
  pillText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextActive: {
    color: COLORS.accentCyan,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  star: {
    fontSize: 36,
    color: COLORS.borderSubtle,
  },
  starActive: {
    color: COLORS.statusModerate,
  },
  submitBtn: {
    backgroundColor: COLORS.accentBlue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
