import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Linking, Clipboard } from "react-native";
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAppContext } from '@/components/provider';
import { useLocalSearchParams } from "expo-router";
import Header from '@/components/geral/header';

export default function MeetPaciente() {
    const { sessao } = useLocalSearchParams();
    const { sessoes_completas, buscaPaacienteMeet } = useAppContext();
    const [codigo, setCodigo] = useState('');
    const [visivel, setVisivel] = useState(false);

    useEffect(() => {
        const dadosSessao = async () => {
            const data = await sessoes_completas(sessao);
            console.log(data[0]);
            const dado = await buscaPaacienteMeet(data[0].IdPaciente, data[0].idPsicologo);
            setCodigo(dado);
        }
        dadosSessao();

    }, [sessao]);

    const direcionaMeet = () => {
        Linking.openURL('https://workspace.google.com/products/meet/');
    };

    const copiarCodigo = () => {
        Clipboard.setString(codigo);
        setVisivel(true)
    };

    const voltarSnackBar = () => setVisivel(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
            <Header corFundo={"#477BDE"} href='paciente/home' ></Header>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.titulo}>Código Meet da sessão</Text>
                <View style={styles.caixa}>
                    <TextInput
                        value={codigo}
                        editable={false}
                        style={styles.input}
                        mode="outlined"
                    />
                </View>
                <Button
                    mode="contained"
                    onPress={copiarCodigo}
                    style={styles.button}
                    labelStyle={{ fontFamily: 'Poppins-Light' }}>
                    Copiar Código
                </Button>
                <Button
                    mode="contained"
                    onPress={direcionaMeet}
                    style={styles.button}
                    labelStyle={{ fontFamily: 'Poppins-Light' }}>
                    Meet
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
                Código copiado!
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
        backgroundColor: '#fff',
        width: '100%',
        textAlign: 'center'
    },
    button: {
        marginBottom: 10,
        backgroundColor: "#477BDE",
    },
    texto: {
        fontFamily: "Poppins-Light",
    },
    caixa: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        width: '100%'
    },
    titulo: {
        fontSize: 16,
        marginBottom: 10,
        color: 'black',
        fontFamily: 'Poppins-Light',
        textAlign: 'center',
    },
});
