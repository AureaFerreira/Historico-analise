import React, { useState } from 'react';

import { Portal, Text, Button } from 'react-native-paper';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Clipboard, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';

const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'da86d0fc511fb6faa8de1ab3845d010c'; // Use a chave fornecida

const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default function ModalPagamento({ visible, onClose, chavePix, valor }) {
  const [image, setImage] = useState(null);

  const copiarChavePix = () => {
    Clipboard.setString(chavePix);
    Alert.alert('Código copiado para a área de transferência');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissões de acesso à biblioteca de mídia para fazer isso funcionar!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);


    const copiarChavePix = () => {
      Clipboard.setString(chavePix);
      console.log('Chave PIX copiada:', chavePix); // Verificar se esta mensagem aparece no console
      Alert.alert('Código copiado', 'O código PIX foi copiado para a área de transferência.');
    };

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await uploadImage(uri);
    } else {
      console.log('Imagem não selecionada ou operação cancelada');
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!uri) {
        throw new Error('URI da imagem é indefinida');
      }

      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = uri.split('/').pop();

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Erro ao enviar a imagem:', error);
      } else {
        console.log('Imagem enviada com sucesso:', data);
      }
    } catch (error) {
      console.error('Erro ao processar a imagem:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      animationType="slide"
      transparent={true}
      contentContainerStyle={styles.modalContentContainer}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center' }}>
              <Text style={styles.titulo}>Copie ou escaneie o QR CODE</Text>
              <Ionicons name="close-outline" color={'black'} size={20} onPress={onClose}></Ionicons>
            </View>

            <Text style={styles.subtitulo}>
              Ao copiar seu código, abra o seu aplicativo bancário e realize seu pagamento de forma rápida
            </Text>
            <View style={{ backgroundColor: '#89CC24', padding: 5, borderRadius: 7, flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins-Light', marginHorizontal: 2, color: 'white' }}>
                Valor Total:
              </Text>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: 'white' }}>
                R$ {valor.toFixed(2)}
              </Text>
            </View>

            <Image
              source={{ uri: 'https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png' }}
              style={styles.qrCode}
            />
            <Button style={styles.button} labelStyle={{ fontFamily: 'Poppins-Light' }} onPress={copiarChavePix} textColor="#fff">
              COPIAR CHAVE PIX
            </Button>
            <Button style={styles.button} labelStyle={{ fontFamily: 'Poppins-Light' }} onPress={pickImage} textColor="#fff">
              ANEXAR COMPROVANTE
            </Button>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.fechar}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Light',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: 'gray',
    fontFamily: 'Poppins-Light',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#477BDE',
    borderRadius: 12,
  },
  fechar: {
    marginTop: 13,
    color: '#477BDE',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 300,
  },
  titulo: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Light',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: 'gray',
    fontFamily: 'Poppins-Light',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignItems: 'center'
  },
  button: {
    marginTop: 10,
    backgroundColor: '#477BDE',
    borderRadius: 12,
  },
  fechar: {
    marginTop: 13,
    color: '#477BDE',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalContentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },

});
