import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Chip } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useAppContext } from '@/components/provider';
import { Link, useLocalSearchParams } from 'expo-router';
import Header from '@/components/geral/header';
import ModalCalendario from "@/components/paciente/modalData";
import { LocaleConfig } from 'react-native-calendars';
import RadioButtonCustomizado from "@/components/paciente/radioButton";
import ProgressBar from "./barraProgresso";
import { addDays, format } from 'date-fns';

LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
        'Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'
    ],
    dayNames: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    dayNamesShort: [
        'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
    ],
    today: "Hoje"
};

LocaleConfig.defaultLocale = 'pt-br';

const getMarkedDates = (availableDates) => {
    const markedDates = {};

    for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        markedDates[dateString] = { disabled: true, disableTouchEvent: true };
    }

    availableDates.forEach(item => {
        const date = item.data;
        const agendaId = item.id;
        const horario = item.hora_inicio;
        markedDates[date] = {
            disabled: false,
            disableTouchEvent: false,
            dotColor: 'green',
            marked: true,
            agendaId: agendaId,
            horario: horario
        };
    });

    return markedDates;
};


export default function AgendaConsulta() {
    const { id } = useLocalSearchParams();
    const { psicologos, consultarHorariosDisponiveis, setTimesData, datasDisponiveisPorPsicologo } = useAppContext();
    const [psicologo, setPsicologo] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [selected, setSelected] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [qtdSessoes] = useState([1, 2, 4]);
    const [intervalo] = useState(['Semanal', 'Quinzenal']);
    const [checked, setChecked] = useState(null);
    const [times, setTimes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(2);
    const [valorTotal, setValorTotal] = useState(null);

    const [checkedIntervalo, setCheckedIntervalo] = useState(intervalo[0].toString());
    const [selectedAgendaId, setSelectedAgendaId] = useState(null);

    useEffect(() => {
        const fetchPsicologo = () => {
            const foundPsicologo = psicologos.find(p => p.id === parseInt(id, 10));
            setPsicologo(foundPsicologo);

        };
        const fetchDates = async () => {
            setIsLoading(true);
            try {
                const datas = await datasDisponiveisPorPsicologo(id);
                const marked = getMarkedDates(datas);
                setMarkedDates(marked);
            } catch (error) {
                console.error('Error fetching dates:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPsicologo();
        fetchDates();
    }, [id, psicologos]);

    useEffect(() => {
        if (selectedDate && checked) {
            const valorTotal = psicologo.valorSessao * parseInt(checked, 10);
            setValorTotal(valorTotal);
            if (checked == 2) {
                if (checkedIntervalo == 'Semanal') {
                    let dataSeteDiasDepois = addDays(selectedDate, 8);
                    let dataFormatada = format(dataSeteDiasDepois, 'yyyy-MM-dd');
                    const fetch = async () => {
                        const timess = await consultarHorariosDisponiveis(id, dataFormatada);
                        setTimes({
                            [selectedDate]: selectedDate,
                            [dataFormatada]: timess,
                        });
                    }
                    fetch();
                } else if (checkedIntervalo == 'Quinzenal') {
                    let dataQuinzeDiasDepois = addDays(selectedDate, 16);
                    let dataFormatada = format(dataQuinzeDiasDepois, 'yyyy-MM-dd');
                    const fetch = async () => {
                        const timess = await consultarHorariosDisponiveis(id, dataFormatada);
                        setTimes({
                            [selectedDate]: selectedDate,
                            [dataFormatada]: timess,
                        });
                    }
                    fetch();
                }

            } else if (checked == 4) {
                if (checkedIntervalo == 'Semanal') {
                    let data7DiasDepois = addDays(selectedDate, 8);
                    let data14DiasDepois = addDays(selectedDate, 15);
                    let data21DiasDepois = addDays(selectedDate, 22);
                    let data7 = format(data7DiasDepois, 'yyyy-MM-dd');
                    let data14 = format(data14DiasDepois, 'yyyy-MM-dd');
                    let data21 = format(data21DiasDepois, 'yyyy-MM-dd');
                
                    const fetch = async () => {
                        const time7 = await consultarHorariosDisponiveis(id, data7);
                        const time14 = await consultarHorariosDisponiveis(id, data14);
                        const time21 = await consultarHorariosDisponiveis(id, data21);
                        setTimes({
                            [selectedDate]: selectedDate,
                            [data7]: time7,
                            [data14]: time14,
                            [data21]: time21
                        });
                    }
                    fetch();
                }
            } else if (checked == 1) {
                setTimes({ [selectedDate]: selectedDate })
            
            }
        }

    }, [selectedDate, checked, checkedIntervalo]);
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    const formatDate2 = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };
    const handleDayPress = async (date, id) => {
        const times = await consultarHorariosDisponiveis(psicologo.id, date);
        setAvailableTimes(times);
        setSelectedTime('');
    };
    const handleStoreTimes = () => {
        // Supondo que você queira armazenar 'times' ao pressionar um botão ou evento específico
        setTimesData(times);
    };
    if (isLoading || !psicologo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }
    const handleConfirm = (date, time, id) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setSelectedAgendaId(id);
    };
    const resetaTudo = () => {
        setSelectedDate(null);
        setSelectedTime(null);
        setChecked(null);
        setTimes(null);
    }


                        
    
    const HorarioDisponivel = ({ dateKey, times }) => (
        <View key={dateKey} style={{ marginHorizontal: 5, alignItems: 'center', padding: 5, shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Elevation for Android
            elevation: 5,
            backgroundColor:'white', borderRadius:7 }}>
            <Text style={{
                color: times[dateKey] && times[dateKey].length > 0 ? '#89CC24' : '#b31724',
                fontFamily: 'Poppins-Medium',
                fontSize: 16
            }}>
                {formatDate2(dateKey)}
            </Text>
            <Text style={{
                color: times[dateKey] && times[dateKey].length > 0 ? '#89CC24' : '#b31724',
                fontFamily: 'Poppins-Medium',
                fontSize: 12
            }}>
                {times[dateKey] && times[dateKey].length > 0 ? 'Disponível' : 'Indisponível'}
            </Text>
        </View>
    );
    const allTimesFilled = times && Object.values(times).every(timeArray => timeArray.length > 0);
  
    return (
        <ScrollView>
            <TouchableOpacity onPress={() => resetaTudo()}>
                <Header corFundo="#477BDE" href={`paciente/psicologos/${id}`} />
                <ProgressBar currentPage={currentPage} />
            </TouchableOpacity>


            <ScrollView style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.label}>Marcar Consulta</Text>
                    </View>
                </View>

                <View style={styles.containerCard}>
                    <View style={styles.card}>
                        <Image source={{ uri: psicologo.imageUrl }} style={styles.imagem} />
                        <View style={[styles.corpo, { color: '#2C2C2C' }]}>
                            <View style={styles.titulo}>
                                <Text style={[styles.nome, { color: '#2C2C2C', fontFamily: 'Poppins-Light' }]}>{psicologo.nome}</Text>
                            </View>
                            <Text style={[styles.especialidade, { color: '#2C2C2C', fontFamily: 'Poppins-Light' }]} numberOfLines={1}>{psicologo.especialidade}</Text>
                        </View>
                    </View>
                </View>
                <Divider></Divider>
                <View style={styles.containerBody}>

                    <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.style}>
                        <View style={{ justifyContent: 'center', flex: 7, alignItems: 'center' }}>
                            <Text style={{ color: '#477BDE', fontFamily: 'Poppins-Medium', fontSize: 16 }}>Selecionar horário</Text>
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>

                            <Ionicons name="chevron-forward-outline" size={20} color={'#477BDE'} style={styles.icon} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10, marginLeft: 5 }}>
                        {selectedDate && selectedTime && (
                            <View>

                                <View style={styles.row}>
                                    <Ionicons name="calendar-outline" size={20} color={'#477BDE'} style={styles.icon} />
                                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                        <Text style={styles.textoCardSessao}>{formatDate(selectedDate)}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.row, { marginTop: 10 }]}>
                                    <Ionicons name="alarm-outline" size={20} color={'#477BDE'} style={styles.icon} />
                                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                        <Text style={styles.textoCardSessao}>{formatTime(selectedTime)}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                    </View>

                </View>
                <Divider />
                {selectedDate && selectedTime && (
                    <View>


                        <View style={styles.containerBody}>
                            <View style={{ marginVertical: 5, justifyContent: 'center', flexDirection: "row", alignItems: 'center' }}>
                                <Text style={{ color: '#477BDE', fontFamily: 'Poppins-Medium', fontSize: 16 }}>Quantidade de sessões</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
                                {qtdSessoes.map(item => (
                                    <View key={item.toString()} style={{ marginHorizontal: 5 }}>
                                        <RadioButtonCustomizado
                                            label={item.toString()}
                                            value={item.toString()}
                                            status={checked === item.toString() ? 'checked' : 'unchecked'}
                                            onPress={() => setChecked(item.toString())}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                        <Divider />

                    </View>
                )}

                <View >
                    {checked == 2 && (
                        <View>
                            <View style={styles.containerBody}>
                                <View style={{ marginVertical: 5, justifyContent: 'center', flexDirection: "row", alignItems: 'center' }}>
                                    <Text style={{ color: '#477BDE', fontFamily: 'Poppins-Medium', fontSize: 16 }}>Intervalo</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
                                    {intervalo.map(item => (
                                        <View style={{ marginHorizontal: 5 }} key={item}>
                                            <RadioButtonCustomizado
                                                key={item}
                                                label={item.toString()}
                                                value={item.toString()}
                                                status={checkedIntervalo === item.toString() ? 'checked' : 'unchecked'}
                                                onPress={() => setCheckedIntervalo(item.toString())}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <Divider />
                        </View>
                    )}
                    {checked == 4 && (
                        <View>

                            <View style={styles.containerBody}>
                                <View style={{ marginVertical: 5, justifyContent: 'center', flexDirection: "row", alignItems: 'center' }}>
                                    <Text style={{ color: '#477BDE', fontFamily: 'Poppins-Medium', fontSize: 16 }}>Intervalo</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>

                                    <View style={{ marginHorizontal: 5 }}>
                                        <RadioButtonCustomizado
                                            key={intervalo[0]}
                                            label={intervalo[0].toString()}
                                            value={intervalo[0].toString()}
                                            status={checkedIntervalo === intervalo[0].toString() ? 'checked' : 'unchecked'}
                                            onPress={() => setCheckedIntervalo(intervalo[0].toString())}
                                        />
                                    </View>

                                </View>
                            </View>
                            <Divider />
                        </View>
                    )}
                </View>
                <View style={{ marginBottom: 5 }}>
                    {times && Object.keys(times).length > 1 && (
                        <View style={styles.containerBody}>
                            <View style={{ marginVertical: 5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#477BDE', fontFamily: 'Poppins-Medium', fontSize: 16 }}>Próximas datas</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                {Object.keys(times).slice(1).map(dateKey => (
                                    <HorarioDisponivel key={dateKey} dateKey={dateKey} times={times} />
                                ))}
                            </View>
                        </View>
                    )}
                    

                </View>
                <ModalCalendario
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    markedDates={markedDates}
                    selectedDate={selected}
                    setSelectedDate={setSelected}
                    availableTimes={availableTimes}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    handleDayPress={(date, id) => handleDayPress(date, id)}
                    onConfirm={handleConfirm}
                    selectedAgendaId={selectedAgendaId}
                    setSelectedAgendaId={setSelectedAgendaId}
                    psicologoId={id}
                />
                {selectedDate && selectedTime && checked &&allTimesFilled ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding:10, }}>
                        
                        <Link href={{
                            pathname: `paciente/psicologos/${psicologo.id}/confirmar`,
                            params: {
                                date: selectedDate,
                                time: selectedTime,
                                qtdSessoes: checked,
                                valorTotal: valorTotal,
                                idAgenda: selectedAgendaId,
                                intervalo: checkedIntervalo,
                                times1: times,
                            }
                        }}
                            style={styles.buttonContinue}
                            onPress={handleStoreTimes}
                        >
                            <Text style={{ color: 'white', fontFamily: 'Poppins-Light', textAlign: 'center' }} >CONTINUAR</Text>
                        </Link>
                        
                    </View>
                ) : selectedDate && checked && checkedIntervalo ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, padding:10, }}>
                            <Ionicons name="close-circle" size={20} color={'#b31724'} style={styles.icon} />
                        
                        <Text style={{ color: '#b31724', fontFamily: 'Poppins-Medium', textAlign: 'center', fontSize:16 }}>Datas indisponíveis!</Text>
                        <Text style={{ color: '#2c2c2c', fontFamily: 'Poppins-Regular', textAlign: 'center',  fontSize:14 }}>Selecione outra data para continuar</Text>
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                    </View>
                )}


            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 5,
        backgroundColor: "#f4f4f4",
    },
    label: {
        fontSize: 20,
        color: '#477BDE',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    tituloHeader: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium'
    },
    spacer: {
        height: 20,
    },
    containerCard: {
        width: '100%',
        padding: 10,
    },
    icon: {

    },
    card: {
        flexDirection: 'row',
    },
    imagem: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 20,
    },
    tituloDetalhes: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    },
    textoCardSessao: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginLeft: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,

    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
    },
    titulo: {
        flexDirection: 'row',
        alignContent: 'space-between',
        fontFamily: 'Poppins-Light'
    },
    descricao: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontFamily: 'Poppins-Light'
    },
    corpo: {
        flex: 1,
    },
    containerBody: {
        margin: 10
    },
    textDetalhesTitulo: {
        marginLeft: 10,
        marginBottom: 5,
        fontSize: 18,
        fontFamily: 'Poppins-Medium'
    },
    textDetalhes: {
        fontSize: 15,
        marginLeft: 25,
        textAlign: 'justify',
        marginBottom: 5,
        fontFamily: 'Poppins-Light'
    },
    horarioContainer: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontFamily: 'Poppins-Light'
    },
    seletorDia: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    seletorDiaTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 20,
        fontFamily: 'Poppins-Light'
    },
    buttonContinue: {
        backgroundColor: '#89CC24',
        borderRadius: 25,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Light',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        display: 'flex',
        width: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Elevation for Android
        elevation: 5,
    },
    titleDetalhes: {
        fontSize: 15,
        textAlign: 'justify',
        fontFamily: 'Poppins-Light',
        color: 'red'
    },
    expandText: {
        color: '#737373',
        fontWeight: 'bold',
        marginTop: 5,
        fontFamily: 'Poppins-Light',
    },
    seletorDia: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seletorDiaTexto: {
        fontSize: 18,
        marginHorizontal: 10,
    },

    horarioContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    style: {
        marginVertical: 5,
        justifyContent: 'center',
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#cac4d0',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 7,
        padding: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Elevation for Android
        elevation: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
});
