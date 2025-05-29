import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '@/components/provider';
import CardHomePsi from '@/components/psicologo/cardHomePsi';
import { Link } from 'expo-router';
import Header from '@/components/geral/header';
import { Ionicons } from '@expo/vector-icons';

export default function ListaPacientes() {
    const { pacientes } = useAppContext();

    return (
        <View style={styles.screenContainer}>
            <Header corFundo={'#F37187'} href='psicologo/home' />
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Meus Pacientes</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {pacientes.length > 0 ? (
                    pacientes.map(paciente => (
                        <Link key={paciente.id} href={`psicologo/pacientes/${paciente.id}`} asChild>
                            <TouchableOpacity style={styles.cardContainer}>
                                <CardHomePsi paciente={paciente} />
                            </TouchableOpacity>
                        </Link>
                    ))
                ) : (
                    <Text style={styles.noPatients}>Nenhum paciente cadastrado.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 22,
        color: '#F37187',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    scrollContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    
    icon: {
        marginLeft: 'auto',
    },
    noPatients: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 20,
    },
});
