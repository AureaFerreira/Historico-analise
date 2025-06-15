import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
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

import logoOnTerapia from '@/assets/images/logoOnTerapia.png';

const screenWidth = Dimensions.get('window').width;

export default function Teleconsulta() {
  const router = useRouter();
  const role = 'Paciente'; // OU 'Psicólogo'

  // === Dados de data/hora ===
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  const displayDate = `${day}/${month}/${year}`;
  const displayTime = `${hour}:${min}`;

  // === Nome da sala (sem acentos/esp. em branco) ===
  const sessionName = `Sessao-${day}${month}${String(year).slice(-2)}_${hour}${min}`;
  const roomName = sessionName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\-_\.]/g, '-')
    .toLowerCase();

  const teleconsultaLink = `https://meet.jit.si/${roomName}`;

  // -------------------------------------------------
  // FUNÇÃO CORRIGIDA PARA ABRIR WHATSAPP
  // -------------------------------------------------
  const shareLinkViaWhatsApp = () => {
    const message = `Olá! Sua sessão de teleconsulta OnTerapia está agendada.\nEntre no link: ${teleconsultaLink}`;
    const encoded = encodeURIComponent(message);

    // 1) Tenta abrir direto no app
    const whatsappScheme = `whatsapp://send?text=${encoded}`;

    Linking.canOpenURL(whatsappScheme)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappScheme);
        }

        // 2) Fallback – via navegador (redireciona para app na maioria dos casos)
        const whatsappWeb = `https://api.whatsapp.com/send?text=${encoded}`;
        return Linking.openURL(whatsappWeb);
      })
      .catch((err) => {
        console.error('Erro ao abrir WhatsApp', err);
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
      });
  };

  // -------------------------------------------------
  // Enviar sessão (link + data) para AsyncStorage
  // -------------------------------------------------
  const sendSessionToPatient = async () => {
    const sessionData = {
      psychologistName: 'Seu Nome (Psicólogo)',
      date: displayDate,
      time: displayTime,
      teleconsultaLink,
      roomName,
    };

    try {
      await AsyncStorage.setItem('patientNextSession', JSON.stringify(sessionData));
      Alert.alert('Sucesso', 'Sessão enviada para o paciente!');
    } catch (e) {
      console.error('Erro ao salvar sessão para paciente:', e);
      Alert.alert('Erro', 'Não foi possível enviar a sessão.');
    }
  };

  return (
    <View style={styles.container}>
      {/* ====== CAPA COM GRADIENTE E LOGO ====== */}
      <LinearGradient colors={['#F37187', '#FF7F9F']} style={styles.capa}>
        <Image source={logoOnTerapia} style={styles.logo} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sessão</Text>
          {/* Espaço para alinhar */}
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

      {/* ====== CONTEÚDO PRINCIPAL ====== */}
      <View style={styles.contentArea}>
        <Text style={styles.greetingHeader}>{`Olá, ${role}!`}</Text>

        {role === 'Paciente' && (
          <Text style={styles.sessionInfo}>
            {`Sessão ${displayDate} às ${displayTime}`}
          </Text>
        )}

        {/* CARD COM LINK DA SESSÃO */}
        <View style={styles.cardSessao}>
          <Text style={styles.textoCardSessao}>Link da Sessão</Text>
          <View style={styles.linkContainer}>
            <Text
              style={styles.linkTextContent}
              selectable
              onPress={() => Linking.openURL(teleconsultaLink)}
            >
              {teleconsultaLink}
            </Text>
          </View>
        </View>

        {/* BOTÕES */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.botaoWhatsApp}
            onPress={shareLinkViaWhatsApp}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={styles.textoBotao}>Enviar Link</Text>
          </TouchableOpacity>

          <Link
            href={`/psicologo/VideoCall?roomName=${roomName}&role=${role}`}
            asChild
          >
            <TouchableOpacity style={styles.botaoIniciarConsulta} activeOpacity={0.85}>
              <Ionicons name="videocam" size={20} color="white" />
              <Text style={styles.textoBotao}>Iniciar Consulta</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {role === 'Psicólogo' && (
          <TouchableOpacity
            style={styles.botaoEnviar}
            onPress={sendSessionToPatient}
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
    width: '100%',
    height: 190,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
    paddingTop: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { width: 30, height: 30, marginBottom: 12 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: { width: 40, alignItems: 'center' },

  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
    textAlign: 'center',
    flex: 1,
  },

  contentArea: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },

  greetingHeader: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1B1B1F',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  sessionInfo: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 30,
    color: '#F37187',
    fontFamily: 'Poppins-Regular',
  },

  cardSessao: {
    backgroundColor: '#F37187',
    padding: 20,
    borderRadius: 17,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textoCardSessao: {
    fontFamily: 'Poppins-Light',
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  linkContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTextContent: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botaoWhatsApp: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
    elevation: 3,
  },
  botaoIniciarConsulta: {
    backgroundColor: '#FFB3C7',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    elevation: 3,
  },
  botaoEnviar: {
    backgroundColor: '#F37187',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginTop: 10,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
});
