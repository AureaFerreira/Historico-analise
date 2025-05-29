import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Linking } from "react-native";
import { TextInput, Title, Button, Snackbar } from 'react-native-paper';
import { useLocalSearchParams } from "expo-router";
import { useAppContext } from '@/components/provider';

import Header from '@/components/geral/header';

export default function MeetPsicologo() {
    const { sessao } = useLocalSearchParams();
    const { usuarioAtual, inserirMeet, sessoes_completas } = useAppContext();
    const [sessaoAtual, setSessaoAtual] = useState(null);
    const [meet, setMeet] = useState('');
    const [visivel, setVisivel] = useState(false);
    const [desativar, setDesativar] = useState(false);
    const [editavel, setEditavel] = useState(true);

    useEffect(() => {
        const dadosSessao = async () => {
            const data = await sessoes_completas(sessao);
            setSessaoAtual(data[0]);

        }
        dadosSessao();
    }, [sessao]);

    const direcionaMeet = () => {
        Linking.openURL('https://workspace.google.com/products/meet/');
    };

    const voltarSnackBar = () => setVisivel(false);

    const enviaMeet = async () => {
        await inserirMeet(usuarioAtual.id, sessaoAtual.IdPaciente, meet);
        setVisivel(true)
        setDesativar(true)
        setEditavel(false)
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header corFundo={"#F37187"} href='psicologo/home'></Header>
            <ScrollView contentContainerStyle={styles.container}>
                <Title style={styles.title}>Insira o código do Meet</Title>
                <TextInput
                    label="Código de meet"
                    mode="outlined"
                    value={meet}
                    onChangeText={setMeet}
                    activeOutlineColor="#F37187"
                    style={styles.input}
                    editable={editavel}
                />
                <Button mode="contained" style={styles.button} onPress={enviaMeet} disabled={desativar} labelStyle={{ fontFamily: 'Poppins-Light' }}>
                    Enviar
                </Button>
                <Button
                    mode="contained"
                    onPress={direcionaMeet}
                    style={styles.button}
                    labelStyle={{ fontFamily: 'Poppins-Light' }}>
                    Criar meet
                </Button>
            </ScrollView>
            <Snackbar
                visible={visivel}
                onDismiss={voltarSnackBar}
                action={{
                    label: 'Fechar',
                    onPress: () => {
                    },
                }}>
                Enviado com sucesso!!
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    input: {
        marginBottom: 10,
        fontFamily: "Poppins-Light",
    },
    button: {
        marginBottom: 10,
        backgroundColor: "#F37187",
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        color: 'black',
        fontFamily: 'Poppins-Light',
        textAlign: 'center',
    },
    texto: {
        fontFamily: "Poppins-Light",
    },
    caixa: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    }
});