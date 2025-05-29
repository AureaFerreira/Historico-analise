import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'azul'].tint,
        headerShown: false,
        tabBarStyle: { display: (route.name === 'paciente' || route.name === 'psicologo') ? 'none' : 'flex' },  // Hide tab bar for 'paciente' and 'psicologo' screens
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:'Login',
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={'#477BDE'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="paciente"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="psicologo"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
