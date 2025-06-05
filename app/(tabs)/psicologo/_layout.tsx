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
      {/* Abas visíveis na barra de navegação inferior */}
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
        name="pacientes/index" // Caminho relativo à pasta `psicologo`
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

      {/* Telas que NÃO são abas, mas que o expo-router precisa conhecer
          para navegar para elas dentro desta estrutura de abas.
          Elas são definidas com href: null para não aparecerem na TabBar. */}

      {/* Rotas de detalhes de paciente */}
      <Tabs.Screen
        name="pacientes/[id]/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="pacientes/cadastrarSessao"
        options={{ href: null }}
      />

      {/* Rotas de anotações */}
      <Tabs.Screen
        name="anotacoes/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="anotacoes/[id]/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="anotacoes/[id]/fichaDeAvaliacao"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="anotacoes/[id]/detalhesFicha"
        options={{ href: null }}
      />

      {/* Rotas de sessão e meet */}
      <Tabs.Screen
        name="[sessao]/index" // Corresponde a /psicologo/{id_sessao}
        options={{ href: null }}
      />
      <Tabs.Screen
        name="[sessao]/chat" // Corresponde a /psicologo/{id_sessao}/chat
        options={{ href: null }}
      />
      <Tabs.Screen
        name="[sessao]/meetPsicologo" // Corresponde a /psicologo/{id_sessao}/meetPsicologo
        options={{ href: null }}
      />
      {/* Rotas diversas */}
      <Tabs.Screen
        name="notificacaoPsicologo"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="evolucao-casos"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="declaracoes"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="personalizarAnamnese"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="preencher-declaracao"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="ProntuarioPaciente"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="prontuarios"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="RoleSelect"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="VisualizarAnamnese"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="analiseEmocional"
        options={{ href: null }}
      />

      {/* AS ROTAS QUE VOCÊ QUER NAVEGAR DIRETAMENTE E JÁ EXISTEM COMO ARQUIVOS:
          teleconsulta.js e VideoCall.js.
          Se elas não são abas, elas devem ser definidas com href: null.
          É CRUCIAL que o nome aqui seja o nome do arquivo. */}
      <Tabs.Screen
        name="teleconsulta" // Nome do arquivo teleconsulta.js
        options={{ href: null }}
      />
      <Tabs.Screen
        name="VideoCall" // Nome do arquivo VideoCall.js
        options={{ href: null }}
      />

      {/* Se iniciar-sessao.js também não é uma aba visível: */}
      <Tabs.Screen
        name="iniciar-sessao"
        options={{ href: null }}
      />

    </Tabs>
  );
}