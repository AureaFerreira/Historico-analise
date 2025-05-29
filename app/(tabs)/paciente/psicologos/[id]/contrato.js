import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking, ScrollView, ActivityIndicator, Alert, Pressable} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/components/provider';
import Header from '@/components/geral/header';
import ProgressBar from "./barraProgresso";
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function AssinarContrato() {
    const { psicologos, usuarioAtual, buscaUsuarioId } = useAppContext();
    const [isLoading, setLoading] = useState(true);
    const [psicologo, setPsicologo] = useState(null);
    const [currentPage] = useState(3);
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [informacoesVerdadeiras, setInformacoesVerdadeiras] = useState(false);
    const [sessoesPresenciais, setSessoesPresenciais] = useState(false);
    const [sessoesOnline, setSessoesOnline] = useState(false);
    const id = 1;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await buscaUsuarioId(usuarioAtual.id);
                setUser(userData);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        if (usuarioAtual) {
            fetchUserData();
        }
    }, [usuarioAtual]);

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

    if (isLoading || !user || !psicologo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    const handleDownloadPress = () => {
        const ContractDownloadLink = 'https://drive.google.com/file/d/1ntZ0fagwlsJo58kYsPuKIAKvTwQB6jjM/view?usp=sharing';
        Linking.openURL(ContractDownloadLink).catch(error => console.error("Erro ao abrir o link:", error));
    };

    const handleAssinarContrato = () => {
        if (!termosAceitos || !informacoesVerdadeiras) {
            Alert.alert("Erro", "Por favor, aceite todos os termos para assinar o contrato.");
            return;
        }
        // Lógica para assinar o contrato (pode ser uma chamada API, atualização de estado, etc.)
        Alert.alert("Sucesso", "Contrato assinado com sucesso.");
    };

    return (
        <ScrollView>
            <Header corFundo="#477BDE" href={`paciente/psicologos/${psicologo.id}/confirmar`} />
            <ProgressBar currentPage={currentPage} />
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    <Ionicons name="document-text-outline" size={24} color="#000" /> Contrato
                </Text>
                <View style={styles.card}>
                    <View style={styles.content}>
                        <Pressable style={styles.cardContent} onPress={handleDownloadPress}>
                            <Text style={styles.contractName}>Contrato.pdf</Text>
                            <Ionicons name="document-text-outline" size={40} color="#fff" />
                        </Pressable>
                        <View style={styles.infoContainer}>
                            <View style={styles.detailContainer}>
                                <Text style={styles.label}>Nome</Text>
                                <Text style={styles.detailText}>{user.data.nome}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={styles.label}>Data de aniversário</Text>
                                <Text style={styles.detailText}>{user.data.dataNascimento}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={styles.label}>Email</Text>
                                <Text style={styles.detailText}>{user.data.email}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={styles.label}>Número</Text>
                                <Text style={styles.detailText}>{user.data.telefone}</Text>
                            </View>
                            <View style={styles.checkboxContainer}>
                                <Pressable style={styles.checkboxItem} onPress={() => setTermosAceitos(!termosAceitos)}>
                                    <Ionicons name={termosAceitos ? "checkbox-outline" : "square-outline"} size={24} color="#477BDE" />
                                    <Text style={styles.checkboxLabel}>Li e aceito os termos do contrato</Text>
                                </Pressable>
                                <Pressable style={styles.checkboxItem} onPress={() => setInformacoesVerdadeiras(!informacoesVerdadeiras)}>
                                    <Ionicons name={informacoesVerdadeiras ? "checkbox-outline" : "square-outline"} size={24} color="#477BDE" />
                                    <Text style={styles.checkboxLabel}>Declaro que todas as informações fornecidas são verdadeiras</Text>
                                </Pressable>
                                <View style={styles.checkboxItem}>
                                    <Pressable style={styles.checkboxItem} onPress={() => setSessoesPresenciais(!sessoesPresenciais)}>
                                        <Ionicons name={sessoesPresenciais ? "checkbox-outline" : "square-outline"} size={24} color="#477BDE" />
                                        <Text style={styles.checkboxLabel}>Concordo com sessões presenciais</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.checkboxItem}>
                                    <Pressable style={styles.checkboxItem} onPress={() => setSessoesOnline(!sessoesOnline)}>
                                        <Ionicons name={sessoesOnline ? "checkbox-outline" : "square-outline"} size={24} color="#477BDE" />
                                        <Text style={styles.checkboxLabel}>Concordo com sessões online</Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <Link href={`/paciente/psicologos/${usuarioAtual.id}/confirmarContrato`}>
                                <Pressable style={[styles.button, { backgroundColor: '#7fc517' }]} onPress={handleAssinarContrato}>
                                    <Text style={styles.buttonText}>
                                        <Ionicons name="pencil-outline" size={18} color="#fff" /> Assinar Contrato
                                    </Text>
                                </Pressable>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        fontFamily: 'Poppins-Light',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignSelf: 'center',
    },
    content: {
        alignItems: 'center',
    },
    cardContent: {
        backgroundColor: '#477BDE',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contractName: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 10,
        fontFamily: 'Poppins-Light',
        textAlign: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#F37187',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
        fontFamily: 'Poppins-Light'
    },
    checkboxContainer: {
        marginVertical: 10,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontFamily: 'Poppins-Light'
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Light',
        marginBottom: 5,
    },
    detailText: {
        height: 40,
        lineHeight: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        backgroundColor: '#f9f9f9',
        fontFamily: 'Poppins-Light'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
