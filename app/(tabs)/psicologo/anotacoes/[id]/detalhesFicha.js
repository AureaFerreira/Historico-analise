import Header from '@/components/geral/header';
import { useAppContext } from "@/components/provider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

export default function detalhesFicha() {
    const { id } = useLocalSearchParams();
    const { buscaNotaId, pacientes } = useAppContext();
    const [notas, setNotas] = useState([]);
    const [paciente, setPaciente] = useState(null);

    useEffect(() => {
        const carregarNotas = async () => {
            const dados = await buscaNotaId(id);
            setNotas(dados);

            const idPaciente = dados[0]?.idPaciente;
            if (idPaciente && pacientes.length > 0) {
                const pacienteEncontrado = pacientes.find((p) => String(p.id) === String(idPaciente));
                setPaciente(pacienteEncontrado);
                console.log(paciente)
            }

            console.log("nota", dados);
        };
        carregarNotas();
    }, [id, pacientes]);

    if (!notas || !paciente) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    return (
        <ScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} style={{backgroundColor:'white'}}>
            <Header corFundo="#F37187" href={`/psicologo/anotacoes/${paciente.id}`} />

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.titulo}>Registro de Sessão</Text>
            </View>
            {notas.map((nota, index) => (
                <View style={styles.subtituloCard}>
                    <Text style={styles.nome}>Ficha {nota.id}</Text>
                    <Text style={styles.nomes}>{format(nota.created_at, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</Text>

                </View>
            ))}
            <Card style={styles.card}>
                <View style={styles.cabecalhoCard}>
                    <Text style={styles.tituloCard}>{paciente.nome}</Text>
                </View>
                <Card.Content>
                    {notas.map((nota) => (
                        <View key={nota.id} style={[styles.subtituloCard, { alignItems: 'flex-start' }]}>
                            <Text style={styles.tituloRelatorio}>Metas Terapêuticas</Text>
                            <Text style={styles.relatorio}>{nota.metasTerapeuticas} </Text>

                            <Text style={styles.tituloRelatorio}>Anotações Relevantes </Text>
                            <Text style={styles.relatorio}>{nota.anotacoesRelevantes} </Text>

                            <Text style={styles.tituloRelatorio}>Atividades da Semana </Text>
                            <Text style={styles.relatorio}>{nota.atividadesDaSemana} </Text>

                            <Text style={styles.tituloRelatorio}>Feedback</Text>
                            <Text style={styles.relatorio}>{nota.feedback} </Text>

                            <Text style={styles.tituloRelatorio}>Abordar na Próxima Sessão</Text>
                            <Text style={styles.relatorio}>{nota.abordarProximaSessao} </Text>

                            <Text style={styles.tituloRelatorio}>Verificação De Humor</Text>
                            <Text style={styles.relatorio}>{nota.verificacaoDeHumor?.join(', ')}</Text>
                        </View>
                    ))}

                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    capa: {
        width: "100%",
        height: 90,
        backgroundColor: "#F37187",
        borderBottomLeftRadius: 27,
        borderBottomRightRadius: 27,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Esta propriedade é para Android
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    voltar: {
        flex: 0,
        margin: 10,
    },
    logo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
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
    card: {
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'flex-start'
    },
    imagem: {
        width: 50,
        height: 50,
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
        // fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
    },
    tituloRelatorio: {
        fontFamily: 'Poppins-Light',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
        marginTop: 15
    },
    relatorio: {
        fontFamily: 'Poppins-Light',
        fontSize: 12,
        marginBottom: 3,
        flex: 1,
    }, loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    goBackButton: {
        marginRight: 10,
        alignItems: 'left'
    },
    tituloCard: {
        fontFamily: 'Poppins-Light',
        fontSize: 12,
        fontWeight: "bold",
        color: "#ffff",
        paddingVertical: 5
    },
    subtituloCard: {
        fontSize: 12,
        fontWeight: "bold",
        alignItems: 'center'
    },
    botaoMais: {
        position: 'absolute',
        right: 20,
        bottom: -220
    },
    cabecalhoCard: {
        backgroundColor: "#F37187",
        alignItems: 'center',
        justifyContent: 'center',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10
    }

})

