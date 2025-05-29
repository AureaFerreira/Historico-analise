import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/components/provider';
import Header from '@/components/geral/header';
import { Button, Divider } from 'react-native-paper';
import { addDays, format } from 'date-fns';
import ModalPagamento from "@/components/paciente/modalPagamento";


import { Ionicons } from '@expo/vector-icons';

export default function ConfirmarAgendamento() {
    const { id, date, time, qtdSessoes, valorTotal, idAgenda, intervalo } = useLocalSearchParams();
    const { psicologos, inserirSessao, usuarioAtual, consultarHorariosDisponiveis, timesSessao } = useAppContext();
    const [psicologo, setPsicologo] = useState(null);
    const [times, setTimes] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [proximasSessoes, setProximasSessoes] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false); // New state to track confirmation

    const confirmarSessao = async () => {
        try {
            if (qtdSessoes == 1) {
                await inserirSessao(idAgenda, usuarioAtual.id, qtdSessoes, valorTotal, intervalo);
                Alert.alert('Sessão confirmada');
                setIsConfirmed(true); // Set confirmation state to true
            } else if (qtdSessoes == 2) {

                if (intervalo === 'Semanal') {
                    let dataSeteDiasDepois = addDays(date, 8);
                    let dataFormatada = format(dataSeteDiasDepois, 'yyyy-MM-dd');
                    const fetch = async () => {
                        const timess = await consultarHorariosDisponiveis(id, dataFormatada);
                        setTimes(timess);
                    }
                    await fetch();
                    if (times && times.length > 0) {
                        await inserirSessao(idAgenda, usuarioAtual.id, qtdSessoes, valorTotal, intervalo);
                        await inserirSessao(times[0].id, usuarioAtual.id, qtdSessoes, valorTotal, intervalo);
                        alert('Sessões confirmadas semanalmente');
                        setIsConfirmed(true); // Set confirmation state to true
                    } else {
                        Alert.alert(`Não foi possível concluir. O psicólogo selecionado não possui horário disponível no dia ${dataFormatada}.`);
                    }
                } else if (intervalo === 'Quinzenal') {
                    let dataQuinzeDiasDepois = addDays(date, 16);
                    let dataFormatada = format(dataQuinzeDiasDepois, 'yyyy-MM-dd');
                    const fetch = async () => {
                        const timess = await consultarHorariosDisponiveis(id, dataFormatada);
                        setTimes(timess);
                    }
                    await fetch();
                    if (times && times.length > 0) {
                        await inserirSessao(idAgenda, usuarioAtual.id, qtdSessoes, valorTotal, intervalo);
                        await inserirSessao(times[0].id, usuarioAtual.id, qtdSessoes, valorTotal, intervalo);
                        alert('Sessões confirmadas quinzenalmente');
                        setIsConfirmed(true); // Set confirmation state to true
                    } else {
                        Alert.alert(`Não foi possível concluir. O psicólogo selecionado não possui horário disponível no dia ${dataFormatada}.`);
                    }
                }
            } else if (qtdSessoes === 4) {
                if (intervalo === 'semanal') {
                    await inserirSessao(idAgenda, usuarioAtual.id, 1, valorTotal / 4, 'semanal');
                    await inserirSessao(times[0].id, usuarioAtual.id, 1, valorTotal / 4, 'semanal', 1);
                    await inserirSessao(times[1].id, usuarioAtual.id, 1, valorTotal / 4, 'semanal', 2);
                    await inserirSessao(times[2].id, usuarioAtual.id, 1, valorTotal / 4, 'semanal', 3);
                    Alert.alert('Sessões confirmadas semanalmente');
                    setIsConfirmed(true); // Set confirmation state to true
                }
            } else {
                Alert.alert('Quantidade de sessões ou intervalo inválido');
            }
        } catch (error) {
            console.error('Erro ao confirmar sessões:', error);
            Alert.alert('Erro ao confirmar sessões. Tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        const fetchPsicologo = () => {
            const foundPsicologo = psicologos.find(p => p.id === parseInt(id, 10));
            setPsicologo(foundPsicologo);
        };
        fetchPsicologo();
    }, [id, psicologos]);

    useEffect(() => {
        let proximasSessoesTemp = {};

        Object.keys(timesSessao).slice(1).forEach((data, index) => {
            console.log(`Data: ${data}`);
            timesSessao[data].forEach((item) => {
                proximasSessoesTemp[index] = item;
            });
        });

        setProximasSessoes(proximasSessoesTemp);
    }, [timesSessao]);

    if (!psicologo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }
    const formatDate2 = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };

    console.log(timesSessao);
    const resetaTudo = () => {
        setIsConfirmed(false); // Set confirmation state to true

    }
    return (
        <ScrollView>
            <TouchableOpacity onPress={() => resetaTudo()}>
                <Header corFundo="#477BDE" href={`paciente/psicologos/${psicologo.id}/agenda`}></Header>
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Confirme os dados</Text>
                </View>
                <View style={styles.container2}>
                    <View style={styles.cardCada}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: 'center', }}>
                            <Ionicons name="calendar-outline" color={"#477BDE"} size={24} />

                        </View>
                        <View>
                            <Text style={styles.dados}>Data</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 5 }}>
                                {Object.keys(timesSessao).map((data, index) => (
                                    <View key={index} >
                                        <Text style={{
                                            color: 'black',
                                            fontFamily: 'Poppins-Medium',
                                            fontSize: 16,
                                            marginRight: 10
                                        }}>
                                            {formatDate2(data)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    </View>

                    <View style={styles.cardCada}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: 'center', }}>
                            <Ionicons name="alarm-outline" color={"#477BDE"} size={24} />

                        </View>
                        <View>

                            <Text style={styles.dados}>Horário</Text>
                            <View style={styles.horarioDisponivelContainer}>
                                <Text style={styles.card}>{formatTime(time)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardCada}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: 'center', }}>
                            <Ionicons name="albums-outline" color={"#477BDE"} size={24} />

                        </View>
                        <View>

                            <Text style={styles.dados}>Quantidade de Sessões </Text>
                            <View style={styles.horarioDisponivelContainer}>
                                <Text style={styles.card}>{qtdSessoes}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardCada}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: 'center', }}>
                            <Ionicons name="receipt-outline" color={"#477BDE"} size={24} />

                        </View>
                        <View>

                            <Text style={styles.dados}>Valor Total </Text>
                            <View style={styles.horarioDisponivelContainer}>
                                <Text style={styles.card}>R$ {valorTotal}</Text>
                            </View>
                        </View>
                    </View>


                </View>

                <View style={styles.container}>
                    {!isConfirmed && (
                        <Button
                            style={{ color: 'white', fontFamily: 'Poppins-Light', textAlign: "center" }}
                            labelStyle={{ fontFamily: 'Poppins-Light' }}
                            buttonColor="#89CC24" mode="contained" onPress={confirmarSessao}>
                            CONFIRMAR
                        </Button>
                    )}
                    <Divider></Divider>

                    {isConfirmed && ( // Conditionally render the buttons based on confirmation state
                        <>
                            <View>
                                <View style={{ marginTop: 20, alignItems: 'center' }}>
                                    <View style={{ display: 'flex', alignItems: 'center' }}>
                                        <Ionicons name="checkmark-circle" color={'#477BDE'} size={20}></Ionicons>
                                    </View>
                                    <Text style={styles.concluidaText}>SESSÃO CONFIRMADA</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: 'center', }}>
                                <View style={{ marginVertical: 10, padding: 10 }}>
                                    <Button
                                        style={{ color: 'black', fontFamily: 'Poppins-Medium', textAlign: "center" }}
                                        labelStyle={{ fontFamily: 'Poppins-Medium' }}
                                        buttonColor="#89CC24"
                                        mode="contained"
                                        onPress={() => setModalVisible(true)}>
                                        PAGAMENTO
                                    </Button>

                                </View>

                                <Link href={`/paciente/psicologos/${psicologo.id}/contrato`}
                                    style={{
                                        color: 'white',
                                        fontFamily: 'Poppins-Medium',
                                        textAlign: "center",
                                        backgroundColor: "#89CC24",
                                        borderRadius: 27,
                                        padding: 10
                                    }}>
                                    <Text


                                    >
                                        CONTRATO
                                    </Text>
                                </Link>
                            </View>

                        </>
                    )}
                </View>
            </ScrollView>

            <ModalPagamento
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                chavePix={psicologo.pix}
                valor={Number(valorTotal)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    container2: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10
    },
    buttonContinue: {
        backgroundColor: '#89CC24',
        borderRadius: 25,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Light',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    dados: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginHorizontal: 5,
        marginLeft: 5
    },
    card: {
        color: 'black',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horarioDisponivelContainer: {
        marginHorizontal: 5,
        marginLeft: 5
    },
    title: {
        fontSize: 20,
        color: '#477BDE',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    cardCada: {
        backgroundColor: 'white',
        borderRadius: 7,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 320,
        padding: 10,
        flexDirection: 'row',
    },
    concluidaText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#2c2c2c',
    },
});
