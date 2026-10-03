import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../utils/theme';
import type { TabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import FindMySpotScreen from '../screens/FindMySpotScreen';
import SavedSpotsScreen from '../screens/SavedSpotsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_CONFIG: Record<
  keyof TabParamList,
  { icon: string; label: string }
> = {
  Home:    { icon: '⚡', label: 'Home' },
  Explore: { icon: '🗺️', label: 'Explore' },
  Find:    { icon: '🧭', label: 'Find' },
  Saved:   { icon: '🔖', label: 'Saved' },
  Profile: { icon: '👤', label: 'Profile' },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgSurface,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderSubtle,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.accentCyan,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabel: ({ color }) => (
          <Text style={{ fontSize: 10, color, fontWeight: '600', marginBottom: 2 }}>
            {TAB_CONFIG[route.name].label}
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>{TAB_CONFIG[route.name].icon}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Find"    component={FindMySpotScreen} />
      <Tab.Screen name="Saved"   component={SavedSpotsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
