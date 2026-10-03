import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

interface RingProps {
  pct: number;
  total?: number;
  size?: number;
}

export default function Ring({ pct, total = 1, size = 60 }: RingProps) {
  const v = useRef(new Animated.Value(0.7)).current;
  
  useEffect(() => { 
    v.setValue(0.7); 
    Animated.spring(v, { toValue: 1, friction: 5, useNativeDriver: true }).start(); 
  }, [pct]);
  
  const pctColor = (p: number) => (p >= 75 ? COLORS.statusOptimal : p >= 40 ? COLORS.statusModerate : COLORS.statusDeadzone);
  const c = total ? pctColor(pct) : COLORS.textMuted;
  
  return (
    <Animated.View style={[
      styles.ring, 
      { 
        width: size, height: size, borderRadius: size / 2, 
        borderColor: c, 
        transform: [{ scale: v }] 
      }
    ]}>
      <Text style={[styles.text, { color: c, fontSize: size / 4 }]}>
        {total ? pct + '%' : '—'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontWeight: '800',
  }
});
