import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import logoOnTerapia from '@/assets/images/logoOnTerapia.png'
import { Link } from 'expo-router';
import { useAppContext } from '@/components/provider';
import CardProximaSessao from "@/components/paciente/cardProximaSessao";

export default function HomePaciente() {
    const { usuarioAtual, buscaUsuarioId, sessao_mais_proxima_paciente } = useAppContext();
    const [user, setUser] = useState(null);
    const [sessaoProxima, setSessaoProxima] = useState(null);
    const [nome, setNomePsicologo] = useState(null);

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
                const dados = await sessao_mais_proxima_paciente(usuarioAtual.id);
                setSessaoProxima(dados);
                if (dados && dados.Psicologo) {
                    setNomePsicologo(dados.Psicologo.nome);
                }
            } catch (error) {
                console.error('Erro ao buscar sessão mais próxima:', error);
            }
        }
        if (usuarioAtual) {
            fetchUserData();
            fetchSessao();
        }
    }, [usuarioAtual]);

    if (!user || !sessaoProxima) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    const handleIconPress = () => {
        console.log('Ícone clicado!');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.capa, { fontFamily: 'Poppins-Light' }]}>
                <View style={styles.imagemContainer}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image source={logoOnTerapia} style={styles.imagem} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <View style={[styles.rowCapa, { marginLeft: 2 }]}>

                        <Link href='paciente/perfilPaciente'>
                            <Ionicons name="person-outline"
                                size={30}
                                color={'white'} />
                        </Link>
                    </View>
                    <View style={styles.rowCapa}>
                        <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-Light' }}> Olá, <Text style={{ textDecoration: 'bold' }}>{user.data.nome.split(' ')[0]}</Text >!
                        </Text>
                        <Text style={{ color: '#ffff', fontFamily: 'Poppins-Light' }}>Pronto para a sessão?</Text>
                    </View>
                    <View style={[styles.rowCapa, { marginRight: 2 }]}>
                        <Link href={"paciente/notificacaoPaciente"}>
                            <View style={styles.notificacao}>
                                <Ionicons name="notifications-outline"
                                    size={25}
                                    color={'white'} />
                            </View>
                        </Link>
                    </View>
                </View>
            </View>
            <View style={{ margin: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{ flexDirection: 'column', width: 'auto', height: 'auto' }}>
                        <Link href={"paciente/psicologos"}>
                            <Card style={styles.cardVerd}>
                                <Card.Content style={styles}>
                                    <View style={[styles.iconsCard, { backgroundColor: '#fbb3bb' }]}>
                                        <Ionicons name="people"
                                            size={30}
                                            color={'#F37187'} />
                                    </View>
                                    <Text style={styles.tituloCardDuplo}>Psicólogos</Text>
                                </Card.Content>
                            </Card>
                        </Link>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginLeft:10}}>
                        <View style={{ flexDirection: 'column', width: 'auto', height: 'auto' }}>
                            <Link href={"paciente/sessoes/sessao"} >
                                <Card style={styles.cardVerd}>
                                    <Card.Content style={styles}>
                                        <View style={[styles.iconsCard, { backgroundColor: '#cee9a5' }]}>
                                            <Ionicons name="heart"
                                                size={30}
                                                color={'#89CC24'} />
                                        </View>
                                        <Text style={styles.tituloCardDuplo}>Minha Sessão</Text>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </View>
                    </View>
                </View>
                <View style={{ marginVertical: 10}}>
                    <Link href={`paciente/sessoes/${sessaoProxima.idSessao}`} style={styles.cardSessão}>
                        <CardProximaSessao
                            bgColor={'#89CC24'}
                            sessaoProxima={{ sessaoProxima }} nome={{ nome }}></CardProximaSessao>
                    </Link>
                </View>
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    capa: {
        width: "100%",
        height: 150,
        backgroundColor: "#477BDE",
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

    },

    imagemContainer: {
        marginRight: 10,
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
        marginTop:30,
    },

    textoCardDuplo: {
        fontSize: 18,
        color: "black",
        fontWeight: 'bold',
    },
    tituloSessao: {
        fontSize: 18,
        color: "black",
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,

    },
    coracaoVermelho: {
        backgroundColor: "#f9b0bd",
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        marginBottom: 10,
    },
    homemVerde: {
        backgroundColor: "#cee9a5",
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        marginBottom: 10,
    },
    sinoAzul: {
        backgroundColor: "#70A1FF",
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
    },
    rowCapa: {
        flexDirection: 'collum',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notificacao: {
        backgroundColor: '#70A1FF',
        width: 53,
        height: 53,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imagem: {
        width: 40,
        height: 40,
        marginTop: 6
    },
    cardVerd: {
        backgroundColor: "white",
        width: 130,
        height: 130,
        margin: 5,
        marginRight: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    iconsCard: {
        borderRadius: 17,
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tituloCardDuplo: {
        fontFamily: 'Poppins-Medium',
        color: '#2c2c2c',
        marginTop: 6,
        fontSize: 16,

    },
    cardSessão: {
        backgroundColor: '#89CC24',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,

        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'center',
        padding: 6,
        borderRadius: 17,

        
    },
    textoCardSessao: {
        fontFamily: 'Poppins-Light',
        color: 'white',
        fontSize: 16,
        marginLeft: 6
    }
});
