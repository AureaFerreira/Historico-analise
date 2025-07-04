// import React, { useEffect, useState, useMemo } from 'react';
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
// import { supabase } from '../../../../utils/supabase';
// import Header from '@/components/geral/header';
// import { useAppContext } from '@/components/provider';

// // 1. Configuração do Stream Chat (substitua pela sua API key)
// const apiKey = 'seu_api_key_do_stream'; // Get it from https://getstream.io/dashboard/
// const client = StreamChat.getInstance(apiKey);

// export default function ChatScreen() {
//   const { usuarioAtual } = useAppContext();
//   const [loading, setLoading] = useState(true);

//   // 2. Conecta o usuário ao Stream Chat
//   useEffect(() => {
//     const connectUser = async () => {
//       try {
//         await client.connectUser(
//           {
//             id: usuarioAtual.id,
//             name: usuarioAtual.nome || 'Usuário',
//           },
//           client.devToken(usuarioAtual.id) // Em produção, gere tokens no backend!
//         );
//       } catch (error) {
//         console.error('Erro ao conectar usuário:', error);
//       }
//     };

//     connectUser();

//     return () => client.disconnectUser();
//   }, [usuarioAtual]);

//   // 3. Criação do canal (substitua 'terapia' pelo ID do seu chat)
//   const channel = useMemo(() => {
//     return client.channel('messaging', 'terapia-' + usuarioAtual.id, {
//       name: 'Sessão de Terapia',
//       members: [usuarioAtual.id, 'psicologo-id'], // Adicione todos os participantes
//     });
//   }, []);

//   // 4. Sincronização inicial com o Supabase (opcional)
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const { data } = await supabase
//         .from('Mensagens')
//         .select('*')
//         .order('createdAt', { ascending: true });

//       if (data) {
//         // Envia as mensagens antigas para o Stream Chat
//         await channel.sendMessages(
//           data.map((m) => ({
//             text: m.text,
//             user: { id: m.user },
//             created_at: new Date(m.createdAt),
//           }))
//         );
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header corFundo="#F37187" href="psicologo/home" />
      
//       <Chat client={client}>
//         <Channel channel={channel}>
//           <View style={styles.chatContainer}>
//             <MessageList />
//             <MessageInput 
//               placeholder="Digite sua mensagem"
//               Input={({ ...props }) => (
//                 <View style={styles.inputContainer}>
//                   <MessageInput.Input {...props} />
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
//     backgroundColor: '#f5f5f5',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//   },
// });