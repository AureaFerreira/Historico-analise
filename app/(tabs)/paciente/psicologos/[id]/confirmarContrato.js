import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking, ScrollView, ActivityIndicator, Alert, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/components/provider';
import Header from '@/components/geral/header';
import ProgressBar from "./barraProgresso";
import { Link } from 'expo-router';


export default function ConfirmarContrato() {
    const [currentPage] = useState(4);
    const [psicologo, setPsicologo] = useState(null);
    const { psicologos } = useAppContext();

    useEffect(() => {
        const fetchPsicologo = () => {
            const foundPsicologo = psicologos.find(p => p.id === parseInt(id, 10));
            if (foundPsicologo) {
                setPsicologo(foundPsicologo);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        fetchPsicologo();
    }, [id, psicologos]);
    
    if ( !psicologo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Header corFundo="#477BDE" href={`paciente/psicologos/${psicologo.id}/contrato`} />
            <ProgressBar currentPage={currentPage} />
            <View style={styles.messageContainer}>
                <Text style={styles.message}>Contrato assinado com sucesso!</Text>
                <Link href="/paciente/home">
                    <Pressable style={styles.button} >
                        <Text style={styles.buttonText}>Tela Inicial</Text>
                    </Pressable>
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    messageContainer: {
        padding: 50,
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#477BDE',
    },
    button: {
        backgroundColor: '#477BDE',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
