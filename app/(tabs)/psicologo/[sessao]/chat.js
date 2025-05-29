import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, InputToolbar, Send, Composer } from 'react-native-gifted-chat';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../../utils/supabase';
import { useAppContext } from '@/components/provider';
import { processFontFamily } from 'expo-font';
import Header from '@/components/geral/header';

export default function Chat() {
  const { usuarioAtual } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('Mensagens')
      .select('*')
      .order('createdAt', { ascending: false });

    if (!error) {
      const formattedMessages = data.map(formatMessage);
      setMessages(formattedMessages);
      setLoading(false);
    } else {
      console.error(error);
    }
  }, []);

  const formatMessage = (message) => ({
    _id: message._id,
    text: message.text,
    createdAt: message.createdAt,
    user: {
      _id: message.user,
    },
  });

  const mensagemEnviada = useCallback(async (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];

    const { error } = await supabase
      .from('Mensagens')
      .insert([
        {
          _id: _id,
          text: text,
          createdAt: createdAt,
          user: user._id,
        },
      ]);

    if (error) {
      console.error(error);
    }
  }, []);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#F37187',
          borderRadius: 15,
          padding: 5,
        },
        left: {
          backgroundColor: '#e5e5ea',
          borderRadius: 15,
          padding: 5,
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
          fontFamily:'Poppins-Light',
          
        },
        left: {
          color: '#000',
          fontFamily:'Poppins-Light'
        },
      }}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <Ionicons name="send" size={24} color="#0084ff" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbar} primaryStyle={styles.inputToolbarPrimary} />
  );

  const renderComposer = (props) => (
    <Composer {...props} textInputStyle={styles.composer} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header corFundo={"#F37187"} href='psicologo/home'></Header>
      <GiftedChat
        messages={messages}
        onSend={(messages) => mensagemEnviada(messages)}
        user={{
          _id: usuarioAtual.id,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        placeholder="  Digite sua mensagem"
        messagesContainerStyle={styles.messagesContainer}
        isLoadingEarlier={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
    fontFamily:'Poppins-Light'
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    backgroundColor: '#f9f9f9',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  inputToolbarPrimary: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  composer: {
    backgroundColor: '#e5e5ea',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    fontFamily:'Poppins-Light'
  },
  messagesContainer: {
    paddingBottom: 10,
    
  },
});

