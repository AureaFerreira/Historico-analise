import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import {
  Alert,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useAppContext } from '@/components/provider';
import React, { useEffect, useState } from 'react';
import logoOnTerapia from '@/assets/images/logoOnTerapia.png';

const screenWidth = Dimensions.get('window').width;

export default function Teleconsulta() {
  const router = useRouter();
  const { buscaUsuarioId, usuarioAtual } = useAppContext();
  const params = useLocalSearchParams();
  const { psychologistName, psychologistId } = params;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await buscaUsuarioId(usuarioAtual.id);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, [buscaUsuarioId, usuarioAtual.id]);

  const nomePsicologo =
    user?.tipo === 'psicologo' ? user.data.nome : psychologistName || 'Psicólogo';
  const nomePaciente =
    user?.tipo === 'paciente' ? user.data.nome : 'Paciente';

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  const dataExibicao = `${day}/${month}/${year}`;
  const horaExibicao = `${hour}:${min}`;

  const nomeSala = `sessao-${psychologistId || 'sem-id'}-${day}${month}${String(
    year
  ).slice(-2)}_${hour}${min}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9\-_\.]/g, '-')
    .toLowerCase();

  const linkTeleconsulta = `https://meet.jit.si/${nomeSala}?psicologoId=${psychologistId || ''}`;

  const compartilharLinkWhatsApp = () => {
    const mensagem = `Olá! Sua sessão de teleconsulta OnTerapia com ${nomePsicologo} está agendada.\nAcesse o link: ${linkTeleconsulta}`;
    const encoded = encodeURIComponent(mensagem);
    const whatsappScheme = `whatsapp://send?text=${encoded}`;

    Linking.canOpenURL(whatsappScheme)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappScheme);
        }
        const whatsappWeb = `https://api.whatsapp.com/send?text=${encoded}`;
        return Linking.openURL(whatsappWeb);
      })
      .catch((err) => {
        console.error('Erro ao abrir WhatsApp', err);
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
      });
  };

  const enviarSessaoParaPaciente = async () => {
    const dadosSessao = {
      nomePsicologo,
      idPsicologo: psychologistId || null,
      data: dataExibicao,
      hora: horaExibicao,
      link: linkTeleconsulta,
      sala: nomeSala,
    };
    try {
      await AsyncStorage.setItem('proximaSessaoPaciente', JSON.stringify(dadosSessao));
      Alert.alert('Sucesso', 'Sessão enviada para o paciente!');
    } catch (e) {
      console.error('Erro ao salvar sessão:', e);
      Alert.alert('Erro', 'Não foi possível enviar a sessão.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F37187', '#FF7F9F']} style={styles.capa}>
        <Image source={logoOnTerapia} style={styles.logo} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sessão</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

      <View style={styles.contentArea}>
        <Text style={styles.greetingHeader}>
          {user?.tipo === 'psicologo' ? `Olá, ${nomePsicologo}!` : `Olá, ${nomePaciente}!`}
        </Text>

        <Text style={styles.sessionInfo}>Sessão em {dataExibicao} às {horaExibicao}</Text>
        <Text style={styles.psicologoInfo}>Psicólogo: {nomePsicologo}</Text>

        <View style={styles.cardSessao}>
          <Text style={styles.textoCardSessao}>Link da Sessão</Text>
          <View style={styles.linkContainer}>
            <Text
              style={styles.linkTextContent}
              selectable
              onPress={() => Linking.openURL(linkTeleconsulta)}
            >
              {linkTeleconsulta}
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.botaoWhatsApp}
            onPress={compartilharLinkWhatsApp}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={styles.textoBotao}>Enviar Link</Text>
          </TouchableOpacity>

          <Link
            href={{
              pathname: `/psicologo/VideoCall`,
              params: {
                roomName: nomeSala,
                role: user?.tipo,
                psychologistId: psychologistId || '',
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.botaoIniciarConsulta} activeOpacity={0.85}>
              <Ionicons name="videocam" size={20} color="white" />
              <Text style={styles.textoBotao}>Iniciar Consulta</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {user?.tipo === 'psicologo' && (
          <TouchableOpacity
            style={styles.botaoEnviar}
            onPress={enviarSessaoParaPaciente}
            activeOpacity={0.85}
          >
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.textoBotao}>Enviar para Paciente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  capa: {
    width: '100%', height: 190, borderBottomLeftRadius: 27, borderBottomRightRadius: 27,
    paddingTop: 40, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center',
  },
  logo: { width: 30, height: 30, marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  backButton: { width: 40, alignItems: 'center' },
  headerTitle: {
    fontSize: 23, fontWeight: '700', color: 'white', fontFamily: 'Poppins-Bold',
    letterSpacing: 1, textAlign: 'center', flex: 1,
  },
  contentArea: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  greetingHeader: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: '#1B1B1F', marginBottom: 10, fontFamily: 'Poppins-Bold' },
  sessionInfo: { fontSize: 17, textAlign: 'center', marginBottom: 10, color: '#F37187', fontFamily: 'Poppins-Regular' },
  psicologoInfo: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#1B1B1F', fontFamily: 'Poppins-Medium' },
  cardSessao: {
    backgroundColor: '#F37187', padding: 20, borderRadius: 17, marginBottom: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
  },
  textoCardSessao: { fontFamily: 'Poppins-Light', color: 'white', fontSize: 16, marginBottom: 10 },
  linkContainer: { backgroundColor: 'white', borderRadius: 12, padding: 15, alignItems: 'center', justifyContent: 'center' },
  linkTextContent: { fontSize: 14, color: '#555', fontFamily: 'Poppins-Regular', textAlign: 'center' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  botaoWhatsApp: {
    backgroundColor: '#25D366', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', flex: 1, marginRight: 10, elevation: 3,
  },
  botaoIniciarConsulta: {
    backgroundColor: '#FFB3C7', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', flex: 1, marginLeft: 10, elevation: 3,
  },
  botaoEnviar: {
    backgroundColor: '#F37187', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', elevation: 3, marginTop: 10,
  },
  textoBotao: { color: 'white', fontSize: 16, fontFamily: 'Poppins-Medium', marginLeft: 10 },
});
