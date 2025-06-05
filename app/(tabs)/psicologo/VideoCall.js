import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import logoOnTerapia from '@/assets/images/logoOnTerapia.png';

export default function VideoCall() {
  const router = useRouter();
  const { roomName, role } = useLocalSearchParams();
  const webviewRef = useRef(null);

  const [checking, setChecking] = useState(true);
  const [granted, setGranted] = useState(false);
  const [acceptedTerms, setAccepted] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        try {
          const res = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
          const cameraGranted = res[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
          const audioGranted = res[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';

          if (!cameraGranted || !audioGranted) {
            Alert.alert(
              'Permissões Necessárias',
              'Para a teleconsulta, precisamos acessar sua câmera e microfone.',
              [
                { text: 'Cancelar', onPress: () => router.back(), style: 'cancel' },
                { text: 'Configurações', onPress: () => Linking.openSettings() },
              ],
              { cancelable: false }
            );
            setGranted(false);
          } else {
            setGranted(true);
          }
        } catch (err) {
          console.error("Erro ao solicitar permissões:", err);
          setGranted(false);
        }
      } else {
        setGranted(true);
      }
      setChecking(false);
    })();
  }, []);

  const onPermissionRequest = useCallback(event => {
    const { resources, grant, deny } = event.nativeEvent;
    const needsCamera = resources.includes('CAMERA') || resources.includes('VIDEO_CAPTURE');
    const needsMicrophone = resources.includes('MICROPHONE') || resources.includes('AUDIO_CAPTURE');

    if ((needsCamera || needsMicrophone) && granted) {
      grant();
    } else {
      deny();
    }
  }, [granted]);

  const Loader = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#F37187" />
      <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
    </View>
  );

  const TermsScreen = ({ onAccept, onDecline }) => (
    <View style={styles.container}>
      <View style={styles.capa}>
        <Image source={logoOnTerapia} style={styles.logo} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onDecline} style={styles.backButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Termos da Sessão</Text>
          <View style={styles.backButton} />
        </View>
      </View>

      <ScrollView style={styles.checklistContainer}>
        <Text style={styles.checklistTitle}>
          Termos e Condições da Teleconsulta
        </Text>

        {[
          'Esta sessão será gravada para fins de segurança e qualidade',
          'As gravações são confidenciais e de acesso restrito',
          'Você pode solicitar a exclusão da gravação a qualquer momento',
          'Garantimos a confidencialidade conforme a LGPD',
        ].map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <Text style={styles.checklistText}>• {item}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.botaoRecusar} onPress={onDecline}>
          <Text style={[styles.textoBotao, { color: '#333' }]}>Recusar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoAceitar} onPress={onAccept}>
          <Text style={styles.textoBotao}>Aceitar e Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (checking) return <Loader />;
  if (!granted) return <Loader />;
  if (!acceptedTerms) {
    return (
      <TermsScreen
        onAccept={() => setAccepted(true)}
        onDecline={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: `https://meet.jit.si/${roomName}` }}
        style={styles.webview}
        onPermissionRequest={onPermissionRequest}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        renderLoading={() => <Loader />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  capa: {
    width: "100%",
    height: 190,
    backgroundColor: "#F37187",
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
    paddingTop: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    flex: 1,
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  checklistTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
    color: '#333',
  },
  checklistItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checklistText: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: '#555',
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  botaoAceitar: {
    backgroundColor: '#F37187',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  botaoRecusar: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 12,
    flex: 0.6,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
