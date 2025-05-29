import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import CampoTextoCard from '@/components/psicologo/CampoTextoCard';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Checkbox } from 'react-native-paper';


export default function FichaAvaliacao() {
    const { inserirNota } = useAppContext();
    const [metas, setMetas] = useState("");
    const [anotacoes, setAnotacoes] = useState("");
    const [atividades, setAtividades] = useState("");
    const [feedback, setFeedback] = useState("");
    const [abordar, setAbordar] = useState("");
    const [listaHumor, setListaHumor] = useState([]);
    const { id } = useLocalSearchParams();

    const humorSelecionado = (value) => {
        if (listaHumor.includes(value)) {
            setListaHumor(listaHumor.filter(item => item !== value));
        } else {
            setListaHumor([...listaHumor, value]);
        }
    };

    const salvarNota = async () => {
        await inserirNota(1, id, 2, listaHumor, metas, anotacoes, atividades, feedback, abordar)
    };

    return (
        <ScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47', fontFamily: 'Poppins-Light' }} style={{backgroundColor:'white'}}>
            <Header corFundo={"#F37187"} href={`psicologo/anotacoes/${id}`}></Header>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.titulo}>FICHA DE AVALIAÇÃO</Text>
                <Text style={{ fontFamily: 'Poppins-Light' }}>Registro e Sessão</Text>
            </View>
            <Card style={styles.card}>
                <View style={styles.cabecalhoCard}>
                    <Text style={styles.tituloCard}>VERIFICAÇÃO DE HUMOR</Text>
                </View>

                <Card.Content>
                    <View style={styles.checkboxContainer}>
                        <View style={styles.checkboxItem}>
                            <Checkbox
                                status={listaHumor.includes('deprimido') ? 'checked' : 'unchecked'}
                                onPress={() => humorSelecionado('deprimido')}
                                color={'#F37187'}
                                
                            />
                            <Text style={styles.checkboxLabel}>Deprimido</Text>
                        </View>
                        <View style={styles.checkboxItem}>
                            <Checkbox
                                status={listaHumor.includes('ansioso') ? 'checked' : 'unchecked'}
                                color={'#F37187'}
                                onPress={() => humorSelecionado('ansioso')} 
                            />
                            <Text style={styles.checkboxLabel}>Ansioso</Text>
                        </View>
                        <View style={styles.checkboxItem}>
                            <Checkbox
                                status={listaHumor.includes('hiperativo') ? 'checked' : 'unchecked'}
                                color={'#F37187'}
                                onPress={() => humorSelecionado('hiperativo')}
                            />
                            <Text style={styles.checkboxLabel}>Hiperativo</Text>
                        </View>

                        <View style={styles.checkboxItem}>
                            <Checkbox
                                status={listaHumor.includes('culpado') ? 'checked' : 'unchecked'}
                                color={'#F37187'}
                                onPress={() => humorSelecionado('culpado')}
                            />
                            <Text style={styles.checkboxLabel}>Culpado</Text>
                        </View>
                        <View style={styles.checkboxItem}>
                            <Checkbox
                                status={listaHumor.includes('euforico') ? 'checked' : 'unchecked'}
                                color={'#F37187'}
                                onPress={() => humorSelecionado('euforico')}
                            />
                            <Text style={styles.checkboxLabel}>Eufórico</Text>
                        </View>
                        <View style={styles.checkboxItem}>
                            <Checkbox
                                status={listaHumor.includes('nervoso') ? 'checked' : 'unchecked'}
                                color={'#F37187'}
                                onPress={() => humorSelecionado('nervoso')}
                            />
                            <Text style={styles.checkboxLabel}>Nervoso</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
            <CampoTextoCard titulo="Metas terapêuticas" valor={metas} setValor={setMetas} />
            <CampoTextoCard titulo="Anotações relevantes" valor={anotacoes} setValor={setAnotacoes} />
            <CampoTextoCard titulo="Atividades da semana" valor={atividades} setValor={setAtividades} />
            <CampoTextoCard titulo="Feedback" valor={feedback} setValor={setFeedback} />
            <CampoTextoCard titulo="Abordar na próxima sessão" valor={abordar} setValor={setAbordar} />

            <View style={styles.estiloSalvar}>
                <Link href='psicologo/anotacoes'>
                    <Button style={styles.botaoSalvar} labelStyle={{fontFamily:'Poppins-Light'}}
                        buttonColor="#F37187" mode="contained" onPress={salvarNota}>
                        Salvar
                    </Button>
                </Link>
            </View>
        </ScrollView >
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
        justifyContent: 'center'
    },
    imagem: {
        width: 50,
        height: 50,
    },
    nome: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
    },
    goBackButton: {
        marginRight: 10,
        alignItems: 'left'
    },
    cabecalhoCard: {
        backgroundColor: "#F37187",
        alignItems: 'center',
        justifyContent: 'center',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10
    },
    botaoMais: {
        position: 'absolute',
        right: 20,
        bottom: -220
    },
    tituloCard: {
        fontFamily: 'Poppins-Light',
        fontSize: 12,
        fontWeight: "bold",
        color: "#ffff",
        paddingVertical: 5
    },
    botaoSalvar: {
        fontFamily: 'Poppins-Light',
        paddingHorizontal: 30
    },
    estiloSalvar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    caixaTexto: {
        fontFamily: 'Poppins-Light',
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 20,
        fontSize: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    checkboxItem: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontFamily: 'Poppins-Light',
        marginLeft: 8,
    },

})

