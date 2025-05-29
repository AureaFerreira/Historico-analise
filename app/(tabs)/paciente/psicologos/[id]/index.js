import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions, TouchableOpacity } from "react-native";
import { Card } from 'react-native-paper';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useAppContext } from '@/components/provider';
import { Link } from 'expo-router';
import CardHorarioDisponivel from "@/components/paciente/cardHorarioDisponivel";
import ProgressBar from "./barraProgresso";

export default function DetalhesPsicologos() {
    const { id } = useLocalSearchParams();
    const { psicologos, sessaoPorPsicologo, statusAgenda, horarioMaisProximoPorPsicologo } = useAppContext();
    const { width } = useWindowDimensions();
    const [isLoading, setLoading] = useState(true);
    const [psicologo, setPsicologo] = useState(null);
    const [sessao, setSessao] = useState(null);
    const [status, setStatus] = useState(null);
    const [expandido, setExpandido] = useState(false);
    const [expandido1, setExpandido1] = useState(false);
    const [expandido2, setExpandido2] = useState(false);
    const [expandido3, setExpandido3] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [proximoHorario, setProximoHorario] = useState(null);

    useEffect(() => {
        const fetchPsicologo = () => {
            const foundPsicologo = psicologos.find(p => p.id === parseInt(id, 10));
            setPsicologo(foundPsicologo);
            setLoading(false);
        };
        const session = async () => {
            const response = await sessaoPorPsicologo(id);
            setSessao(response);
        };
        const status = async () => {
            const respostas = await statusAgenda(id);
            var contador = 0
            for (var resposta of respostas) {
                if (resposta.disponivel == true) {
                    setStatus('Disponível')
                    break
                }
                contador++
            }
            if (contador == respostas.length) {
                setStatus('Indisponível')
            }
        };
        const fetchProximoHorario = async () => {
            const horario = await horarioMaisProximoPorPsicologo(id);
            setProximoHorario(horario);
        };
        fetchPsicologo();
        session();
        status();
        fetchProximoHorario();
    }, [id, psicologos]);

    const formatoDuracao = (duracao) => {
        if (!duracao) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#477BDE" />
                </View>
            );
        }
        const [hours, minutes] = duracao.split(':').map(Number);
        if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    if (!sessao || !proximoHorario || !statusAgenda || !psicologo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    const limiteCaracteres = width <= 320 ? 16 : 20;
    const tag = psicologo.tags && psicologo.tags.length > 0 ? psicologo.tags[0].toUpperCase()[0] + psicologo.tags[0].slice(1) : '';
    const stat = psicologo.status.toUpperCase()[0] + psicologo.status.slice(1);
    const tagExibir = tag.length > limiteCaracteres ? tag.substring(0, limiteCaracteres - 3) + "..." : tag;

    const toggleExpandir = () => {
        setExpandido(!expandido);
    };
    const toggleExpandir1 = () => {
        setExpandido1(!expandido1);
    };
    const toggleExpandir2 = () => {
        setExpandido2(!expandido2);
    };
    const toggleExpandir3 = () => {
        setExpandido3(!expandido3);
    };

    return (
        <ScrollView>
            <ProgressBar currentPage={currentPage} />
            <View style={styles.container}>
                <View style={styles.capa}>
                    <View style={styles.voltar}>
                        <Link href={`paciente/psicologos`}>
                            <Ionicons name="chevron-back-outline" size={24} color="white" />
                        </Link>
                    </View>

                    <View style={styles.imagemContainer}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Image source={{ uri: psicologo.imageUrl }} style={styles.imagemPerfil} />
                        </View>
                    </View>

                    <View style={styles.perfilContainer}>
                        <Text style={styles.nome}>{psicologo.nome}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                        <Text style={{ fontSize: 12, color: "white", fontFamily: 'Poppins-Light' }}>CRP {psicologo.crp}</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.detalhes}>
                            <View style={styles.estrelasContainer}>
                                <Ionicons name="star" size={15} color="white" />
                                <Text style={{ color: "white", marginLeft: 4, fontFamily: 'Poppins-Light' }}>{psicologo.quantEstrelas}</Text>
                            </View>

                            <View style={styles.estrelasContainer}>
                                <Ionicons name="ribbon" size={15} color="white" />
                                <Text style={{ color: "white", marginLeft: 3, fontFamily: 'Poppins-Light' }}>{tagExibir}</Text>
                            </View>

                            <View style={styles.estrelasContainer}>
                                <Ionicons name="rocket" size={15} color="white" />
                                <Text style={{ color: "white", marginLeft: 3, fontFamily: 'Poppins-Light' }}>{status}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.abaixo}>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 6 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={styles.cardVerd}>
                                <Card.Content>
                                    <Text style={styles.tituloCardDuplo}>Sessão</Text>
                                    <Text style={styles.textoCardDuplo}>R$ {psicologo.valorSessao}</Text>
                                </Card.Content>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                            <View style={styles.cardVerd}>
                                <Card.Content>
                                    <Text style={styles.tituloCardDuplo}>Duração</Text>

                                    <Text style={styles.textoCardDuplo}>{formatoDuracao(psicologo.duracao)}</Text>

                                </Card.Content>
                            </View>
                        </View>
                    </View>

                    <View style={{ margin: 10 }}></View>

                    <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
                        <View>
                            <View style={styles.tituloAcordion}>
                                <Ionicons name="happy-outline" size={15} color={'#89CC24'} />
                                <Text style={styles.tituloDetalhes2} numberOfLines={1}>Biografia</Text>
                            </View>
                            <Text style={styles.textoDetalhes2} numberOfLines={expandido ? null : 1}>
                                {psicologo.especialidade}
                            </Text>
                            {psicologo.especialidade.length > 100 && (
                                <TouchableOpacity onPress={toggleExpandir}>
                                    <Text style={styles.expandText}>
                                        {expandido ? 'Mostrar menos' : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View >
                            <View style={styles.tituloAcordion}>
                                <Ionicons name="trophy-outline" size={15} color={'#89CC24'} />

                                <Text style={styles.tituloDetalhes2} numberOfLines={1}>{psicologo.detalhes[0].titulo}</Text>
                            </View>
                            <Text style={styles.textoDetalhes2} numberOfLines={expandido1 ? null : 1}>
                                {psicologo.detalhes[0].descricao}
                            </Text>
                            {psicologo.detalhes[0].descricao.length > 50 && (
                                <TouchableOpacity onPress={toggleExpandir1}>
                                    <Text style={styles.expandText}>
                                        {expandido1 ? 'Mostrar menos' : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View >
                            <View style={styles.tituloAcordion}>
                                <Ionicons name="ear-outline" size={15} color={'#89CC24'} />

                                <Text style={styles.tituloDetalhes2} numberOfLines={1}>{psicologo.detalhes[1].titulo}</Text>
                            </View>
                            <Text style={styles.textoDetalhes2} numberOfLines={expandido2 ? null : 1}>
                                {psicologo.detalhes[1].descricao}
                            </Text>
                            {psicologo.detalhes[1].descricao.length > 50 && (
                                <TouchableOpacity onPress={toggleExpandir2}>
                                    <Text style={styles.expandText}>
                                        {expandido2 ? 'Mostrar menos' : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View >
                            <View style={styles.tituloAcordion}>
                                <Ionicons name="wallet-outline" size={15} color={'#89CC24'} />

                                <Text style={styles.tituloDetalhes2} numberOfLines={1}>{psicologo.detalhes[2].titulo}</Text>
                            </View>

                            <Text style={styles.textoDetalhes2} numberOfLines={expandido3 ? null : 1}>
                                {psicologo.detalhes[2].descricao}
                            </Text>
                            {psicologo.detalhes[2].descricao.length > 50 && (
                                <TouchableOpacity onPress={toggleExpandir3}>
                                    <Text style={styles.expandText}>
                                        {expandido3 ? 'Mostrar menos' : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View>
                        <CardHorarioDisponivel data={proximoHorario.data} horario={proximoHorario.hora_inicio}></CardHorarioDisponivel>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    voltar: {
        backgroundColor: "#477BDE",
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 10,
    },
    tituloAcordion: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    detalhes: {
        backgroundColor: "#6b94e3",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: "95%",
        height: 20,
        borderRadius: 20,
    },
    textoDetalhes2: {
        fontSize: 14,
        color: "#737373",
        paddingLeft: 6,
        fontFamily: 'Poppins-Light'
    },
    tituloDetalhes2: {
        fontSize: 15, fontWeight: 'bold', color: "#2C2C2C", fontFamily: 'Poppins-Light',
        marginLeft: 5
    },
    capa: {
        width: "100%",
        height: 170,
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
        elevation: 5,

    },
    tag: {
        flexDirection: 'row',
        fontSize: 16,
        marginRight: 10,
    },
    perfilContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagemContainer: {
        marginRight: 10,
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        justifyContent: 'center'
    },
    imagemPerfil: {
        width: 40,
        height: 40,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nome: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Poppins-Medium'
    },
    estrelasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
        marginRight: 10,
        fontFamily: 'Poppins-Light'
    },
    abaixo: {
        margin: 10
    },
    tituloCardDuplo: {
        fontSize: 15,
        color: "white",
        fontFamily: 'Poppins-Light'
    },
    textoCardDuplo: {
        fontSize: 18,
        color: "white",
        fontWeight: 'bold',
        fontFamily: 'Poppins-Light'
    },
    cardVerd: {
        backgroundColor: "#89CC24",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 7,
        paddingVertical: 5

    },
    textoDetalhes: {
        fontSize: 13,
        color: "#737373",
        borderLeftWidth: 2,
        borderColor: 'white',
        paddingLeft: 6,
        borderRadius: 2,
        fontFamily: 'Poppins-Light'
    },
    tituloDetalhes: {
        fontSize: 15, fontWeight: 'bold', color: "#2C2C2C", marginBottom: 5, fontFamily: 'Poppins-Light'
    },
    expandText: {
        color: '#737373',
        fontWeight: 'bold',
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
});
