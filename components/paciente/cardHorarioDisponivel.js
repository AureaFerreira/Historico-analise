import React from 'react';
import { View, Text, Image, StyleSheet, } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router"; // Certifique-se de importar corretamente o Link
import { useLocalSearchParams } from "expo-router";

export default function CardHorarioDisponivel(data) {
    const { id } = useLocalSearchParams();
    

    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };

    return (
        <Link href={`paciente/psicologos/${id}/agenda`} style={styles.linkContainer}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="megaphone" size={20} color={"white"} />
                        </View>

                        <View style={styles.textContainer}>
                            <View style={styles.row}>
                                <Text style={[styles.textoCardSessao, { fontFamily: 'Poppins-Medium' }]}>Horário disponível</Text>
                            </View>
                            <View style={styles.row}>
                                <Ionicons name="calendar-outline" size={15} color={'#477BDE'} style={styles.icon} />
                                <Text style={styles.textoCardSessao}>{formatDate(data.data)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Ionicons name="alarm-outline" size={20} color={'#477BDE'} style={styles.icon} />
                                <Text style={styles.textoCardSessao}>{formatTime(data.horario)}</Text>
                            </View>
                        </View>

                        <View style={styles.chevronContainer}>
                            <Ionicons name="chevron-forward-outline" size={25} color={"#477BDE"} />
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </Link>
    );

};

const styles = StyleSheet.create({
    linkContainer: {
        display: 'flex',
        marginBottom: 10, // Ajuste conforme necessário
    },
    card: {
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 10,
        backgroundColor: '#477BDE',
        borderRadius: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    icon: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 1,
    },
    chevronContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    textoCardSessao: {
        fontFamily: 'Poppins-Light',
        fontSize: 16,
        marginLeft: 6,
    },

})