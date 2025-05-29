import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '@/components/geral/header';
import { useLocalSearchParams, Link } from "expo-router";
import { useAppContext } from '@/components/provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TelaSessaoPaciente() {
    const { sessao } = useLocalSearchParams();
    const { sessoes_completas } = useAppContext();
    const [sessaoAtual, setSessaoAtual] = useState(null);
    const [minutesLeft, setMinutesLeft] = useState('');

    useEffect(() => {
        const dadosSessao = async () => {
            const data = await sessoes_completas(sessao);
            setSessaoAtual(data[0]);
        }
        dadosSessao();
    }, [sessao]);

    const calcularMinutosRestantes = () => {
        if (!sessaoAtual) return '';

        try {
            const sessionTime = new Date(sessaoAtual.data + 'T' + sessaoAtual.hora_inicio);
            const currentTime = new Date();
            const timeDiff = sessionTime.getTime() - currentTime.getTime();
            let minutes = Math.ceil(timeDiff / (1000 * 60));

            if (minutes >= 1440) {
                const days = Math.floor(minutes / 1440);
                const remainingMinutes = minutes % 1440;
                const hours = Math.floor(remainingMinutes / 60);
                const remainingMinutesAfterHours = remainingMinutes % 60;
                return `${days} dia${days > 1 ? 's' : ''} `;
            } else if (minutes >= 60) {
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                return `${hours}h ${remainingMinutes}min`;
            } else if (minutes > 0) {
                return `${minutes} minutos`;
            } else if (minutes === 0) {
                return 'Sua sessão começa agora';
            } else {
                return 'A sessão já começou';
            }
        } catch (error) {
            console.error('Erro ao calcular minutos restantes:', error);
            return 'Erro';
        }
    };

    useEffect(() => {
        if (sessaoAtual && sessaoAtual.ativa) {
            setMinutesLeft(calcularMinutosRestantes());

            const interval = setInterval(() => {
                setMinutesLeft(calcularMinutosRestantes());
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [sessaoAtual]);

    const abrirMeet = () => {
        router.replace(`/paciente/sessoes/${sessao}/meetPaciente`);
    };

    const chatPaciente = () => {
        router.replace(`/paciente/sessoes/${sessao}/chat`);
    };

    if (!sessaoAtual) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <ScrollView>
            <View>
                <Header corFundo="#477BDE" href="/paciente/sessoes/sessao" />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.label, { fontSize: 20 }]}>
                    Pronto para sua sessão?
                </Text>
            </View>
            <View style={styles.container}>
                <View style={{ flexDirection: 'column', width: '100%' }}>
                    <View style={styles.sessionInfoContainerPessoal}>
                        <View style={styles.cont}>
                            <Text style={styles.titulo}>Psicólogo</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.valor}>{sessaoAtual.Psicologo.nome}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sessionInfoContainerPessoal}>
                        <View style={styles.cont}>
                            <Text style={styles.titulo}>DATA</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.valor}>{formatDate(sessaoAtual.data)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sessionInfoContainerPessoal}>
                        <View style={styles.cont}>
                            <Text style={styles.titulo}>HORÁRIO</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.valor}>{sessaoAtual.hora_inicio.substring(0, 5)}</Text>
                            </View>
                        </View>
                    </View>
                    {sessaoAtual.ativa && (
                        <View style={styles.sessionInfoContainerPessoal}>
                            <View style={styles.cont}>
                                <Text style={styles.titulo}>TEMPO RESTANTE</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.valor}>{minutesLeft}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {!sessaoAtual.ativa && (
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <View style={{ display: 'flex', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle" color={'#477BDE'} size={20}></Ionicons>
                            </View>
                            <Text style={styles.concluidaText}>SESSÃO ENCERRADA</Text>
                        </View>
                    )}
                    {sessaoAtual.ativa && (
                        <View style={styles.actionsContainer}>
                            <Button mode="contained" onPress={abrirMeet} buttonColor="#F37187" textColor='white'>
                                Abrir Meet
                            </Button>
                                <Button mode="contained" onPress={chatPaciente} buttonColor="#89CC24" textColor='white'>
                                    Chat
                                </Button>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    sessionInfoContainerPessoal: {
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    cont: {
        borderRadius: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        paddingHorizontal: 10,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    valor: {
        fontSize: 16,
        fontFamily: 'Poppins-Light',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    label: {
        fontSize: 12,
        color: '#477BDE',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
    },
    titulo: {
        fontSize: 12,
        color: 'white',
        backgroundColor: '#477BDE',
        textAlign: 'center',
        paddingVertical: 3,
        borderRadius: 10,
        fontFamily: 'Poppins-Medium',
        textTransform: 'uppercase',
    },
    concluidaText: {
        fontSize: 16,
        fontFamily: 'Poppins-Light',

    },
});