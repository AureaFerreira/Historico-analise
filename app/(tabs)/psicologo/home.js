import { useEffect, useState, } from 'react';

import logoOnTerapia from '@/assets/images/logoOnTerapia.png';
import fotoCli from "@/assets/images/perfilMulher.png";
import { useAppContext } from '@/components/provider';
import { Ionicons } from '@expo/vector-icons';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge, Card } from 'react-native-paper';
import ChecklistModal from '../../../components/psicologo/modal';

export default function HomePsicologo() {
    const { usuarioAtual, buscaUsuarioId, sessao_mais_proxima } = useAppContext();
    const [user, setUser] = useState(null);
    const [sessaoProxima, setSessaoProxima] = useState(null);
    const [nome, setNomePaciente] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [checklist, setChecklist] = useState([
        { id: '1', title: 'Declaração Ana', completed: true },
        { id: '2', title: 'Cadastrar Horários', completed: false }
    ]);
    const hoje = new Date();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await buscaUsuarioId(usuarioAtual.id);
                setUser(userData);

            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };
        const fetchSessao = async () => {
            try {
                const dados = await sessao_mais_proxima(usuarioAtual.id);
                setSessaoProxima(dados);
                if (dados && dados.Paciente) {
                    setNomePaciente(dados.Paciente.nome);
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        }
        if (usuarioAtual) {
            fetchUserData();
            fetchSessao();
        }
    }, [usuarioAtual]);

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }
    const toggleChecklist = (id) => {
        setChecklist(prevChecklist =>
            prevChecklist.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };
    const handleIconPress = () => {
        console.log('Ícone clicado!');
    };

    return (
        <ScrollView style={{backgroundColor:'#f2f2f2'}} headerBackgroundColor={{ light: '#F37187', dark: '#F37187' }} >
            <View style={[styles.capa, { fontFamily: 'Poppins-Light' }]}>
                <View style={styles.imagemContainer}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image source={logoOnTerapia} style={styles.imagem} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={styles.rowCapa}>
                        <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-Light' }}> Olá, <Text style={{ fontFamily: 'Poppins-Bold' }}>{user.data.nome.split(' ')[0]}</Text >!
                        </Text>

                    </View>
                    <View style={[styles.rowCapa]}>
                        <Link href={"psicologo/notificacaoPsicologo"}>
                            <View style={styles.notificacao}>
                                <Badge style={{ color: 'white', fontSize: 12, fontFamily: 'Poppins-Light', backgroundColor: '#477bde' }}>2</Badge>
                                <Ionicons name="notifications-outline"
                                    size={25}
                                    color={'white'} />

                            </View>
                        </Link>

                    </View>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, marginBottom: 8, }}>
                    <Ionicons name="calendar-clear-outline"
                        size={14}
                        color={'white'} style={{ marginRight: 5 }} />
                    <Text style={{ fontFamily: 'Poppins-Light', color: 'white', fontSize: 12, alignItems: 'center' }}>

                        {format(hoje, "EE, dd 'de' MMMM", { locale: ptBR })}
                    </Text>
                    {/* <Text style={{fontFamily:'Poppins-Regular', color:'white', marginLeft:8}}>
                        Seja a mudança que você quer ver no mundo
                    </Text> */}
                </View>

            </View>
            <ScrollView style={{ marginTop: 15, paddingHorizontal: 10 }} horizontal showsHorizontalScrollIndicator={false}>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 2, width: 'auto', height: 'auto' }}>
                        <Link href='psicologo/pacientes'>
                            <Card style={styles.cardVerd}>
                                <Card.Content >
                                    <View style={[styles.iconsCard, { backgroundColor: '#cee9a6' }]}>
                                        <Ionicons name="people"
                                            size={30}
                                            color={'#8dcc28'} />
                                    </View>

                                    <Text style={styles.tituloCardDuplo}>Meus pacientes</Text>

                                </Card.Content>
                            </Card>
                        </Link>

                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 2, width: 'auto', height: 'auto' }}>

                        <Link href={"psicologo/anotacoes"}>
                            <Card style={styles.cardVerd}>
                                <Card.Content >
                                    <View style={[styles.iconsCard, { backgroundColor: '#f7c6cb' }]}>
                                        <Ionicons name="reader-outline"
                                            size={30}
                                            color={'#F37187'} />
                                    </View>

                                    <Text style={styles.tituloCardDuplo}>Anamnese</Text>

                                </Card.Content>
                            </Card>
                        </Link>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 2, width: 'auto', height: 'auto', }}>
                        <Card style={styles.cardVerd}>
                            <Card.Content>
                                <View style={[styles.iconsCard, { backgroundColor: '#f7c6cb' }]}>
                                    <Image source={require('@/assets/images/ai.png')} style={{ width: 40, height: 40, }} />

                                </View>

                                <Text style={styles.tituloCardDuplo}>Ony</Text>

                            </Card.Content>
                        </Card>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 2, width: 'auto', height: 'auto' }}>
                        <Link href='psicologo/agenda'>
                            <Card style={styles.cardVerd}>
                                <Card.Content>
                                    <View style={[styles.iconsCard, { backgroundColor: '#badefa' }]}>
                                        <Ionicons name="calendar"
                                            size={30}
                                            color={'#477bde'} />
                                    </View>

                                    <Text style={styles.tituloCardDuplo}>Agenda</Text>

                                </Card.Content>
                            </Card>
                        </Link>
                    </View>

                </View>
            </ScrollView>
            <View style={styles.checklistContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.checklistTitle}>Checklist</Text>
                    <Ionicons
                        name={"add"}
                        size={24} color={"#F37187"}
                        onPress={() => setModalVisible(true)}
                    />
                </View>
                <FlatList
                    data={checklist}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => toggleChecklist(item.id)} style={styles.checklistItem}>

                            <Text style={styles.checklistText}>{item.title}</Text>
                            <Ionicons
                                name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                                size={24} color={item.completed ? "#8dcc28" : "gray"}
                            />
                        </Pressable>
                    )}
                />
            </View>
            {/* <View style={{ margin: 10 }}>
                {sessaoProxima ? (
                    <Link href={`psicologo/${sessaoProxima.idSessao}`} style={styles.cardSessão}>
                        <CardProximaSessao
                            bgColor={'#F37187'}
                            sessaoProxima={sessaoProxima}
                            nome={nome}
                        />

                    </Link>
                ) : (
                    <View style={[styles.cardSessão, { backgroundColor: '#ccc', alignItems: 'center' }]}>
                        <Text style={{ fontFamily: 'Poppins-Light', fontSize: 16, color: '#555' }}>
                            Nenhuma sessão agendada.
                        </Text>
                    </View>
                )}
            </View> */}
            <View style={styles.cardSessão}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Foto do paciente */}
                    <Image source={fotoCli} style={{ height: 80, width: 80, borderRadius: 50, marginRight: 10 }} />

                    {/* Informações da sessão */}
                    <View style={{ flex: 1 }}>
                        <View style={{ marginBottom: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 18 }}>Próxima sessão</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                            <Ionicons name="person-outline" size={20} color={'#F37187'}
                                style={{ backgroundColor: 'white', borderRadius: 5, padding: 1 }} />
                            <Text style={styles.textoCardSessao} numberOfLines={1}>Paciente</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                            <Ionicons name="calendar-outline" size={20} color={'#F37187'}
                                style={{ backgroundColor: 'white', borderRadius: 5, padding: 1 }} />
                            <Text style={styles.textoCardSessao}>
                                {format(hoje, "dd 'de' MMMM", { locale: ptBR })}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="alarm-outline" size={20} color={'#F37187'}
                                style={{ backgroundColor: 'white', borderRadius: 5, padding: 1 }} />
                            <Text style={styles.textoCardSessao}>15:00</Text>
                        </View>
                    </View>

                    {/* Ícone de avançar */}
                    <Ionicons name="chevron-forward-outline" size={20} color={'white'} />
                </View>
            </View>

            <View>
                {/* <FraseMotivacional></FraseMotivacional> */}
                <ChecklistModal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    onSave={(checklist) => {
                        setChecklist(checklist);
                        setModalVisible(false);
                    }}
                />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    voltar: {
        backgroundColor: "#F37187",
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 10,

    },
    capa: {
        width: "100%",
        height: 180,
        backgroundColor: "#F37187",
        borderBottomLeftRadius: 27,
        borderBottomRightRadius: 27,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Esta propriedade é para Android
        paddingHorizontal: 15

    },
    imagem: {
        width: 30,
        height: 30,
        marginTop: 55
    },
    rowCapa: {
        flexDirection: 'collum',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notificacao: {
        // backgroundColor: '#f37187',
        width: 53,
        height: 53,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardVerd: {
        backgroundColor: "white",
        width: 130,
        height: 130,
        margin: 5,

    },
    iconsCard: {
        borderRadius: 17,
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tituloCardDuplo: {
        marginTop: 10,
        fontFamily: 'Poppins-Regular',
        color: '#1f2937',
        // textAlign: 'center',
        fontSize: 14,
    },
    cardSessão: {
        backgroundColor: '#F37187',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'center',
        padding: 20,
        borderRadius: 17,
        margin: 6,
    },

    textoCardSessao: {
        fontFamily: 'Poppins-Light',
        color: 'white',
        fontSize: 16,
        marginLeft: 6
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    checklistContainer: {
        padding: 15,
    },

    checklistTitle: {
        fontSize: 16,
        fontWeight: 'bold', marginBottom: 10, color: '#F37187', fontFamily: 'Poppins-Light',
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: 8,
        backgroundColor: 'white',
        marginVertical: 2,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, // Pequeno deslocamento
        shadowOpacity: 0.1, // Opacidade bem leve
        shadowRadius: 2, // Espalhamento pequeno
        // Sombra no Android
        elevation: 2,

    },
    checklistText: {
        fontSize: 16,
        fontFamily: 'Poppins-Light',

    },
})