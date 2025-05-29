// import React, { useState, useEffect, useMemo } from 'react';
// import { SafeAreaView, StyleSheet, View } from 'react-native';
// import {
//   Chat,
//   Channel,
//   MessageList,
//   MessageInput,
//   useChatContext,
//   MessageType,
// } from 'stream-chat-react-native';
// import { StreamChat } from 'stream-chat';
// import { supabase } from '../../../../../utils/supabase';
// import Header from '@/components/geral/header';
// import { useAppContext } from '@/components/provider';

// // Configuração do cliente Stream Chat (substitua 'YOUR_API_KEY' pela sua chave)
// const apiKey = 'hpdq58us3r9a'; // Obtenha em https://getstream.io/dashboard/
// const client = StreamChat.getInstance(apiKey);

// export default function ChatScreen() {
//   const { usuarioAtual } = useAppContext();
//   const [messages, setMessages] = useState<MessageType[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Conecta o usuário ao Stream Chat (usando o ID do Supabase como user.id)
//   useEffect(() => {
//     const connectUser = async () => {
//       try {
//         await client.connectUser(
//           {
//             id: usuarioAtual.id,
//             name: usuarioAtual.nome || 'Usuário',
//           },
//           client.devToken(usuarioAtual.id) // Em produção, use backend para gerar tokens!
//         );
//       } catch (error) {
//         console.error('Erro ao conectar usuário:', error);
//       }
//     };

//     connectUser();

//     return () => {
//       client.disconnectUser();
//     };
//   }, [usuarioAtual]);

//   // Canal fixo (substitua 'general' pelo ID do seu canal no Stream)
//   const channel = useMemo(() => {
//     return client.channel('messaging', 'general', {
//       name: 'Chat Geral',
//       members: [usuarioAtual.id],
//     });
//   }, []);

//   // Sincronização com o Supabase (opcional, se quiser manter histórico)
//   const fetchMessages = async () => {
//     const { data, error } = await supabase
//       .from('Mensagens')
//       .select('*')
//       .order('createdAt', { ascending: false });

//     if (!error) {
//       const formattedMessages = data.map(formatMessage);
//       setMessages(formattedMessages);
//       setLoading(false);
//     } else {
//       console.error(error);
//     }
//   };

//   const formatMessage = (message): MessageType => ({
//     id: message._id,
//     text: message.text,
//     created_at: new Date(message.createdAt),
//     user: {
//       id: message.user,
//     },
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header corFundo="#477BDE" href="paciente/home" />
//       <Chat client={client}>
//         <Channel channel={channel}>
//           <View style={styles.chatContainer}>
//             <MessageList 
//               onEndReached={fetchMessages} 
//               loading={loading}
//             />
//             <MessageInput 
//               placeholder="Digite sua mensagem"
//               Input={() => (
//                 <View style={styles.inputContainer}>
//                   <MessageInput.Input />
//                   <MessageInput.SendButton />
//                 </View>
//               )}
//             />
//           </View>
//         </Channel>
//       </Chat>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   chatContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     marginHorizontal: 10,
//     marginBottom: 10,
//   },
// });