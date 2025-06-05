import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IniciarSessao() {
  const router = useRouter();

  const handleIniciarConsulta = () => {
    // Navega para a rota videocal (pode passar parâmetros via query string se quiser)
    router.push('/psicologo/videocall');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Seu conteúdo e botão */}
      <TouchableOpacity
        onPress={handleIniciarConsulta}
        style={{
          flexDirection: 'row',
          backgroundColor: '#2563eb',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Ionicons name="videocam" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
          Iniciar Consulta
        </Text>
      </TouchableOpacity>
    </View>
  );
}
