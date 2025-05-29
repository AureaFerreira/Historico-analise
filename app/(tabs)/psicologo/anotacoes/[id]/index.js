import Header from '@/components/geral/header';
import { useAppContext } from "@/components/provider";
import { Ionicons } from '@expo/vector-icons';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';


export default function AnotacoesDetalhes() {
    const { id } = useLocalSearchParams();
    const { pacientes, listarNotas } = useAppContext();
    const [notas, setNotas] = useState([]);

    const paciente = pacientes.find((element) => element.id == id);

    useEffect(() => {
        const carregarNotas = async () => {
            const dados = await listarNotas(id);
            setNotas(dados);
        };
        carregarNotas();
    }, [id]);

    if (!paciente) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1 }} style={{backgroundColor:'white'}}>
            <Header corFundo="#F37187" href="psicologo/anotacoes" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.titulo}>{paciente.nome}</Text>
                </View>

                {notas.map((nota, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content style={styles.cardConteudo}>
                            <View style={styles.tituloCard}>
                                <Text style={styles.nome}>Ficha {nota.id} </Text>
                                <Text style={styles.nomes}>{format(nota.created_at, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</Text>

                            </View>
                            <Link href={`psicologo/anotacoes/${nota.id}/detalhesFicha`}>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Ionicons name="chevron-forward-outline" size={20} color={'#F37187'} />
                                </View>
                            </Link>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            <View style={styles.botaoMais}>
                <Link href={`/psicologo/anotacoes/${paciente.id}/fichaDeAvaliacao`}>
                    <IconButton
                        icon="plus"
                        iconColor="#fff"
                        size={24}
                        mode="contained"
                        containerColor="#F37187"
                    />
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titulo: {
        fontFamily: 'Poppins-Light',
        fontSize: 24,
        color: '#F37187',
        fontWeight: "bold",
        paddingVertical: 25
    },
    cardConteudo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    nome: {
        fontFamily: 'Poppins-Light',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
    },
        nomes: {
        fontFamily: 'Poppins-Light',
        fontSize: 15,
        marginBottom: 3,
        flex: 1,
    },
    tituloCard: {
        fontSize: 24,
        fontWeight: "bold"
    },
    scrollContent: {
        paddingBottom: 100,
    },
    botaoMais: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    }
});
