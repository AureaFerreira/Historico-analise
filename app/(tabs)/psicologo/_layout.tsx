import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff', // Cor de fundo branca
          borderTopWidth: 0, // Opcional: remove a borda superior
          elevation: 5, // Opcional: adiciona sombra no Android
          shadowColor: '#000', // Sombra iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Light'
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="pacientes/index"
        options={{
          title: 'Pacientes',


          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',


          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"

        options={{
          title: 'Chat',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="perfilPsicologo"

        options={{
          title: 'Perfil',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="pacientes/[id]/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pacientes/cadastrarSessao"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="anotacoes/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="[sessao]/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="[sessao]/chat"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="[sessao]/meetPsicologo"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="anotacoes/[id]/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="anotacoes/[id]/fichaDeAvaliacao"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="anotacoes/[id]/detalhesFicha"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notificacaoPsicologo"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
