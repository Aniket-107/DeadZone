import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../utils/theme';
import type { RootStackParamList } from './types';

import TabNavigator from './TabNavigator';
import BuildingScreen from '../screens/BuildingScreen';
import FloorScreen from '../screens/FloorScreen';
import SpotDetailsScreen from '../screens/SpotDetailsScreen';
import MatchResultsScreen from '../screens/MatchResultsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bgCanvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs"     component={TabNavigator} />
      <Stack.Screen
        name="Building"
        component={BuildingScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.bgSurface },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          headerTitle: 'Building',
        }}
      />
      <Stack.Screen
        name="Floor"
        component={FloorScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.bgSurface },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          headerTitle: 'Floor',
        }}
      />
      <Stack.Screen
        name="SpotDetails"
        component={SpotDetailsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.bgSurface },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          headerTitle: 'Spot Details',
        }}
      />
      <Stack.Screen
        name="MatchResults"
        component={MatchResultsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.bgSurface },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          headerTitle: 'Best Matches',
        }}
      />
    </Stack.Navigator>
  );
}
