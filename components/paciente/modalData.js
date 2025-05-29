import React, { useEffect, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RadioButton, Divider } from 'react-native-paper';
import RadioButtonCustomizado from './radioButton';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/components/provider';

export default function ModalCalendario({ visible, onClose, markedDates,
    selectedDate, setSelectedDate, availableTimes,
    selectedTime, setSelectedTime, handleDayPress, onConfirm, selectedAgendaId, setSelectedAgendaId }) {
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    const [agendaId, setAgendaId] = useState(null);
    const { consultarHorariosDisponiveis } = useAppContext();
    const [a, seta] = useState([]);

    useEffect(() => {
        setDataSelecionada(selectedDate);
        setHorarioSelecionado(selectedTime);
        setAgendaId(selectedAgendaId)
    }, [selectedDate, selectedTime, selectedAgendaId]);

    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };
    const handleConfirm = () => {
        if (dataSelecionada && horarioSelecionado) {
            onConfirm(dataSelecionada, horarioSelecionado, agendaId);
            onClose();
        } else {
            setHorarioSelecionado(null);
        }
    };

    return (
        <Modal visible={visible} animationType="slide"
            onRequestClose={onClose}
            transparent={true}
            contentContainerStyle={styles.modalContentContainer}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 4 }}>
                            <Text style={styles.header}>Selecionar data</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={onClose} >
                                <Ionicons name="close" size={20} color={'#477BDE'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Divider style={{ marginTop: 5 }} />
                    <ScrollView>
                        <View style={{ alignItems: 'center' }}>
                            <Calendar
                                markedDates={{
                                    ...markedDates,
                                    [selectedDate]: { selected: true, disableTouchEvent: true }
                                }}
                                minDate={new Date().toISOString().split('T')[0]}
                                onDayPress={day => {
                                    setSelectedDate(day.dateString);

                                    handleDayPress(day.dateString);
                                }}
                                theme={{
                                    selectedDayBackgroundColor: '#89CC24',
                                    textDayFontFamily: 'Poppins-Light',
                                    textDayFontSize: 14,
                                    textMonthFontFamily: 'Poppins-Medium',
                                    textDayHeaderFontFamily: 'Poppins-Light',
                                    textDayHeaderFontSize: 10,
                                    textMonthFontSize: 15,
                                    selectedDotColor: '#89CC24',

                                }}
                            />
                        </View>
                        <Divider style={{ marginVertical: 5 }} />
                        {availableTimes.length > 0 && (
                            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                                <Text style={styles.selectTimeText}>Selecione o horário</Text>
                            </View>
                        )}
                        <View style={{ padding: 2, }}>
                            <RadioButton.Group
                                onValueChange={value => {
                                    setSelectedTime(value);
                                    const selectedTimeInfo = availableTimes.find(time => time.hora_inicio === value);
                                    if (selectedTimeInfo) {
                                        setSelectedAgendaId(selectedTimeInfo.id);
                                    }
                                }}
                                value={selectedTime}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap', alignItems: 'center'
                                }}>
                                    {availableTimes.map(time => (
                                        <RadioButtonCustomizado
                                            key={time.id}
                                            label={formatTime(time.hora_inicio)}
                                            value={time.hora_inicio}
                                            status={selectedTime === time.hora_inicio ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setSelectedTime(time.hora_inicio);
                                                setSelectedAgendaId(time.id);
                                            }}
                                        />
                                    ))}
                                </View>
                            </RadioButton.Group>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={handleConfirm} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 300,
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#89CC24',
        borderRadius: 5,
        padding: 7,
    },
    closeButtonText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
    },
    header: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#000',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    modalContentContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
        alignSelf: 'center',
    },
    errorText: {
        color: 'white',
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        backgroundColor: 'red',
        padding: 2,
        borderRadius: 7
    },
    selectTimeText: {
        fontFamily: 'Poppins-Medium'
    }
});
