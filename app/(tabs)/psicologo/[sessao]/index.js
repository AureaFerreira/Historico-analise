import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Link } from "expo-router";
import { Button } from 'react-native-paper';
import Header from '@/components/geral/header';
import { useLocalSearchParams } from "expo-router";
import { useAppContext } from '@/components/provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TelaSessao() {
    const { sessao } = useLocalSearchParams();
    const { sessoes_completas, marcarSessaoConcluida } = useAppContext();
    const [sessaoAtual, setSessaoAtual] = useState(null);
    const [minutesLeft, setMinutesLeft] = useState('');

    useEffect(() => {
        const dadosSessao = async () => {
            const data = await sessoes_completas(sessao);
            setSessaoAtual(data[0]);
        }
        dadosSessao();
    }, [sessao]);

    const calcularMinutosRestantes = (sessaoAtual) => {
        try {
            const sessionTime = new Date(sessaoAtual.data + 'T' + sessaoAtual.hora_inicio);
            const currentTime = new Date();
            const timeDiff = sessionTime.getTime() - currentTime.getTime();
            let minutes = Math.ceil(timeDiff / (1000 * 60));

            if (minutes >= 1440) {
                const days = Math.floor(minutes / 1440);
                return `${days} dia${days > 1 ? 's' : ''}`;
            } else if (minutes >= 60) {
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                return `${hours}h ${remainingMinutes}min`;
            } else if (minutes > 0) {
                return `${minutes} minutos`;
            } else if (minutes === 0) {
                return 'Sua sessão começa agora';
            } else {
                return 'Concluir sessão';
            }
        } catch (error) {
            console.error('Erro ao calcular minutos restantes:', error);
            return 'Erro';
        }
    };

    useEffect(() => {
        if (sessaoAtual) {
            setMinutesLeft(calcularMinutosRestantes(sessaoAtual));

            const interval = setInterval(() => {
                setMinutesLeft(calcularMinutosRestantes(sessaoAtual));
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [sessaoAtual]);

    const abrirMeet = () => {
        router.replace(`/psicologo/${sessao}/meetPsicologo`);
    };

    const chatPaciente = () => {
        router.replace(`/psicologo/${sessao}/chat`);
    };

    const concluirSessao = async () => {
        if (sessaoAtual) {
            await marcarSessaoConcluida(sessaoAtual.idSessao);
            alert('Sessão marcada como concluída!');
            setSessaoAtual(prevState => ({ ...prevState, ativa: false })); // Atualiza o estado local
        }
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
                <Header corFundo="#F37187" href="/psicologo/agenda" />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.label, { fontSize: 20 }]}>
                    Pronto para sua sessão?
                </Text>
                <Text style={styles.subLabel}>
                    Registro de sessão nº {sessaoAtual.idSessao}
                </Text>
            </View>

            <View style={styles.container}>
                <View style={{ flexDirection: 'column', width: '100%' }}>
                    <View style={styles.sessionInfoContainerPessoal}>
                        <View style={styles.cont}>
                            <Text style={styles.titulo}>Paciente</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.valor}>{sessaoAtual.Paciente.nome}</Text>
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
                    {sessaoAtual.ativa ? (
                        minutesLeft === 'Concluir sessão' ? (
                            <View style={styles.actionsContainer}>
                                <Button mode="contained"
                                    onPress={concluirSessao}
                                    buttonColor="#8dcc28"
                                    textColor='white'
                                    labelStyle={{ fontFamily: 'Poppins-Light', textTransform: 'uppercase' }}>
                                    Marcar como concluída
                                </Button>
                            </View>
                        ) : (
                            <View style={styles.sessionInfoContainerPessoal}>
                                <View style={styles.cont}>
                                    <Text style={styles.titulo}>TEMPO RESTANTE</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.valor}>{minutesLeft}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    ) : (
                        <View style={{ marginTop: 20 }}>
                            <View style={{ display: 'flex', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle" color={'#F37187'} size={20}></Ionicons>

                            </View>
                            <Text style={styles.concluidaText}>SESSÃO ENCERRADA</Text>

                        </View>
                    )}
                </View>
                {minutesLeft !== 'Concluir sessão' && sessaoAtual.ativa && (
                    <View style={styles.actionsContainer}>
                            <Button mode="contained" onPress={abrirMeet} buttonColor="#F37187" textColor='white' labelStyle={{ fontFamily: 'Poppins-Light' }}>
                                Abrir Meet
                            </Button>
                            <Button mode="contained" onPress={chatPaciente} labelStyle={{ fontFamily: 'Poppins-Light' }} textColor='white'>
                                Chat
                            </Button>
                    </View>
                )}
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
    capa: {
        width: '100%',
        height: 50,
        backgroundColor: '#F37187',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Esta propriedade é para Android
        marginBottom: 15,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

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
        elevation: 2, // Esta propriedade é para Android
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
        color: '#F37187',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    subLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Light',
        marginBottom: 3,
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
        backgroundColor: '#F37187',
        textAlign: 'center',
        paddingVertical: 3,
        borderRadius: 10,
        fontFamily: 'Poppins-Medium',
        textTransform: 'uppercase'
    },
    concluidaText: {
        fontSize: 16,
        color: '#2c2c2c',
        textAlign: 'center',
        fontFamily: 'Poppins-Bold'
    },
});
