import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useAppContext } from '@/components/provider';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const BarraProgresso = ({ totalSessoes, sessoesConcluidas }) => {
    const barras = [];
    for (let i = 0; i < totalSessoes; i++) {
        barras.push(
            <View
                key={i}
                style={[
                    styles.barra,
                    { backgroundColor: i < sessoesConcluidas ? '#7fc517' : '#f0f0f0' },
                ]}
            />
        );
    }
    return <View style={styles.containerBarra}>{barras}</View>;
};

export default function PacienteDetalhes() {
    const { id } = useLocalSearchParams();
    const { pacientes, sessoes_por_paciente } = useAppContext();
    const [sessoes, setSessoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proximaSessao, setProximaSessao] = useState(null);
    const paciente = pacientes.find(p => p.id === parseInt(id));

    useEffect(() => {
        const buscaDados = async () => {
            try {
                const sessoes = await sessoes_por_paciente(id);
                setSessoes(sessoes);
                setLoading(false);

                const sessoesOrdenadasPorData = sessoes.sort((a, b) => new Date(a.dataSessao) - new Date(b.dataSessao));
                const proximaSessaoEncontrada = sessoesOrdenadasPorData.find(sessao => new Date(sessao.dataSessao) > new Date());

                if (proximaSessaoEncontrada) {
                    setProximaSessao(proximaSessaoEncontrada.dataSessao);
                } else {
                    setProximaSessao(null);
                }
            } catch (error) {
                console.error('Erro ao buscar sessões:', error.message);
                setLoading(false);
            }
        };

        buscaDados();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    const primeiraSessao = sessoes[0] || {};
    const formatarDataBR = (data) => {
        if (!data) return 'Sem agendamento futuro';
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View style={styles.voltar}>
                    <Link href={`psicologo/pacientes`}>
                        <AntDesign name="leftcircleo" size={24} color="white" />
                    </Link>
                </View>
                <Image source={{ uri: paciente.imageUrl }} style={styles.imagemPerfil} />
                <Text style={styles.nomePaciente}>{paciente.nome}</Text>
                <Text style={styles.descricaoPaciente}>{paciente.idade} anos </Text>
            </View>
            <View style={styles.detalhesContainer}>
                <View style={styles.anotacoes}>
                    <Text style={styles.anotacoesTitulo}>
                        <Link href={`/psicologo/anotacoes/${paciente.id}`}>

                            <View style={styles.iconContainerGreen}>
                                <Ionicons name="create" size={25} color="#7fc517" />
                            </View> Anotações
                        </Link>
                    </Text>
                    <Text style={styles.anotacoesTexto}>{primeiraSessao.notasDeSessao}</Text>
                </View>
                <View style={styles.quantidadeSessoesContainer}>
                    <Text style={styles.quantidadeSessoesTitulo}>Quantidade de Sessões</Text>
                    <BarraProgresso totalSessoes={4} sessoesConcluidas={sessoes.length} />
                    <Text style={styles.quantidadeSessoesTexto}>{sessoes.length} de 4</Text>
                </View>
                <Card style={styles.cardProximaSessao}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.calendarIconContainer}>
                            <View style={styles.iconContainerRed}>
                                <Ionicons name="calendar" size={24} color="#F37187" />
                            </View>
                        </View>
                        <View style={styles.horarioTextContainer}>
                            <Text style={styles.tituloHorario}>Próxima Sessão</Text>
                            <Text style={styles.anotacoesTexto}>{primeiraSessao.proximaSessao}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    voltar: {
        position: 'absolute',
        top: 20,
        left: 10,
        backgroundColor: "#F37187",
        borderRadius: 20,
        padding: 5,
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#F37187',
        width: '100%',
        paddingVertical: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    imagemPerfil: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginBottom: 10,
    },
    nomePaciente: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'Poppins-Medium',

    },
    descricaoPaciente: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,

        fontFamily: 'Poppins-Light',

    },
    detalhesContainer: {
        width: '90%',
        marginTop: 20,
    },
    anotacoes: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        fontFamily: 'Poppins-Light',

    },
    anotacoesTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,

        fontFamily: 'Poppins-Light',

    }, loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    anotacoesTexto: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
        fontFamily: 'Poppins-Light',

    },
    quantidadeSessoesContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    quantidadeSessoesTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        fontFamily: 'Poppins-Light',

    },
    quantidadeSessoesTexto: {
        fontSize: 16,
        color: '#000',
        marginTop: 10,
        fontFamily: 'Poppins-Light',

    },
    containerBarra: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    barra: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginHorizontal: 2,
    },
    cardProximaSessao: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginVertical: 20,
        padding: 15,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',

        fontFamily: 'Poppins-Light',

    },
    calendarIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconContainerGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#a8e6cf',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    iconContainerRed: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8b6c2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    horarioTextContainer: {
        flex: 1,
    },
    tituloHorario: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
        fontFamily: 'Poppins-Light'
    },
    textoHorario: {
        fontSize: 14,
        color: '#000',
    },
});
