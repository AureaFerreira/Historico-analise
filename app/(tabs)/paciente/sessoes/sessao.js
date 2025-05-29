import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import { Link } from 'expo-router';
import { Card, Divider, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function MinhaSessao() {
    const { sessoes_por_paciente, usuarioAtual } = useAppContext();
    const [sessoes, setSessoes] = useState(null);

    useEffect(() => {
        const fetchSessoes = async () => {
            const data = await sessoes_por_paciente(usuarioAtual.id);
            setSessoes(data);
        };
        fetchSessoes();
    }, []);

    if (!sessoes) {
        return (
            <View style={styles.container}>

                <Header corFundo="#477BDE" href={`paciente/home`} />

                <View style={styles.messageContainer}>
                    <Text style={styles.sessao}>
                        Nenhuma sessão marcada!
                    </Text>
                </View>
                <View style={styles.linkContainer}>
                    <Link href='paciente/psicologos'>
                        <Text style={styles.linkText}>
                            Encontrar um psicólogo!
                        </Text>
                    </Link>
                </View>
            </View>
        );
    }
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };
    return (
        <View style={styles.container}>

            <Header corFundo="#477BDE" href={`paciente/home`} />

            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Minhas sessões</Text>
                </View>

                {sessoes && sessoes.map((sessao) => (
                    <Link href={`paciente/sessoes/${sessao.idSessao}`} key={sessao.idSessao} style={styles.card}>
                        <View key={sessao.idSessao} style={{ padding: 10, margin: 5, display: 'flex' }}>
                            {sessao.Psicologo && (
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5, marginBottom: 3, justifyContent: 'center' }}>
                                        <Text style={styles.sessaoText}>Psicólogo: <Text style={{ fontWeight: 'bold' }}>{sessao.Psicologo.nome}</Text></Text>

                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                        <Badge style={sessao.ativa ? styles.disponivel : styles.indisponivel}>
                                            {sessao.ativa ? 'Ativa' : 'Finalizada'}
                                        </Badge>
                                    </View>
                                </View>
                            )}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                                <Ionicons name="calendar-outline" size={20} color={'#477BDE'} style={{ marginRight: 3 }} />
                                <Text style={styles.textoCardSessao}>{formatDate(sessao.data)}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="alarm-outline" size={20} color={'#477BDE'} style={{ marginRight: 3 }} />
                                <Text style={styles.textoCardSessao}>{formatTime(sessao.hora_inicio)}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="albums-outline" size={20} color={'#477BDE'} style={{ marginRight: 3 }} />
                                <Text style={styles.textoCardSessao}>Sessões Realizadas: {sessao.qtdSessoesFeitas} de {sessao.qtdSessoes}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="repeat-outline" size={20} color={'#477BDE'} style={{ marginRight: 3 }} />
                                <Text style={styles.textoCardSessao}>Intervalo: {sessao.intervalo}</Text>
                            </View>

                            <Text style={styles.textoCardSessao}></Text>
                        </View>

                    </Link>

                ))}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        color: '#477BDE',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: '#FFF',

        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    sessaoText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-Light',
    },
    sessao: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Poppins-Light',
    },
    psicologoImage: {
        width: 30,
        height: 30,
        borderRadius: 25,

    },
    messageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkText: {
        color: 'white',
        fontFamily: 'Poppins-Light',
        textAlign: 'center',
        backgroundColor: '#89CC24',
        borderRadius: 27,
        padding: 10,
    },
    textoCardSessao: {
        fontFamily: 'Poppins-Light',
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Poppins-Light',
        borderRadius: 7,
        marginLeft: 10,
        padding: 3,
        color: 'white'
    },
    disponivel: {
        backgroundColor: 'transparent',
        marginLeft: 5,
        minWidth: 60,
        border: '1px solid green',
        color: 'green',
        marginBottom: 3,
        fontFamily: 'Poppins-Light'
    },
    indisponivel: {
        backgroundColor: 'transparent',
        marginLeft: 10,
        minWidth: 60,
        border: '1px solid red',
        color: 'red',
        marginBottom: 3,
        fontFamily: 'Poppins-Light'
    },
});
