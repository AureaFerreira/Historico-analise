import logoOnTerapia from '@/assets/images/logoOnTerapia.png';
import fotoCli from "@/assets/images/perfilMulher.png";
import { useAppContext } from '@/components/provider';
import { Ionicons } from '@expo/vector-icons';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
                // ESTE É O PONTO ONDE VOCÊ PRECISA INVESTIGAR NO SEU `useAppContext`
                // O erro "invalid input syntax for type bigint: 'teleconsulta'" provavelmente vem daqui.
                // Certifique-se de que os parâmetros passados para sessao_mais_proxima e suas funções internas
                // estejam corretos e não tentem usar strings onde números são esperados (como IDs).
                const dados = await sessao_mais_proxima(usuarioAtual.id);
                setSessaoProxima(dados);
                if (dados && dados.Paciente) {
                    setNomePaciente(dados.Paciente.nome);
                }
            } catch (error) {
                console.error('Erro ao buscar sessão:', error);
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
        setChecklist(prev =>
            prev.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    return (
        <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
            <View style={[styles.capa]}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image source={logoOnTerapia} style={styles.imagem} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-Light' }}>
                        Olá, <Text style={{ fontFamily: 'Poppins-Bold' }}>{user.data.nome.split(' ')[0]}</Text>!
                    </Text>
                    <Link href="psicologo/notificacaoPsicologo">
                        <View style={styles.notificacao}>
                            <Badge style={{ color: 'white', fontSize: 12, fontFamily: 'Poppins-Light', backgroundColor: '#477bde' }}>2</Badge>
                            <Ionicons name="notifications-outline" size={25} color="white" />
                        </View>
                    </Link>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, marginBottom: 8 }}>
                    <Ionicons name="calendar-clear-outline" size={14} color="white" style={{ marginRight: 5 }} />
                    <Text style={{ fontFamily: 'Poppins-Light', color: 'white', fontSize: 12 }}>
                        {format(hoje, "EE, dd 'de' MMMM", { locale: ptBR })}
                    </Text>
                </View>
            </View>

            {/* === CARDS DE AÇÕES === */}
            <ScrollView style={{ marginTop: 15, paddingHorizontal: 10 }} horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                    {/* Pacientes */}
                    <CardLink href='psicologo/pacientes' icon="people" iconColor="#8dcc28" bgColor="#cee9a6" label="Meus pacientes" />
                    
                     
                    <Card style={styles.cardVerd}>
                        <Card.Content>
                            <View style={[styles.iconsCard, { backgroundColor: '#f7c6cb' }]}>
                                <Image source={require('@/assets/images/ai.png')} style={{ width: 40, height: 40 }} />
                            </View>
                            <Text style={styles.tituloCardDuplo}>Ony</Text>
                        </Card.Content>
                    </Card>
            
                    <CardLink href='psicologo/agenda' icon="calendar" iconColor="#477bde" bgColor="#badefa" label="Agenda" />
                   
                    <CardLink 
                    href='/psicologo/evolucao-casos' 
                    icon="document-text-outline" 
                    iconColor="#f59e0b" 
                    bgColor="#ffe9b8" 
                    label="Evolução" 
                />

                    <CardLink href='psicologo/teleconsulta' icon="videocam-outline" iconColor="#374151" bgColor="#d1d5db" label="Teleconsulta" />
                
<CardLink 
    href='psicologo/personalizarAnamnese' 
    icon="reader-outline" 
    iconColor="#F37187" 
    bgColor="#f7c6cb" 
    label="Anamnese" 
/>


                </View>
            </ScrollView>

            {/* === CHECKLIST === */}
            <View style={styles.checklistContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.checklistTitle}>Checklist</Text>
                    <Ionicons name="add" size={24} color="#F37187" onPress={() => setModalVisible(true)} />
                </View>
                {/* CORREÇÃO AQUI: Substituí FlatList por map para evitar aninhamento de ScrollViews */}
                {checklist.map(item => (
                    <Pressable key={item.id} onPress={() => toggleChecklist(item.id)} style={styles.checklistItem}>
                        <Text style={styles.checklistText}>{item.title}</Text>
                        <Ionicons
                            name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                            size={24}
                            color={item.completed ? "#8dcc28" : "gray"}
                        />
                    </Pressable>
                ))}
            </View>

            {/* === PRÓXIMA SESSÃO === */}
            <View style={styles.cardSessão}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={fotoCli} style={{ height: 80, width: 80, borderRadius: 50, marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 18 }}>Próxima sessão</Text>
                        <InfoLine icon="person-outline" text="Paciente" />
                        <InfoLine icon="calendar-outline" text={format(hoje, "dd 'de' MMMM", { locale: ptBR })} />
                        <InfoLine icon="alarm-outline" text="15:00" />
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="white" />
                </View>
            </View>

            {/* Modal checklist */}
            <ChecklistModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                onSave={(checklist) => {
                    setChecklist(checklist);
                    setModalVisible(false);
                }}
            />
        </ScrollView>
    );
}

// ==== COMPONENTES AUXILIARES ====

const CardLink = ({ href, icon, iconColor, bgColor, label }) => (
    <View style={{ marginHorizontal: 2 }}>
        <Link href={href}>
            <Card style={styles.cardVerd}>
                <Card.Content>
                    <View style={[styles.iconsCard, { backgroundColor: bgColor }]}>
                        <Ionicons name={icon} size={30} color={iconColor} />
                    </View>
                    <Text style={styles.tituloCardDuplo}>{label}</Text>
                </Card.Content>
            </Card>
        </Link>
    </View>
);

const InfoLine = ({ icon, text }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
        <Ionicons name={icon} size={20} color="#F37187" style={{ backgroundColor: 'white', borderRadius: 5, padding: 1 }} />
        <Text style={styles.textoCardSessao}>{text}</Text>
    </View>
);

// ==== ESTILOS ====

const styles = StyleSheet.create({
    capa: {
        width: "100%",
        height: 180,
        backgroundColor: "#F37187",
        borderBottomLeftRadius: 27,
        borderBottomRightRadius: 27,
        paddingHorizontal: 15,
        paddingTop: 55
    },
    imagem: {
        width: 30,
        height: 30,
    },
    notificacao: {
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
        fontSize: 14,
    },
    cardSessão: {
        backgroundColor: '#F37187',
        padding: 20,
        borderRadius: 17,
        margin: 6,
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
        marginLeft: 6
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checklistContainer: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 20,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    checklistTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        marginBottom: 15,
        color: '#333',
    },
    checklistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    checklistText: {
        fontSize: 16,
        fontFamily: 'Poppins-Light',
        color: '#555',
        flex: 1,
    },
});